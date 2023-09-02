const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  photoUpload
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/me").get(protect, getMe);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword/:resetToken").put(resetPassword);

router.route("photoupload").put(protect, photoUpload);

module.exports = router;
