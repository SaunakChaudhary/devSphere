const Comment = require("../models/comment.model");
const handleNotificationModel = require("../models/handleNotification.model");
const ProjectModel = require("../models/project.model");
const UserModel = require("../models/user.model");
const { getReceiverSocketId, io } = require("../Socket/socket");

const createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;

    // Validate input
    if (!content || !postId || !userId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new comment
    const newComment = await Comment.create({
      content,
      postId,
      userId,
      createdAt: new Date(),
    });

    // Update the post with the new comment ID
    await ProjectModel.findByIdAndUpdate(
      postId,
      { $push: { comment: newComment._id } },
      { new: true }
    );

    const populatedComment = await Comment.findById(newComment._id)
      .populate("userId")
      .populate("postId");

    const populatedUser = await UserModel.findById(
      populatedComment.postId.userId
    );

    const receiverSocketId = getReceiverSocketId(
      populatedComment.postId.userId
    );

    if (receiverSocketId) {
      const notification = {
        type: "info",
        message: "commented " + content + " on your project",
        user: populatedUser,
      };
      io.to(receiverSocketId).emit("newMessage", notification);
    }

    // Save notification to the database
    await handleNotificationModel.create({
      sender: userId,
      recipient: populatedComment.postId.userId,
      content:
        "Commented " +
        content +
        " on your " +
        populatedComment.postId.title +
        " Project",
      type: "message",
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the comment." });
  }
};

// Get all comments for a post
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
      .populate("userId")
      .populate("postId")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content, updatedAt: new Date() },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId, postId } = req.params;
    await Comment.findByIdAndDelete(commentId);

    await ProjectModel.findByIdAndUpdate(
      postId,
      { $pull: { comment: commentId } },
      { new: true }
    );

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteComment,
  updateComment,
  getCommentsByPost,
  createComment,
};
