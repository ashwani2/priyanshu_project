const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Catalogue = require("../models/Catalogue");
const Comment = require("../models/Comment")
const Like = require("../models/Like")

//@desc     Get all the videos
//@route    POST /api/v1/catalogue/videos
//@access   Public
exports.getVideos = asyncHandler(async (req, res, next) => {
  const { filter } = req.body;
  const { experts, countries, parameters, latest, trending } = filter;
  let matchQuery = {}, sortQuery = {}, pipeline = [];

  if (experts || countries || parameters) {
    if (experts.length !== 0) {
      matchQuery.expert = {
        $in: experts,
      };
    }
    if (countries.length !== 0) {
      matchQuery.country = {
        $in: countries,
      };
    }
    if (parameters.length !== 0) {
      matchQuery.parameter = {
        $in: parameters,
      };
    }
    pipeline.push({
      $match: matchQuery
    })
  }

  if (latest || trending) {

    if (latest) {
      sortQuery.createdAt = -1
    }

    else if (trending) {
      sortQuery.viewCount = -1
    }

    pipeline.push({
      $sort: sortQuery
    })

  }

  let catalogues = await Catalogue.aggregate(pipeline)

  res.status(200).json({
    success: true,
    data: catalogues,
  });
});

//@desc     Get single video and their data
//@route    POST /api/v1/catalogue/video
//@access   Public
exports.getVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.query

  const videoDetails = await Catalogue.findOne({ _id: videoId }).lean()

  if (!videoDetails) {
    return next(new ErrorResponse("Requested Video is not available", 400));
  }
  res.status(200).json({
    success: true,
    data: videoDetails
  })
})


//@desc     Get single video comments data
//@route    POST /api/v1/catalogue/videoComments
//@access   Public
exports.getVideoComments = asyncHandler(async (req, res, next) => {
  let { videoId } = req.query

  const commentDetails = await Comment.find({ video: videoId }).lean()

  if (commentDetails) {
    return next(new ErrorResponse("No Available Comments", 400));
  }

  res.status(200).json({
    success: true,
    data: commentDetails
  })

})

//@desc     Get single video likes data
//@route    POST /api/v1/catalogue/videoLikes
//@access   Public
exports.getVideoLikes = asyncHandler(async (req, res, next) => {
  let { videoId } = req.query

  const likeDetails = await Like.find({ video: videoId }).lean()

  if (likeDetails) {
    return next(new ErrorResponse("No Likes", 400));
  }

  res.status(200).json({
    success: true,
    data: likeDetails
  })

})
