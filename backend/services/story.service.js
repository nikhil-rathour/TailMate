const Story = require("../models/story.model");

const createStory = async (storyData) => {
    console.log(storyData);
    const story = new Story(storyData);
    return await story.save();
};

const getStoryById = async (id) => {
    return await Story.findById(id);
}

const getAllStories = async () => {
    return await Story.find();
}

const updateStory = async (id, storyData) => {
    return await Story.findByIdAndUpdate(id, storyData, { new: true });
}

const deleteStory = async (id) => {
    return await Story.findByIdAndDelete(id);
}
module.exports = { createStory, getStoryById, getAllStories, updateStory,deleteStory };