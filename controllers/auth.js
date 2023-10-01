const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const sendEmail = require("../utils/sendEmail");

//@desc     Register a User
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, country, password, address } = req.body;

  //Create user
  const user = await User.create({
    name,
    email,
    country,
    password,
    address,
  });

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    sucess: true,
    token,
  });
});

//@desc     Login User
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate Email and Password
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide a email and password", 400));
  }

  // Check for User
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // Check if passwords matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

//@desc     Get Current Logged In User
//@route    GET /api/v1/auth/me
//@access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     Forgot Password
//@route    POST /api/v1/auth/forgotPassword
//@access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

//@desc     Reset Password
//@route    POST /api/v1/auth/resetpassword/:resetToken
//@access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc     Create Profile
//@route    POST/api/v1/auth/photoUpload
//@access   Public
exports.photoUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`USER not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload A file`, 400));
  }

  const file = req.files.file;

  // Make Sure the Image is Photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please Upload a image file`, 400));
  }

  // check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload a Image less than ${process.env.MAX_FILE_UPLOADS}`,
        400
      )
    );
  }

  // create custom filename
  file.name = `photo_${user._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem With file upload`, 500));
    }

    await user.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      sucess: true,
      data: file.name,
    });
  });
});

// Get Token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
  });
};
