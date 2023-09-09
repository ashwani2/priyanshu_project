const express = require("express");
const {
  getVideos
} = require("../controllers/catalogue");
const router = express.Router();

router.route("/videos").post(getVideos);

module.exports = router;
