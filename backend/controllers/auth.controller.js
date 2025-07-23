const admin = require("../firebaseAdmin/firebaseAdmin");
const User = require("../models/user.model");

// Verify Firebase token and create/update user in database
const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Firebase ID Token
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decoded;

    // Upsert user
    let user = await User.findOneAndUpdate(
      { uid },
      { email, name, picture },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Token verification failed", err);
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get user by userId (email prefix)
const getUserByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user where email starts with userId
    const user = await User.findOne({ 
      email: new RegExp(`^${userId}@`, 'i') 
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      user: {
        name: user.name || userId,
        picture: user.picture || 'https://via.placeholder.com/150'
      }
    });
  } catch (err) {
    console.error("Error fetching user by userId", err);
    return res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

module.exports = {
  googleAuth,
  getCurrentUser,
  getUserByUserId
};