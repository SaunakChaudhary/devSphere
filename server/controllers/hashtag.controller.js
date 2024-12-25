const HashtagModel = require("../models/hashtag.model");
const UserModel = require("../models/user.model");

const getHashtags = async (req, res) => {
  try {
    const hashtags = await HashtagModel.find();
    return res.status(200).json(hashtags);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const addIntoUserSchema = async (req, res) => {
  try {
    const { hashtags } = req.body;
    const { id: userId } = req.user;

    if (!userId || !hashtags) {
      return res
        .status(400)
        .json({ message: "Please provide userId and hashtags" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { interest: hashtags } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to update user schema" });
    }
    return res.status(200).json({ user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {  getHashtags, addIntoUserSchema };
