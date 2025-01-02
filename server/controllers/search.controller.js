const UserModel = require("../models/user.model");
const ProjectModel = require("../models/project.model");
const HashtagModel = require("../models/hashtag.model");

const { default: mongoose } = require("mongoose");

const getSearchResults = async (req, res) => {
  const { search } = req.query;
  try {
    const users = await UserModel.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    });

    const hashtags = await HashtagModel.find({
      $or: [{ tag: { $regex: search, $options: "i" } }],
    });

    const projects = await ProjectModel.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { technologies: { $in: hashtags.map((hashtag) => hashtag._id) } },
      ],
    })
      .populate("technologies")
      .populate("userId");

    return res.status(200).json({ users, projects, message: "Message Sent" });
  } catch (error) {
    return res.status(500).json("SERVER ERROR : " + error);
  }
};

const searchedUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }
    const idd = new mongoose.Types.ObjectId(id);

    if (!idd) {
      return res.status(400).json({ message: "User id required" });
    }
    const userData = await UserModel.findById(idd).populate("interest");
    if (userData) {
      return res.status(200).json({ userData });
    }
    return res.status(400).json({ message: "User Not available" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

const redirectUser = async (req, res) => {
  const { username } = req.params;
  try {
    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }
    const userData = await UserModel.findOne({ username });
    if (userData) {
      return res.status(200).json({ userData });
    }
    return res.status(400).json({ message: "User Not available" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

module.exports = { getSearchResults, searchedUser, redirectUser };
