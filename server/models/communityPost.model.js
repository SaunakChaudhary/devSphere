const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCode: { type: Boolean, default: false },
    isRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    language: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);

const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);

module.exports = CommunityPost;
