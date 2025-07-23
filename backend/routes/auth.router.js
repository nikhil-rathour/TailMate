const express = require("express");
const router = express.Router();
const { googleAuth, getCurrentUser, getUserByUserId } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Authentication routes
router.post("/google", googleAuth);

// Protected routes
router.get("/me/:uid", verifyToken, getCurrentUser);
router.get("/me", verifyToken, getCurrentUser);
router.get("/user/:userId", verifyToken, getUserByUserId);

module.exports = router;
