import Message from '../models/Message.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js'; // Assuming Chat model is used

// Helper function to generate or get a chatId for 1-on-1 chats
// Also creates or updates the Chat document
const getOrCreateChatId = async (user1Id, user2Id, lastMessage = null) => {
  const participants = [user1Id, user2Id].sort(); // Sort to ensure consistency

  let chat = await Chat.findOneAndUpdate(
    { participants },
    {
      participants, // Ensure participants are set/updated
      ...(lastMessage && { lastMessage: lastMessage._id, lastMessageAt: lastMessage.timestamp }),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return chat._id.toString(); // Return the _id of the Chat document as the chatId
};


// @desc    Send a message to a contact
// @route   POST /api/v1/messages/:contactId
// @access  Private
export const sendMessage = async (req, res) => {
  const senderId = req.user._id; // Authenticated user
  const receiverId = req.params.contactId;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Message content cannot be empty.' });
  }

  if (senderId.toString() === receiverId.toString()) {
    return res.status(400).json({ message: 'Cannot send message to yourself.' });
  }

  try {
    // Check if receiver exists
    const receiverUser = await User.findById(receiverId);
    if (!receiverUser) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }

    // Create the message
    const newMessage = new Message({
      // chatId will be set after Chat document is ensured
      senderId,
      receiverId,
      content,
      status: 'sent', // Default status
    });

    // Get or create Chat document and update it with the last message
    // The chatId for the message will be the _id of the Chat document
    const chatId = await getOrCreateChatId(senderId, receiverId, newMessage);
    newMessage.chatId = chatId; // Assign the Chat._id as the message's chatId

    const savedMessage = await newMessage.save();

    // Populate sender and receiver details for the response
    await savedMessage.populate('senderId', 'firstName lastName avatarUrl role');
    await savedMessage.populate('receiverId', 'firstName lastName avatarUrl role');
    
    // Also update the Chat document's lastMessage and lastMessageAt fields explicitly
    // because the initial newMessage object passed to getOrCreateChatId didn't have its _id yet.
    await Chat.findByIdAndUpdate(chatId, {
        lastMessage: savedMessage._id,
        lastMessageAt: savedMessage.timestamp
    });


    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ message: 'Server error sending message.' });
  }
};

// @desc    Get messages with a specific contact
// @route   GET /api/v1/messages/:contactId
// @access  Private
export const getMessagesWithContact = async (req, res) => {
  const userId = req.user._id; // Authenticated user
  const contactId = req.params.contactId; // The other user in the conversation
  const { page = 1, limit = 20 } = req.query;

  try {
    // Check if contact user exists
     const contactUser = await User.findById(contactId);
    if (!contactUser) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    // Determine the chatId using the Chat model
    const participants = [userId, contactId].sort();
    const chat = await Chat.findOne({ participants });

    if (!chat) {
      // No chat history exists with this contact
      return res.json({
        messages: [],
        totalPages: 0,
        currentPage: 1,
        totalMessages: 0,
      });
    }

    const chatId = chat._id.toString();

    const messages = await Message.find({ chatId })
      .populate('senderId', 'firstName lastName avatarUrl role')
      .populate('receiverId', 'firstName lastName avatarUrl role')
      .sort({ timestamp: -1 }) // Most recent first
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Message.countDocuments({ chatId });

    // Optional: Mark messages as 'read'
    // This is a simplified version. A more robust solution might involve checking if req.user is the receiver.
    // And only update if the status is 'delivered'.
    await Message.updateMany(
      { chatId: chatId, receiverId: userId, status: { $in: ['sent', 'delivered'] } },
      { $set: { status: 'read' } }
    );

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first in UI typically
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalMessages: count,
    });
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ message: 'Server error fetching messages.' });
  }
};

// @desc    Get contacts (chat list) for the logged-in user
// @route   GET /api/v1/messages/contacts
// @access  Private
export const getContacts = async (req, res) => {
  const userId = req.user._id;

  try {
    const chats = await Chat.find({ participants: userId })
      .populate({
        path: 'participants',
        select: 'firstName lastName email role avatarUrl', // Select fields for participants
        match: { _id: { $ne: userId } } // Exclude the current user from populated participants
      })
      .populate({
        path: 'lastMessage',
        populate: { // Nested populate for sender of last message
            path: 'senderId',
            select: 'firstName lastName'
        }
      })
      .sort({ lastMessageAt: -1 }) // Sort by most recent activity
      .exec();

    const contacts = await Promise.all(
        chats.map(async (chat) => {
        const otherParticipant = chat.participants.find(p => p._id.toString() !== userId.toString());

        if (!otherParticipant) return null; // Should not happen in a 2-participant chat

        const unreadCount = await Message.countDocuments({
          chatId: chat._id.toString(),
          receiverId: userId,
          status: { $in: ['sent', 'delivered'] }, // Count messages not yet 'read' by the user
        });
        
        let lastMessageContent = "No messages yet.";
        let lastMessageSender = "";
        if (chat.lastMessage) {
            lastMessageContent = chat.lastMessage.content;
            if (chat.lastMessage.senderId._id.toString() === userId.toString()) {
                lastMessageSender = "You: ";
            }
        }


        return {
          id: otherParticipant._id, // This is the contact's User ID
          chatId: chat._id,
          name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
          role: otherParticipant.role,
          avatarUrl: otherParticipant.avatarUrl,
          lastMessage: `${lastMessageSender}${lastMessageContent}`,
          lastMessageTime: chat.lastMessageAt || chat.updatedAt,
          unreadCount,
          online: false, // Placeholder for online status
        };
      })
    );

    res.json(contacts.filter(contact => contact !== null)); // Filter out any nulls if a chat had issues
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({ message: 'Server error fetching contacts.' });
  }
};


// @desc    Get unread message count for the logged-in user
// @route   GET /api/v1/messages/unread-count
// @access  Private
export const getUnreadMessageCount = async (req, res) => {
  const userId = req.user._id;

  try {
    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      status: { $in: ['sent', 'delivered'] }, // Messages that are not yet 'read'
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get Unread Count Error:', error);
    res.status(500).json({ message: 'Server error fetching unread message count.' });
  }
};
