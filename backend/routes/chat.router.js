const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Send a new message
router.post('/messages', verifyToken, chatController.sendMessage);

// Get chat history between two users
router.get('/history/:userId1/:userId2', verifyToken, chatController.getChatHistory);

// Get all chats for a user
router.get('/user/:userId', verifyToken, chatController.getUserChats);

// Mark messages as read
router.put('/read', verifyToken, chatController.markMessagesAsRead);

module.exports = router;