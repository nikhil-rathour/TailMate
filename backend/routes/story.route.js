const express = require("express")
const router = express.Router()
const storyController = require("../controllers/story.controlller")

router.post("/create-story", storyController.createStory)
router.get("/get-all-stories", storyController.getAllStories)
router.get("/get-story-by-id/:id", storyController.getStoryById)
router.put("/update-story/:id", storyController.updateStory)
router.delete("/delete-story/:id", storyController.deleteStory)
module.exports = router

