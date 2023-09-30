const express = require("express");
const {
  getVideos,
  getVideo,
  getVideoLikes,
  getRelatedVideos,
} = require("../controllers/catalogue");
const router = express.Router();

router.route("/videos").post(getVideos);
router.route("/video/:videoId").post(getVideo);
router.route("/videoLikes").get(getVideoLikes);
router.route("/relatedVideos/:videoId").get(getRelatedVideos);

module.exports = router;
