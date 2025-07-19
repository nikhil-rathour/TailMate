const express = require("express");
const router = express.Router();
const { googleAuth, getCurrentUser } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Authentication routes
router.post("/google", googleAuth);

// Protected routes
router.get("/me", verifyToken, getCurrentUser);

module.exports = router;
