const express = require('express');
const router = express.Router();
const ownerDatingController = require('../controllers/owenerdating.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Create a new owner dating profile with image upload
router.post('/Create-profile', ownerDatingController.upload.single('ProfilePicture'), ownerDatingController.createProfile);

// Get all owner dating profiles with filtering
router.get('/get-profiles', ownerDatingController.getAllProfiles);

// Get current user's dating profile
router.get('/my-profile', ownerDatingController.getMyProfile);

// Get owner dating profile by ID
router.get('/profiles/:id', ownerDatingController.getProfileById);

// Update owner dating profile
router.put('/profiles/:id', ownerDatingController.upload.single('ProfilePicture'), ownerDatingController.updateProfile);

// Delete owner dating profile
router.delete('/profiles/:id', ownerDatingController.deleteProfile);

// Find nearby profiles based on location
router.get('/nearby', ownerDatingController.findNearbyProfiles);

// Like a profile
router.post('/like/:profileId', ownerDatingController.likeProfile);

// Pass on a profile
router.post('/pass/:profileId', ownerDatingController.passProfile);

module.exports = router;