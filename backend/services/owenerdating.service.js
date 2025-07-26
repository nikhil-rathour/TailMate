const OwnerDating = require('../models/owenerdating.model');
const User = require('../models/user.model');

/**
 * Create a new owner dating profile
 */
const createOwnerDatingProfile = async (profileData) => {
  try {
    const newProfile = new OwnerDating(profileData);
    return await newProfile.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Get all owner dating profiles with optional filters
 */
const getAllProfiles = async (filters = {}, page = 1, limit = 10) => {
  try {
    const query = {}; // Remove restrictive filters to show all profiles
    
    // Apply filters
    if (filters.gender) query.gender = filters.gender;
    if (filters.minAge) query.OwnerAge = { $gte: filters.minAge };
    if (filters.maxAge) {
      query.OwnerAge = query.OwnerAge || {};
      query.OwnerAge.$lte = filters.maxAge;
    }
    if (filters.location) query.location = new RegExp(filters.location, 'i');
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const profiles = await OwnerDating.find(query)
      .populate('user', 'name email picture')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const total = await OwnerDating.countDocuments(query);
    
    return {
      profiles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get owner dating profile by ID
 */
const getProfileById = async (profileId) => {
  try {
    return await OwnerDating.findById(profileId)
      .populate('user', 'name email picture');
  } catch (error) {
    throw error;
  }
};

/**
 * Get owner dating profile by user ID
 */
const getProfileByUserId = async (userId) => {
  try {
    return await OwnerDating.findOne({ user: userId })
      .populate('user', 'name email picture');
  } catch (error) {
    throw error;
  }
};

/**
 * Update owner dating profile
 */
const updateProfile = async (profileId, updateData) => {
  try {
    return await OwnerDating.findByIdAndUpdate(
      profileId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('user', 'name email picture');
  } catch (error) {
    throw error;
  }
};

/**
 * Delete owner dating profile
 */
const deleteProfile = async (profileId) => {
  try {
    return await OwnerDating.findByIdAndDelete(profileId);
  } catch (error) {
    throw error;
  }
};

/**
 * Find nearby profiles based on coordinates
 */
const findNearbyProfiles = async (coordinates, maxDistance = 50000, filters = {}) => {
  try {
    const query = {
      isOwnerDating: true,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: maxDistance // in meters
        }
      }
    };
    
    // Apply additional filters
    if (filters.gender) query.gender = filters.gender;
    if (filters.minAge) query.OwnerAge = { $gte: filters.minAge };
    if (filters.maxAge) {
      query.OwnerAge = query.OwnerAge || {};
      query.OwnerAge.$lte = filters.maxAge;
    }
    
    return await OwnerDating.find(query)
      .populate('user', 'name email picture')
      .limit(20);
  } catch (error) {
    throw error;
  }
};

/**
 * Like a profile
 */
const likeProfile = async (userId, profileId) => {
  try {
    const userProfile = await OwnerDating.findOne({ user: userId });
    const targetProfile = await OwnerDating.findById(profileId);
    
    if (!userProfile || !targetProfile) {
      throw new Error('Profile not found');
    }
    
    // Add like if not already liked
    if (!userProfile.likes.includes(profileId)) {
      userProfile.likes.push(profileId);
      await userProfile.save();
    }
    
    // Check for mutual like (match)
    if (targetProfile.likes.includes(userProfile._id)) {
      // It's a match!
      if (!userProfile.matches.includes(profileId)) {
        userProfile.matches.push(profileId);
        await userProfile.save();
      }
      if (!targetProfile.matches.includes(userProfile._id)) {
        targetProfile.matches.push(userProfile._id);
        await targetProfile.save();
      }
      return { match: true, message: 'It\'s a match!' };
    }
    
    return { match: false, message: 'Profile liked' };
  } catch (error) {
    throw error;
  }
};

/**
 * Pass on a profile
 */
const passProfile = async (userId, profileId) => {
  try {
    const userProfile = await OwnerDating.findOne({ user: userId });
    
    if (!userProfile) {
      throw new Error('Profile not found');
    }
    
    // Add pass if not already passed
    if (!userProfile.passes.includes(profileId)) {
      userProfile.passes.push(profileId);
      await userProfile.save();
    }
    
    return { message: 'Profile passed' };
  } catch (error) {
    throw error;
  }
};

/**
 * Add images to profile
 */
const addImages = async (profileId, imageUrls) => {
  try {
    const profile = await OwnerDating.findById(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    // Add new images to existing ones
    profile.images = profile.images || [];
    profile.images.push(...imageUrls);
    
    // Limit to 6 images max
    if (profile.images.length > 6) {
      profile.images = profile.images.slice(-6);
    }
    
    await profile.save();
    return await OwnerDating.findById(profileId).populate('user', 'name email picture');
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle profile status
 */
const toggleProfileStatus = async (userId) => {
  try {
    const profile = await OwnerDating.findOne({ user: userId });
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    profile.isActive = !profile.isActive;
    await profile.save();
    
    return await OwnerDating.findById(profile._id).populate('user', 'name email picture');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOwnerDatingProfile,
  getAllProfiles,
  getProfileById,
  getProfileByUserId,
  updateProfile,
  deleteProfile,
  findNearbyProfiles,
  likeProfile,
  passProfile,
  addImages,
  toggleProfileStatus
};