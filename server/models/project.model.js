const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  technologies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hashtag",
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  githubRepo: {
    type: String,
    required: true,
    trim: true,
    match: [
      /^https?:\/\/(www\.)?github\.com\/.*/,
      "Please enter a valid GitHub URL",
    ],
  },
  demoUrl: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tagedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
