import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    // To ensure a unique chat for a pair of users (for 1-on-1 chats)
    // For group chats, this unique index would need to be different or removed.
    // This assumes participants array will always be sorted before saving to ensure consistency.
    // Example: [userA_id, userB_id] will be the same as [userB_id, userA_id] if sorted.
    // A compound index can also be used if participants are always stored in a sorted order.
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for quickly finding chats by participants
// This specific index might be complex for array elements.
// A more common approach is to query for chats where participants array contains the user's ID.

// Pre-save hook to ensure participants are sorted for 1-on-1 chats to maintain uniqueness
// This is a simplified approach for 1-on-1. For group chats, uniqueness is different.
chatSchema.pre('save', function(next) {
  if (this.isNew && this.participants.length === 2) {
    this.participants.sort(); // Sorts participant IDs alphabetically/numerically
  }
  next();
});


const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
