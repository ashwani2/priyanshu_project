const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Comment = require("../models/Comment");

//@desc     Get single video comments data
//@route    GET /api/v1/comment/getComments
//@access   Public
exports.getVideoComments = asyncHandler(async (req, res, next) => {
  let { videoId } = req.query;

  if(!videoId){
    return next(new ErrorResponse("Please pass the parameters", 400));
  }
  const commentDetails = await Comment.findOne({ videoId }).lean();

  if (!commentDetails) {
    return next(new ErrorResponse("No Available Comments", 400));
  }

  res.status(200).json({
    success: true,
    data: commentDetails,
  });
});

//@desc     Add video Comments
//@route    POST api/v1/comment/addComment
//@access   Private
exports.addComment = asyncHandler(async (req, res, next) => {
  let { videoId, text } = req.body;

  if(!videoId || !text){
    return next(new ErrorResponse("Please pass parameters", 400));
  }

  let userId = req.user._id;
  let commentBy = req.user.name;

  const comment = await Comment.create({
    videoId: videoId,
    userId: userId,
    commentBy: commentBy,
    text: text,
  });

  if (!comment) {
    return next(new ErrorResponse("can't Add Comment", 400));
  }

  res.status(201).json({
    success: true,
    data: comment,
  });
});

//@desc     Update Likes
//@route    PUT api/v1/comment/updateLike
//@access   Private
exports.updateCommentLikes = asyncHandler(async (req, res, next) => {
  let { commentId } = req.query;

  if(!commentId){
    return next(new ErrorResponse("Please Pass the parameters", 400));
  }

  let userId = req.user._id;
  let comment = await Comment.findById({ _id: commentId });

  if (!comment) {
    return next(new ErrorResponse("Cannot find that comment", 400));
  }

  const alreadyLiked = comment.likes.some((like) => like.equals(userId));

  if (alreadyLiked) {
    comment.likes = comment.likes.filter((like) => !like.equals(userId));
  } else {
    comment.likes.push(userId);
  }

  await comment.save();

  res.status(200).json({
    success: true,
    data: [],
  });
});

//@desc     Update comment thread
//@route    PUT api/v1/comment/updateReplies
//@access   Private
exports.updateCommentReplies = asyncHandler(async (req, res, next) => {
  let { commentId, text } = req.body;

  if(!commentId || !text){
    return next(new ErrorResponse("Please Pass The Parameters", 400));
  }

  let userId = req.user._id;
  let commentBy = req.user.name;
  let comment = await Comment.findById({ _id: commentId });

  if (!comment) {
    return next(new ErrorResponse("Cannot find that comment", 400));
  }

  let commentObj = { userId, text, commentBy };

  comment.replies.push(commentObj);

  await comment.save();

  res.status(200).json({
    success: true,
    data: [],
  });
});
