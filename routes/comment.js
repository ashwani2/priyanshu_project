const express = require("express");
const { getVideoComments, addComment,updateCommentLikes,updateCommentReplies } = require("../controllers/comment");
const router = express.Router();

const { protect } = require("../middlewares/auth");

router.route("/getComments").get(getVideoComments);
router.route("/addComment").post(protect, addComment);
router.route("/updateLike").put(protect, updateCommentLikes);
router.route("/updateReplies").put(protect, updateCommentReplies);

module.exports = router;
