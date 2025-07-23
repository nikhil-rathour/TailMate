const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.String, ref: "Pet", required: true },
    userId: { type: mongoose.Schema.Types.String, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model("User", likeSchema);
