const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const StaticData = require("../models/StaticData");

//@desc     Get all the videos
//@route    POST /api/v1/static/data
//@param    type = parameter,country,service
//@access   Public
exports.getStaticValues = asyncHandler(async (req, res, next) => {
  let { type } = req.query;

  const staticData = await StaticData.find({ type: type }).lean();

  if (!staticData) {
    return next(new ErrorResponse("No data Found", 400));
  }

  res.status(200).json({
    success: true,
    data: staticData,
  });
});
