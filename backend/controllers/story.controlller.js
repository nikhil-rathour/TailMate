const storyService = require("../services/story.service");
const { uploadImage } = require("../services/gcs.service");

const createStory = async (req, res) => {
  try {
    let storyData = { ...req.body };

    // Handle tags if they come as JSON string
    if (typeof storyData.tags === 'string') {
      try {
        storyData.tags = JSON.parse(storyData.tags);
      } catch {
        storyData.tags = storyData.tags.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    // Handle file upload if present
    if (req.file) {
      const fileName = `stories/${Date.now()}-${req.file.originalname}`;
      const mediaUrl = await uploadImage(req.file.buffer, fileName, req.file.mimetype);
      storyData.mediaUrl = mediaUrl;
    }

    if (!storyData.userId || !storyData.title || !storyData.header || !storyData.content) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const story = await storyService.createStory(storyData);
    res.status(201).json({ success: true, message: "Story created successfully", data: story });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};


const getAllStories = async (req, res) => {
    try {
        const stories = await storyService.getAllStories();
        res.status(200).json({ success: true, data: stories });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getStoryById = async (req, res) => {
    try {
        const storyId = req.params.id;
        const story = await storyService.getStoryById(storyId);
        if (!story) {
            return res.status(404).json({ success: false, message: "Story not found" });
        }
        res.status(200).json({ success: true, data: story });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        let updatedStoryData = { ...req.body };

        // Handle tags if they come as JSON string
        if (typeof updatedStoryData.tags === 'string') {
            try {
                updatedStoryData.tags = JSON.parse(updatedStoryData.tags);
            } catch {
                updatedStoryData.tags = updatedStoryData.tags.split(',').map(t => t.trim()).filter(Boolean);
            }
        }

        // Handle file upload if present
        if (req.file) {
            const fileName = `stories/${Date.now()}-${req.file.originalname}`;
            const mediaUrl = await uploadImage(req.file.buffer, fileName, req.file.mimetype);
            updatedStoryData.mediaUrl = mediaUrl;
        }

        const updatedStory = await storyService.updateStory(storyId, updatedStoryData);
        res.status(200).json({ success: true, message: "Story updated successfully", data: updatedStory });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        await storyService.deleteStory(storyId);
        res.status(200).json({ success: true, message: "Story deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createStory,
    getAllStories,
    getStoryById,
    updateStory,
    deleteStory
}