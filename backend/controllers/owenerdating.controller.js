const ownerDatingService = require('../services/owenerdating.service');
const User = require('../models/user.model');
const { uploadImage } = require('../services/gcs.service');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Create a new owner dating profile
 */
const createProfile = async (req, res) => {
  try {
    // Find or create user based on Firebase UID
    let user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      user = new User({
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture
      });
      await user.save();
    }
    
    // Check if user already has a dating profile
    const existingProfile = await ownerDatingService.getProfileByUserId(user._id);
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'You already have a dating profile. You can only edit your existing profile.'
      });
    }
    
    let profilePictureUrl = '';
    
    // Handle image upload if file is provided
    if (req.file) {
      const fileName = `owner-dating/${user._id}-${Date.now()}.${req.file.mimetype.split('/')[1]}`;
      profilePictureUrl = await uploadImage(req.file.buffer, fileName, req.file.mimetype);
    }
    
    // Add user ID and profile picture URL from authenticated request
    const profileData = {
      ...req.body,
      user: user._id,
      ProfilePicture: profilePictureUrl || req.body.ProfilePicture
    };
    
    const profile = await ownerDatingService.createOwnerDatingProfile(profileData);
    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error creating owner dating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create owner dating profile',
      error: error.message
    });
  }
};

/**
 * Get all owner dating profiles with filtering
 */
const getAllProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, gender, minAge, maxAge, location } = req.query;
    
    const filters = {
      gender,
      minAge: minAge ? parseInt(minAge) : undefined,
      maxAge: maxAge ? parseInt(maxAge) : undefined,
      location
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const result = await ownerDatingService.getAllProfiles(
      filters,
      parseInt(page),
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching owner dating profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch owner dating profiles',
      error: error.message
    });
  }
};

/**
 * Get owner dating profile by ID
 */
const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await ownerDatingService.getProfileById(id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Owner dating profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching owner dating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch owner dating profile',
      error: error.message
    });
  }
};

/**
 * Get current user's dating profile
 */
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const profile = await ownerDatingService.getProfileByUserId(user._id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'You do not have an owner dating profile'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching user dating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user dating profile',
      error: error.message
    });
  }
};

/**
 * Update owner dating profile
 */
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if profile exists and belongs to user
    const existingProfile = await ownerDatingService.getProfileById(id);
    
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Owner dating profile not found'
      });
    }
    
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Ensure user can only update their own profile
    if (existingProfile.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this profile'
      });
    }
    
    let profilePictureUrl = existingProfile.ProfilePicture;
    
    // Handle image upload if file is provided
    if (req.file) {
      const fileName = `owner-dating/${user._id}-${Date.now()}.${req.file.mimetype.split('/')[1]}`;
      profilePictureUrl = await uploadImage(req.file.buffer, fileName, req.file.mimetype);
    }
    
    // Prepare update data
    const updateData = {
      ...req.body,
      ProfilePicture: profilePictureUrl
    };
    
    const updatedProfile = await ownerDatingService.updateProfile(id, updateData);
    
    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating owner dating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update owner dating profile',
      error: error.message
    });
  }
};

/**
 * Delete owner dating profile
 */
const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if profile exists and belongs to user
    const existingProfile = await ownerDatingService.getProfileById(id);
    
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Owner dating profile not found'
      });
    }
    
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Ensure user can only delete their own profile
    if (existingProfile.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this profile'
      });
    }
    
    await ownerDatingService.deleteProfile(id);
    
    res.status(200).json({
      success: true,
      message: 'Owner dating profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting owner dating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete owner dating profile',
      error: error.message
    });
  }
};

/**
 * Find nearby profiles
 */
const findNearbyProfiles = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50, gender, minAge, maxAge } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }
    
    const coordinates = [parseFloat(longitude), parseFloat(latitude)];
    const maxDistanceMeters = parseFloat(maxDistance) * 1000; // Convert km to meters
    
    const filters = {
      gender,
      minAge: minAge ? parseInt(minAge) : undefined,
      maxAge: maxAge ? parseInt(maxAge) : undefined
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const profiles = await ownerDatingService.findNearbyProfiles(
      coordinates,
      maxDistanceMeters,
      filters
    );
    
    res.status(200).json({
      success: true,
      data: profiles
    });
  } catch (error) {
    console.error('Error finding nearby profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find nearby profiles',
      error: error.message
    });
  }
};

/**
 * Like a profile
 */
const likeProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const result = await ownerDatingService.likeProfile(user._id, profileId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error liking profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like profile',
      error: error.message
    });
  }
};

/**
 * Pass on a profile
 */
const passProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const result = await ownerDatingService.passProfile(user._id, profileId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error passing profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pass profile',
      error: error.message
    });
  }
};

/**
 * Toggle profile active status (pause/unpause)
 */
const toggleProfileStatus = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const result = await ownerDatingService.toggleProfileStatus(user._id);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error toggling profile status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle profile status',
      error: error.message
    });
  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileById,
  getMyProfile,
  updateProfile,
  deleteProfile,
  findNearbyProfiles,
  likeProfile,
  passProfile,
  toggleProfileStatus,
  upload
};