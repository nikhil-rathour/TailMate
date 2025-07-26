const Match = require("../models/match.model");
const User = require("../models/user.model");
const OwnerDating = require("../models/owenerdating.model");

const matchService = {
  async createMatch(currentUserId, matchUserId) {
    // Check if match already exists
    const existingMatch = await Match.findOne({
      $or: [
        { currentUserId, matchUserId },
        { currentUserId: matchUserId, matchUserId: currentUserId }
      ]
    });
    
    if (existingMatch) {
      return existingMatch;
    }
    
    const match = new Match({
      currentUserId,
      matchUserId,
      updatedAt: new Date()
    });
    return await match.save();
  },

  async getMatchesByUserId(userId) {
    const matches = await Match.find({
      $or: [
        { currentUserId: userId },
        { matchUserId: userId }
      ]
    });
    
    // Get user details for each match
    const matchesWithUserData = await Promise.all(
      matches.map(async (match) => {
        const matchedUserId = match.currentUserId === userId ? match.matchUserId : match.currentUserId;
        
        console.log('Looking for user with ID:', matchedUserId);
        
        // Try to find user in User collection first
        let matchedUser = await User.findOne({ uid: matchedUserId });
        
        // If not found, try OwnerDating collection and populate user data
        if (!matchedUser) {
          const ownerProfile = await OwnerDating.findById(matchedUserId).populate('user').catch(() => null);
          if (ownerProfile && ownerProfile.user) {
            matchedUser = {
              uid: ownerProfile.user.uid,
              name: ownerProfile.user.name,
              email: ownerProfile.user.email,
              picture: ownerProfile.user.picture || ownerProfile.ProfilePicture
            };
          }
        }
        
        console.log('Found user:', matchedUser);
        
        return {
          ...match.toObject(),
          matchedUser: matchedUser || { uid: matchedUserId, name: 'Unknown User', email: 'No email' }
        };
      })
    );
    
    return matchesWithUserData;
  },

  async deleteMatch(currentUserId, matchUserId) {
    return await Match.findOneAndDelete({
      $or: [
        { currentUserId, matchUserId },
        { currentUserId: matchUserId, matchUserId: currentUserId }
      ]
    });
  }
};

module.exports = matchService;