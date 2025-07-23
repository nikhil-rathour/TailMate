const express = require("express")
const router = express.Router()
const likeController = require("../controllers/like.controller")
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/add-like", likeController.addLike);
router.delete("/delete-like", likeController.deleteLike);
router.get("/list-all-likes", likeController.getAllLikes);
module.exports = router