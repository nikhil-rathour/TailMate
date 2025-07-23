const mongoose = require("mongoose");

const likeSchema =  new  mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
},{
    timestamps: true
});

const likeModel = mongoose.model("Like", likeSchema);
module.exports = likeModel;
