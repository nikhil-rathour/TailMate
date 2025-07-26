const express = require("express")
const multer = require("multer")
const router = express.Router()
const storyController = require("../controllers/story.controlller")

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

router.post("/create-story", upload.single('mediaFile'), storyController.createStory)
router.get("/get-all-stories", storyController.getAllStories)
router.get("/get-story-by-id/:id", storyController.getStoryById)
router.put("/update-story/:id", upload.single('mediaFile'), storyController.updateStory)
router.delete("/delete-story/:id", storyController.deleteStory)
module.exports = router

