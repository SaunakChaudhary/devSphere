const UserModel = require("../models/user.model");
const HashtagModel = require("../models/hashtag.model");

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
    return res.status(200).json({ users, message: "Message Sent" });
  } catch (error) {
    return res.status(500).json("SERVER ERROR : " + error);
  }
};

const searchedUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "User id required" });
    }
    const userData = await UserModel.findById(id).populate("interest");
    if (userData) {
      return res.status(200).json({ userData });
    }
    return res.status(400).json({ message: "User Not available" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

module.exports = { getSearchResults , searchedUser};
