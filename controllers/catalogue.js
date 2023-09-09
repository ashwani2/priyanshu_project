const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const sendEmail = require("../utils/sendEmail");
const Catalogue = require("../models/Catalogue");

//@desc     Get all the videos
//@route    POST /api/v1/catalogue/videos
//@access   Public
exports.getVideos = asyncHandler(async (req, res, next) => {
  const { filter } = req.body;
  const { experts, countries, parameters } = filter;
  let query = {};

  if (experts.length !== 0) {
    query.expert = {
      $in: experts,
    };
  }
  if (countries.length !== 0) {
    query.country = {
      $in: countries,
    };
  }
  if (parameters.length !== 0) {
    query.parameter = {
      $in: parameters,
    };
  }

  let catalogues = await Catalogue.find(query);
  res.status(200).json({
    sucess: true,
    data: catalogues,
  });
});
