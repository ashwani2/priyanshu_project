const express = require("express");
const {
  getVideos,
  getVideo,
  getVideoLikes
} = require("../controllers/catalogue");
const router = express.Router();

router.route("/videos").post(getVideos);
router.route("/video").post(getVideo);
router.route("/videoLikes").post(getVideoLikes);

module.exports = router;
