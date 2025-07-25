const mongoose = require("mongoose");


const match = new mongoose.Schema({
  currentUserId: { type: mongoose.Schema.Types.String, ref: "User", required: true },
  matchUserId: { type: mongoose.Schema.Types.String, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true }
});

// Create compound index to prevent duplicate matches
match.index({ currentUserId: 1, matchUserId: 1 }, { unique: true });

module.exports = mongoose.model("Match", match);

