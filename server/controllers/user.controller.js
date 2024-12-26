const UserModel = require("../models/user.model");
const cloudinary = require("../utils/cloudinary.config");
const followLikeModel = require("../models/followLike.model");
const mongoose = require("mongoose");

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
    const findUser = await followLikeModel.findOne({ user: loggedInUserId });
    // Validate SearchedUserId and loggedInUserId
    if (
      !mongoose.Types.ObjectId.isValid(loggedInUserId) ||
      !mongoose.Types.ObjectId.isValid(SearchedUserId)
    ) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }
    const searchedUserObjectId = new mongoose.Types.ObjectId(SearchedUserId);

    if (findUser) {
      const isFollowing = findUser.following.includes(searchedUserObjectId);

      // Update the user's following array
      const updatedUser = await followLikeModel.findOneAndUpdate(
        { user: loggedInUserId },
        isFollowing
          ? { $pull: { following: searchedUserObjectId } }
          : { $addToSet: { following: searchedUserObjectId } },
        { new: true }
      );

      const findFollowedUser = await followLikeModel.findOne({
        user: searchedUserObjectId,
      });

      if (findFollowedUser) {
        const isFollower = findFollowedUser.followers.includes(loggedInUserId);
        const updateFollower = await followLikeModel.findOneAndUpdate(
          { user: searchedUserObjectId },
          isFollower
            ? { $pull: { followers: loggedInUserId } }
            : { $addToSet: { followers: loggedInUserId } },
          { new: true }
        );
        return res.status(200).json({ updatedUser, updateFollower });
      } else {
        const createUser = await followLikeModel.create({
          user: searchedUserObjectId,
          followers: [loggedInUserId],
        });
        return res.status(200).json({ updatedUser, createUser });
      }
    }

    const createUser = await followLikeModel.create({
      user: loggedInUserId,
      following: [searchedUserObjectId],
    });

    const findFollowedUser = await followLikeModel.findOne({
      user: searchedUserObjectId,
    });

    if (findFollowedUser) {
      const isFollower = findFollowedUser.followers.includes(loggedInUserId);
      const updateFollower = await followLikeModel.findOneAndUpdate(
        { user: searchedUserObjectId },
        isFollower
          ? { $pull: { followers: loggedInUserId } }
          : { $addToSet: { followers: loggedInUserId } },
        { new: true }
      );
      return res.status(200).json({ createUser, updateFollower });
    } else {
      const createFollowedUser = await followLikeModel.create({
        user: searchedUserObjectId,
        followers: [loggedInUserId],
      });
      return res.status(200).json({ createUser, createFollowedUser });
    }
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR " + error });
  }
};

const displayAllCounts = async (req, res) => {
  const { user, SearchedUserId } = req.body;
  try {
    if (!SearchedUserId) {
      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({ message: "Invalid user IDs" });
      }
      const followData = await followLikeModel.findOne({ user });
      if (!followData) {
        return res.status(200).json({
          countFollowers: 0,
          countFollowing: 0,
        });
      }

      const countFollowers = followData.followers.length;
      const countFollowing = followData.following.length;
      return res.status(200).json({ countFollowers, countFollowing });
    }

    if (!mongoose.Types.ObjectId.isValid(SearchedUserId)) {
      return res.status(400).json({ message: "Invalid Search User IDs" });
    }
    const searchedUserObjectId = new mongoose.Types.ObjectId(SearchedUserId);

    const followData = await followLikeModel.findOne({
      user: searchedUserObjectId,
    });

    if (!followData) {
      return res.status(200).json({
        checkFollowing: "Follow",
        countFollowers: 0,
        countFollowing: 0,
      });
    }

    const checkFollowing = followData.followers.includes(user);
    const countFollowers = followData.followers.length;
    const countFollowing = followData.following.length;
    return res.status(200).json({
      checkFollowing: checkFollowing ? "Following" : "Follow",
      countFollowers,
      countFollowing,
    });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR " + error });
  }
};

module.exports = { updatProfile, followUnFollow, displayAllCounts };
