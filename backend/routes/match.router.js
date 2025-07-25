const express = require("express");
const matchController = require("../controllers/match.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, matchController.createMatch);
router.get("/", verifyToken, matchController.getMatches);
router.delete("/:matchUserId", verifyToken, matchController.deleteMatch);

module.exports = router;