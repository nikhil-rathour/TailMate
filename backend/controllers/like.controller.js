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
        const { id } = req.params;
        console.log(id)
        const likes = await likeService.listAllLikes(id);
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
        console.log(req.body)
        const { userId, postId } = req.body;
        console.log("liek",userId, postId)
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