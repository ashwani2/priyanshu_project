const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Catalogue = require("../models/Catalogue");
const Comment = require("../models/Comment");
const Like = require("../models/Like");

//@desc     Get all the videos
//@route    POST /api/v1/catalogue/videos
//@access   Public
exports.getVideos = asyncHandler(async (req, res, next) => {
  const { filter } = req.body;
  const { experts, countries, parameters, latest, trending, search } = filter;
  let matchQuery = {},
    sortQuery = {},
    pipeline = [];

  if (search) {
    matchQuery.title = {
      $regex: search,
      $options: "i",
    };
  }

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
      $match: matchQuery,
    });
  }

  if (latest || trending) {
    if (latest) {
      sortQuery.createdAt = -1;
    } else if (trending) {
      sortQuery.viewCount = -1;
    }

    pipeline.push({
      $sort: sortQuery,
    });
  }

  let catalogues = await Catalogue.aggregate(pipeline);

  res.status(200).json({
    error: false,
    statusCode: 200,
    message: "successfull!!",
    response: catalogues,
  });
});

//@desc     Get single video and their data
//@route    POST /api/v1/catalogue/video/:videoId
//@access   Public
exports.getVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  const videoDetails = await Catalogue.findOne({ _id: videoId }).lean();

  if (!videoDetails) {
    return next(new ErrorResponse("Requested Video is not available", 200));
  }
  res.status(200).json({
    error: false,
    statusCode: 200,
    message: "successfull!!",
    response: videoDetails,
  });
});

//@desc     Get single video likes data
//@route    GET /api/v1/catalogue/videoLikes
//@access   Public
exports.getVideoLikes = asyncHandler(async (req, res, next) => {
  let { videoId } = req.query;

  const likeDetails = await Like.find({ video: videoId }).lean();

  if (likeDetails) {
    return next(new ErrorResponse("No Likes", 200));
  }

  res.status(200).json({
    error: false,
    statusCode: 200,
    message: "Done!",
    response: likeDetails,
  });
});

//@desc     Get Related Videos of a single video
//@route    GET /api/v1/catalogue/relatedVideos/:videoId
//@access   Public
exports.getRelatedVideos = asyncHandler(async (req, res, next) => {
  let { videoId } = req.params;

  if (!videoId) {
    return next(new ErrorResponse("please pass appropriate parameters", 200));
  }

  let videos = await Catalogue.find({ _id: { $nin: [videoId] } }).sort({
    parameter: 1,
    expert: 1,
    country: 1,
  });
  if (!videos) {
    return next(new ErrorResponse("Cannot find videos", 200));
  }

  res.status(200).json({
    error: false,
    statusCode: 200,
    message: "Done!",
    response: videos,
  });
});

//@desc     Increment of viewCount
//@route    GET /api/v1/catalogue/viewCount/:videoId
//@access   Public
exports.updateViewCount = asyncHandler(async (req, res, next) => {
  let { videoId } = req.params;

  if (!videoId) {
    return next(new ErrorResponse("please pass appropriate parameters", 200));
  }

  let videoData = await Catalogue.findByIdAndUpdate(
    { _id: videoId },
    {
      $set: {
        $inc: { viewCount: 1 },
      },
    }
  );

  if (!videoData) {
    return next(new ErrorResponse("Something went wrong", 200));
  }

  res.status(200).json({
    error: false,
    statusCode: 200,
    message: "View Count Updated",
    response: videoData,
  });
});

//@desc     updation of likes
//@route    GET /api/v1/catalogue/likeCount/:videoId
//@access   Private
exports.updateLikeCount = asyncHandler(async (req, res, next) => {
  let { videoId } = req.params;

  if (!videoId) {
    return next(new ErrorResponse("please pass appropriate parameters", 200));
  }

  let userId = req.user._id;
  let videoData = await Catalogue.findByIdAndUpdate(
    { _id: videoId },
    {
      $set: {
        $inc: { likeCount: 1 },
      },
    }
  );

  if (!videoData) {
    return next(new ErrorResponse("Something went wrong", 200));
  }
 

  res.status(200).json({
    error: false,
    statusCode: 200,
    message: "Like Count Updated",
    response: videoData,
  });
});


