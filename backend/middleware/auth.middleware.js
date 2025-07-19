const admin = require("../firebaseAdmin/firebaseAdmin");

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      error: "Unauthorized - No token provided" 
    });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ 
      success: false, 
      error: "Unauthorized - Invalid token" 
    });
  }
};

module.exports = { verifyToken };