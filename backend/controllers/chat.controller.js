const chatService = require('../services/chat.service');

/**
 * Send a new message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, mediaUrl, mediaType } = req.body;
    
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    const messageData = {
      senderId,
      receiverId,
      message,
      mediaUrl,
      mediaType,
      isRead: false,
      isDeleted: false,
      isSent: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const newMessage = await chatService.createMessage(messageData);
    
    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get chat history between two users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatHistory = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    
    if (!userId1 || !userId2) {
      return res.status(400).json({
        success: false,
        message: 'Both user IDs are required'
      });
    }
    
    const messages = await chatService.getChatHistory(userId1, userId2);
    
    // Mark messages as read
    await chatService.markMessagesAsRead(userId2, userId1);
    
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all chats for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const chats = await chatService.getUserChats(userId);
    
    res.status(200).json({
      success: true,
      data: chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Mark messages as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    
    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Both sender and receiver IDs are required'
      });
    }
    
    const result = await chatService.markMessagesAsRead(senderId, receiverId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getUserChats,
  markMessagesAsRead
};