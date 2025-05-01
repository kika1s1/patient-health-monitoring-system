import Notification from '../models/Notification.js';

// @desc    Get notifications for the authenticated user
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  const userId = req.user._id;
  const { status, page = 1, limit = 10 } = req.query; // Default limit to 10

  const query = { userId };

  if (status === 'read') {
    query.read = true;
  } else if (status === 'unread') {
    query.read = false;
  }
  // If no status or an invalid status is provided, all notifications for the user are fetched.

  try {
    const notifications = await Notification.find(query)
      .sort({ timestamp: -1 }) // Most recent first
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Notification.countDocuments(query);

    res.json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalNotifications: count,
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ message: 'Server error fetching notifications.' });
  }
};

// @desc    Mark a specific notification as read
// @route   POST /api/v1/notifications/:id/mark-as-read
// @access  Private
export const markAsRead = async (req, res) => {
  const userId = req.user._id;
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId }, // Ensure user owns the notification
      { read: true, updatedAt: new Date() }, // Explicitly set updatedAt if needed, though Mongoose timestamps handle it
      { new: true } // Return the updated document
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or not authorized.' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Mark Notification As Read Error:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Notification not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error marking notification as read.' });
  }
};

// @desc    Mark all unread notifications as read for the authenticated user
// @route   POST /api/v1/notifications/mark-all-as-read
// @access  Private
export const markAllAsRead = async (req, res) => {
  const userId = req.user._id;

  try {
    const result = await Notification.updateMany(
      { userId: userId, read: false },
      { read: true, updatedAt: new Date() } // Explicitly set updatedAt if needed
    );

    res.json({ message: `${result.modifiedCount} notifications marked as read.` });
  } catch (error) {
    console.error('Mark All Notifications As Read Error:', error);
    res.status(500).json({ message: 'Server error marking all notifications as read.' });
  }
};
