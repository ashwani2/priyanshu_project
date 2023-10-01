const express = require("express");
const {
  getVideos,
  getVideo,
  getVideoLikes,
  getRelatedVideos,
  updateViewCount,
  updateLikeCount
} = require("../controllers/catalogue");
const router = express.Router();

const {protect}=require("../middlewares/auth")

router.route("/videos").post(getVideos);
router.route("/video/:videoId").post(getVideo);
router.route("/videoLikes").get(getVideoLikes);
router.route("/viewCount/:videoId").get(updateViewCount);
router.route("/likeCount/:videoId").get(updateViewCount);
router.route("/relatedVideos/:videoId").get(getRelatedVideos);

module.exports = router;
