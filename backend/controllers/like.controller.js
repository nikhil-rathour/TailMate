const likeService = require("../services/like.service");


const addLike = async (req, res) => {
    try {
        const { userId, postId } = req.body;
         console.log("like" , req.body)

         const check = await likeService.isLikedByUser(userId, postId);

         console.log("check" , check)

         if(check) {
             throw new Error("You have already liked this post")
         }
        const like = await likeService.createLike(userId, postId);

       
        res.status(201).json({
            success: true,
            message: "Like added successfully",
            data: like,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllLikes = async (req, res) => {
    try {
        const { userId } = req.body;
        const likes = await likeService.listAllLikes(userId);
        res.status(200).json({
            success: true,
            data: likes,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteLike = async (req, res) => {
    try {
        const { userId, postId } = req.body;
        await likeService.deleteLike(userId, postId);
        res.status(200).json({
            success: true,
            message: "Like deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
   addLike,
   getAllLikes,
   deleteLike
};