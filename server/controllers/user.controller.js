const UserModel = require("../models/user.model");
const FollowLikeModel = require("../models/followLike.model");
const cloudinary = require("../utils/cloudinary.config");
const followLikeModel = require("../models/followLike.model");

const updatProfile = async (req, res) => {
  const {
    bio,
    name,
    email,
    mobileNo,
    gitHuburl,
    linkedInUrl,
    portfolioWebsite,
    username,
    oldAvatar,
    interest,
  } = req.body;

  // Validate required fields
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const isEmailAlready = await UserModel.findOne({ email });
  if (!isEmailAlready) {
    return res.status(400).json({ message: "Email Doesn't Exist" });
  }

  if (isEmailAlready.username !== username) {
    const isUsernameAlready = await UserModel.findOne({ username });
    if (isUsernameAlready) {
      return res.status(400).json({ message: "Username is taken" });
    }
  }

  try {
    const interestArray = JSON.parse(interest);
    const allTags = interestArray.map((item) => item._id);

    // Construct the update object dynamically
    const updateData = {
      bio: bio || "",
      name: name || "",
      email: email || "",
      mobileNo: mobileNo || "",
      gitHuburl: gitHuburl || "",
      linkedInUrl: linkedInUrl || "",
      portfolioWebsite: portfolioWebsite || "",
      username: username || "",
      interest: allTags || "",
    };

    // Add avatar path if a file is uploaded
    if (req.files?.["avatar"]?.[0]?.path) {
      updateData.avatar = req.files["avatar"][0].path;
      if (oldAvatar) {
        const getPublicIdAndExtension = (url) => {
          const splitUrl = url.split("/");
          const filename = splitUrl[splitUrl.length - 1];
          const decodeFilename = decodeURIComponent(filename);
          const spliDecodeFilename = decodeFilename.split(".");
          const publicId = spliDecodeFilename[0];
          const extension = spliDecodeFilename[spliDecodeFilename.length - 1];
          return { publicId, extension };
        };

        const { publicId, extension } = getPublicIdAndExtension(oldAvatar);
        cloudinary.api.delete_resources(
          [`devsphere_user_profile/${publicId + "." + extension}`],
          { type: "upload", resource_type: "image" }
        );
      }
    }

    // Update user profile
    const user = await UserModel.findOneAndUpdate({ email }, updateData, {
      new: true,
    }).populate("interest");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ user, message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR: " + error });
  }
};

const followUnFollow = async (req, res) => {
  const { loggedInUserId, SearchedUserId } = req.body;
  try {
    const followExists = await FollowLikeModel.findOne({
      userId: loggedInUserId,
      followedUserId: { $in: SearchedUserId },
    });

    if (!followExists) {
      await FollowLikeModel.create({
        userId: loggedInUserId,
        followedUserId: [SearchedUserId],
        isFollowing: true,
      });
      return res
        .status(200)
        .json({ message: "User followed successfully", success: true });
    }

    followExists.following = !followExists.following;
    await followExists.save();

    const action = followExists.following ? "followed" : "unfollowed";
    return res.status(200).json({ message: `User ${action} successfully` });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR " + error });
  }
};
module.exports = { updatProfile, followUnFollow };
