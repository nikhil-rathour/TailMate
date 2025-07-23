const Chat = require('../models/chat.model');
const User = require('../models/user.model');

/**
 * Create a new chat message
 * @param {Object} messageData - The message data
 * @returns {Promise<Object>} - The created message
 */
const createMessage = async (messageData) => {
  try {
    const message = new Chat(messageData);
    await message.save();
    return message;
  } catch (error) {
    throw new Error(`Error creating message: ${error.message}`);
  }
};

/**
 * Get chat history between two users
 * @param {String} userId1 - First user ID
 * @param {String} userId2 - Second user ID
 * @returns {Promise<Array>} - Array of chat messages
 */
const getChatHistory = async (userId1, userId2) => {
  try {
    const messages = await Chat.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ createdAt: 1 });
    
    return messages;
  } catch (error) {
    throw new Error(`Error fetching chat history: ${error.message}`);
  }
};

/**
 * Mark messages as read
 * @param {String} senderId - Sender ID
 * @param {String} receiverId - Receiver ID
 * @returns {Promise<Object>} - Update result
 */
const markMessagesAsRead = async (senderId, receiverId) => {
  try {
    const result = await Chat.updateMany(
      { senderId, receiverId, isRead: false },
      { $set: { isRead: true } }
    );
    return result;
  } catch (error) {
    throw new Error(`Error marking messages as read: ${error.message}`);
  }
};

/**
 * Get all chats for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} - Array of unique chat partners with latest message
 */
const getUserChats = async (userId) => {
  try {
    // Find all messages where the user is either sender or receiver
    const messages = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 });
    
    // Get unique chat partners
    const chatPartners = new Map();
    
    messages.forEach(message => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!chatPartners.has(partnerId)) {
        chatPartners.set(partnerId, {
          userId: partnerId,
          lastMessage: message.message,
          lastMessageTime: message.createdAt,
          unreadCount: message.receiverId === userId && !message.isRead ? 1 : 0
        });
      } else if (message.receiverId === userId && !message.isRead) {
        // Increment unread count
        const partner = chatPartners.get(partnerId);
        partner.unreadCount += 1;
        chatPartners.set(partnerId, partner);
      }
    });
    
    // Get user information for each chat partner
    const chats = Array.from(chatPartners.values());
    
    // Fetch user information for each partner
    for (const chat of chats) {
      try {
        // Find user where email starts with partnerId
        const user = await User.findOne({ 
          email: new RegExp(`^${chat.userId}@`, 'i') 
        });
        
        if (user) {
          chat.userName = user.name;
          chat.userImage = user.picture;
        }
      } catch (err) {
        console.error(`Error fetching user info for ${chat.userId}:`, err);
        // Continue with default values if user info fetch fails
      }
    }
    
    return chats;
  } catch (error) {
    throw new Error(`Error fetching user chats: ${error.message}`);
  }
};

module.exports = {
  createMessage,
  getChatHistory,
  markMessagesAsRead,
  getUserChats
};