const express = require("express");
const {
  getVideos,
  getVideo,
  getVideoLikes,
  getRelatedVideos,
  updateViewCount,
  updateLikeCount,
  uploadVideo,
} = require("../controllers/catalogue");
const router = express.Router();
const multer = require("multer");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { protect } = require("../middlewares/auth");

router.route("/videos").post(getVideos);
router.route("/video/:videoId").post(getVideo);
router.route("/videoLikes").get(getVideoLikes);
router.route("/viewCount/:videoId").get(updateViewCount);
router.route("/likeCount/:videoId").get(updateLikeCount);
router.route("/relatedVideos/:videoId").get(getRelatedVideos);
router.route("/uploadVideo", upload.single("video"), uploadVideo);

module.exports = router;
