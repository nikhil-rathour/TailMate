import axios from 'axios';
import { getAuthToken } from '../utils/authUtils';

const API_URL = `${import.meta.env.VITE_BACKEND}/api/dating-pets`;

// Get all pets with optional filters
export const getAllDatingPets = async (filters = {}) => {
  try {
    // Build params object for axios
    const params = {};
    if (filters.type && filters.type !== 'all') params.type = filters.type;
    if (filters.listingType && filters.listingType !== 'all') params.listingType = filters.listingType;
    if (filters.breed && filters.breed.trim() !== '') params.breed = filters.breed;
    
    const response = await axios.get(`${API_URL}/pets`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};

// Get pet by ID
export const getDatingPetById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/pets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pet details:', error);
    throw error;
  }
};

// Get pets by owner email
export const getDatingPetsByOwnerEmail = async (email, config = {}) => {
  try {
    const response = await axios.get(`${API_URL}/owner-pets`, { 
      params: { ownerEmail: email },
      ...config
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pets by owner email:', error);
    throw error;
  }
};

// Add new pet (requires authentication)
export const addDatingPet = async (petData) => {
  try {
    const token = await getAuthToken();
    const isFormData = petData instanceof FormData;
    const response = await axios.post(`${API_URL}/add-pet`, petData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding pet:', error);
    throw error;
  }
};

// Update pet (requires authentication)
export const updateDatingPet = async (id, petData) => {
  try {
    const token = await getAuthToken();
    const isFormData = petData instanceof FormData;
    const response = await axios.put(`${API_URL}/update-pet/${id}`, petData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating pet:', error);
    throw error;
  }
};

// Delete pet (requires authentication)
export const deleteDatingPet = async (id) => {
  try {
    const token = await getAuthToken();
    const response = await axios.delete(`${API_URL}/delete-pet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw error;
  }
};