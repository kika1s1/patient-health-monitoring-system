import express from 'express';
import {
  sendMessage,
  getMessagesWithContact,
  getContacts,
  getUnreadMessageCount,
} from '../controllers/messageController.js';
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes in this route
// router.use(protect);

// @route   GET /api/v1/messages/contacts
// @desc    Get chat contacts for the logged-in user
// @access  Private
router.get('/contacts', getContacts);

// @route   GET /api/v1/messages/unread-count
// @desc    Get unread message count for the logged-in user
// @access  Private
router.get('/unread-count', getUnreadMessageCount);

// @route   GET /api/v1/messages/:contactId
// @desc    Get messages with a specific contact
// @access  Private
router.get('/:contactId', getMessagesWithContact);

// @route   POST /api/v1/messages/:contactId
// @desc    Send a message to a contact
// @access  Private
router.post('/:contactId', sendMessage);

export default router;
