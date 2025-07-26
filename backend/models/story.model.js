const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  header: { type: String, required: true },
  mediaUrl: { type: String, required: false },
  mediaType: { type: String, enum: ["IMAGE", "VIDEO"], required: false },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ["FUNNY", "SAD", "EMOTIONAL", "JOURNEY"],
    default: "JOURNEY",
  },
  tags: { type: [String], required: false },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});


module.exports = mongoose.model("Story", storySchema);