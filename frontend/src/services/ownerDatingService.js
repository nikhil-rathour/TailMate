import axios from 'axios';
import { getAuthToken } from '../utils/authUtils';

const API_URL = `${import.meta.env.VITE_BACKEND}/api/owner-dating`;

/**
 * Create a new owner dating profile
 */
export const createOwnerDatingProfile = async (profileData) => {
  try {
    const token = await getAuthToken();
    const isFormData = profileData instanceof FormData;
    
    const response = await axios.post(`${API_URL}/Create-profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating owner dating profile:', error);
    throw error;
  }
};

/**
 * Get all owner dating profiles with optional filters
 */
export const getAllOwnerDatingProfiles = async (filters = {}) => {
  try {
    const token = await getAuthToken();
    // console.log(token);
    
    
    // Build params object for axios
    const params = { ...filters };
    
    const response = await axios.get(`${API_URL}/get-profiles`, { 
      params,
      
      headers: {
        Authorization: `Bearer ${token}`
      }
      
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching owner dating profiles:', error);
    throw error;
  }
};

/**
 * Get owner dating profile by ID
 */
export const getOwnerDatingProfileById = async (id) => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.get(`${API_URL}/profiles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching owner dating profile:', error);
    throw error;
  }
};

/**
 * Get current user's dating profile
 */
export const getMyOwnerDatingProfile = async () => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.get(`${API_URL}/my-profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user dating profile:', error);
    throw error;
  }
};

/**
 * Update owner dating profile
 */
export const updateOwnerDatingProfile = async (id, profileData) => {
  try {
    const token = await getAuthToken();
    const isFormData = profileData instanceof FormData;
    
    const response = await axios.put(`${API_URL}/profiles/${id}`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating owner dating profile:', error);
    throw error;
  }
};

/**
 * Delete owner dating profile
 */
export const deleteOwnerDatingProfile = async (id) => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.delete(`${API_URL}/profiles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error deleting owner dating profile:', error);
    throw error;
  }
};

/**
 * Find nearby owner dating profiles
 */
export const findNearbyOwnerDatingProfiles = async (longitude, latitude, maxDistance, filters = {}) => {
  try {
    const token = await getAuthToken();
    
    const params = {
      longitude,
      latitude,
      maxDistance,
      ...filters
    };
    
    const response = await axios.get(`${API_URL}/nearby`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error finding nearby profiles:', error);
    throw error;
  }
};

/**
 * Like a profile
 */
export const likeOwnerProfile = async (profileId) => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.post(`${API_URL}/like/${profileId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error liking profile:', error);
    throw error;
  }
};

/**
 * Pass on a profile
 */
export const passOwnerProfile = async (profileId) => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.post(`${API_URL}/pass/${profileId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error passing profile:', error);
    throw error;
  }
};

/**
 * Upload profile images
 */
export const uploadProfileImages = async (profileId, formData) => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.post(`${API_URL}/upload-images/${profileId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading profile images:', error);
    throw error;
  }
};