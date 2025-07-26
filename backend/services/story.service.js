const Story = require("../models/story.model");
const { deleteMediaFile } = require("../utils/story.utils");

const createStory = async (storyData) => {
    console.log('Creating story with data:', storyData);
    const story = new Story(storyData);
    return await story.save();
};

const getStoryById = async (id) => {
    return await Story.findById(id).populate('userId', 'name email');
}

const getAllStories = async () => {
    return await Story.find().populate('userId', 'name email').sort({ createdAt: -1 });
}

const updateStory = async (id, storyData) => {
    // Get existing story to handle media cleanup
    const existingStory = await Story.findById(id);
    
    // If new media is uploaded and old media exists, delete old media
    if (storyData.mediaUrl && existingStory?.mediaUrl && storyData.mediaUrl !== existingStory.mediaUrl) {
        await deleteMediaFile(existingStory.mediaUrl);
    }
    
    storyData.updatedAt = new Date();
    return await Story.findByIdAndUpdate(id, storyData, { new: true }).populate('userId', 'name email');
}

const deleteStory = async (id) => {
    const story = await Story.findById(id);
    
    // Delete associated media file if exists
    if (story?.mediaUrl) {
        await deleteMediaFile(story.mediaUrl);
    }
    
    return await Story.findByIdAndDelete(id);
}

module.exports = { createStory, getStoryById, getAllStories, updateStory, deleteStory };