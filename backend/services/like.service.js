const like = require("../models/like.model");

const createLike =  async(userId, postId) => {
    const Like = new like({
        userId,
        postId
    });

    console.log("likes", Like)
    return await Like.save();
}

const deleteLike = async(userId, postId) => {
    return await like.findOneAndDelete({userId, postId});
}

const isLikedByUser = async(userId, postId) => {
    const isLiked = await like.findOne({userId, postId});

    console.log("isLiked", isLiked)

    if(isLiked) return true;
    return false;
}

const listAllLikes = async (userId) => {
  const allLikes = await like.find({ userId })
    .populate("postId"); // This will populate Pet (post) details

  return allLikes;
};
module.exports = {
    createLike,
    deleteLike,
    listAllLikes,
    isLikedByUser
}