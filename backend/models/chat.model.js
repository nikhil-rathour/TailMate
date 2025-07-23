const mongoose = require("mongoose");

const ChatMediaEnum = ["IMAGE", "VIDEO"]

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.String, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.String, ref: "User", required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false, required: true },
  isDeleted: { type: Boolean, default: false, required: true },
  isSent: { type: Boolean, default: false, required: true },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ChatMediaEnum, default: "IMAGE", required: false },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model("Chat", chatSchema);

