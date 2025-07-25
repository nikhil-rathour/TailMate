import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND}/api/stories`;

export const CreateStory = async (storyData) => {
    try {
        const response = await axios.post(`${API_URL}/create-story`, storyData);
        return response.data;
    } catch (error) {
        console.error('Error creating story:', error);
        throw error;
    }
}

export const GetAllStories = async () => {
    try {
        const response = await axios.get(`${API_URL}/get-all-stories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stories:', error);
        throw error;
    }
}

export const DeleteStory = async (storyId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-story/${storyId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting story:', error);
        throw error;
    }
}

export const UpdateStory = async (storyId, storyData) => {
    try {
        const response = await axios.put(`${API_URL}/update-story/${storyId}`, storyData);
        return response.data;
    } catch (error) {
        console.error('Error updating story:', error);
        throw error;
    }
    
}

export const GetStoryById = async (storyId) => {
    try {
        const response = await axios.get(`${API_URL}/get-story-by-id/${storyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching story details:', error);
        throw error;
    }
}