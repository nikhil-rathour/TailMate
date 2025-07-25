import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND;

export const createMatch = async (matchUserId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/matches`,
      { matchUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create match: ${error.response?.data?.message || error.message}`);
  }
};

export const getMatches = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/matches`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get matches: ${error.response?.data?.message || error.message}`);
  }
};

export const deleteMatch = async (matchUserId, token) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/matches/${matchUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete match: ${error.response?.data?.message || error.message}`);
  }
};