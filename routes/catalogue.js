const express = require("express");
const {
  getVideos,
  getVideo,
  getVideoComments,
  getVideoLikes
} = require("../controllers/catalogue");
const router = express.Router();

router.route("/videos").post(getVideos);
router.route("/video").post(getVideo);
router.route("/videoComments").post(getVideoComments);
router.route("/videoLikes").post(getVideoLikes);

module.exports = router;
