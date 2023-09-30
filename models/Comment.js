const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.ObjectId,
      ref: "Catalogue",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentBy: {
      type: String,
      required: true,
    },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    replies: [
      {
        _id: false,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        commentBy: { type: String, required: true },
        text: { type: String, required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CommentSchema", CommentSchema, "comments");
