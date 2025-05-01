import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes in this router, as they are user-specific
// router.use(protect);

// @route   GET /api/v1/notifications
// @desc    Get notifications for the authenticated user
// @access  Private
router.get('/', getNotifications);

// @route   POST /api/v1/notifications/:id/mark-as-read
// @desc    Mark a specific notification as read
// @access  Private
router.post('/:id/mark-as-read', markAsRead);

// @route   POST /api/v1/notifications/mark-all-as-read
// @desc    Mark all unread notifications as read for the authenticated user
// @access  Private
router.post('/mark-all-as-read', markAllAsRead);

export default router;
