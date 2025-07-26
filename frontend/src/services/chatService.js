import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND;

/**
 * Start a chat with another user
 * @param {string} receiverId - The receiver's user ID (email prefix)
 * @param {Object} receiverInfo - Additional receiver information
 * @param {string} token - Firebase auth token
 * @returns {Promise<Object>} - Chat initiation result
 */
export const startChat = async (receiverId, receiverInfo = {}, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chats/start`,
      {
        receiverId,
        receiverInfo
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to start chat: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Get user chats
 * @param {string} token - Firebase auth token
 * @returns {Promise<Array>} - Array of user chats
 */
export const getUserChats = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/chats/user-chats`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get user chats: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Navigate to chat with user
 * @param {Object} navigate - React Router navigate function
 * @param {string} receiverId - The receiver's user ID
 * @param {Object} receiverInfo - Additional receiver information
 */
export const navigateToChat = (navigate, receiverId, receiverInfo = {}) => {
  navigate(`/chat/${receiverId}`, {
    state: {
      receiverName: receiverInfo.name || receiverId,
      receiverImage: receiverInfo.picture || 'https://via.placeholder.com/150'
    }
  });
};