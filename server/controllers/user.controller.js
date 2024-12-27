const UserModel = require("../models/user.model");
const cloudinary = require("../utils/cloudinary.config");
const followLikeModel = require("../models/followLike.model");
const mongoose = require("mongoose");
const NotificationModel = require("../models/handleNotification.model");
const { getReceiverSocketId, io } = require("../Socket/socket");

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
    // Validate user IDs
    if (
      !mongoose.Types.ObjectId.isValid(loggedInUserId) ||
      !mongoose.Types.ObjectId.isValid(SearchedUserId)
    ) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    const loggedInUserObjectId = new mongoose.Types.ObjectId(loggedInUserId);
    const searchedUserObjectId = new mongoose.Types.ObjectId(SearchedUserId);

    // Fetch or create documents for both users concurrently
    const [loggedInUserDoc, searchedUserDoc] = await Promise.all([
      followLikeModel.findOneAndUpdate(
        { user: loggedInUserObjectId },
        { $setOnInsert: { user: loggedInUserObjectId, following: [] } },
        { new: true, upsert: true }
      ),
      followLikeModel.findOneAndUpdate(
        { user: searchedUserObjectId },
        { $setOnInsert: { user: searchedUserObjectId, followers: [] } },
        { new: true, upsert: true }
      ),
    ]);

    // Check if the logged-in user is already following the searched user
    const isFollowing =
      loggedInUserDoc.following.includes(searchedUserObjectId);

    // Update both `following` and `followers` arrays concurrently
    const [updateLoggedInUser, updateSearchedUser] = await Promise.all([
      followLikeModel.findOneAndUpdate(
        { user: loggedInUserObjectId },
        isFollowing
          ? { $pull: { following: searchedUserObjectId } }
          : { $addToSet: { following: searchedUserObjectId } },
        { new: true }
      ),
      followLikeModel.findOneAndUpdate(
        { user: searchedUserObjectId },
        isFollowing
          ? { $pull: { followers: loggedInUserObjectId } }
          : { $addToSet: { followers: loggedInUserObjectId } },
        { new: true }
      ),
    ]);

    const receiverSocketId = getReceiverSocketId(searchedUserObjectId);
    if (receiverSocketId && !isFollowing) {
      const loggedinUserDetails = await UserModel.findById(
        loggedInUserObjectId
      );
      const noti = {
        type: "info",
        message: "is Started Following You",
        user: loggedinUserDetails,
      };
      await NotificationModel.create({
        sender: loggedInUserObjectId,
        recipient: searchedUserObjectId,
        content: " is Started Following You",
        type: "message",
      });
      io.to(receiverSocketId).emit("newMessage", noti);
    } else {
      io.to(receiverSocketId).emit("unFollowUpdate", true);
    }

    return res.status(200).json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      updateLoggedInUser,
      updateSearchedUser,
    });
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

const getFollowersFollowing = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User Not Available" });
    }

    const userId = await followLikeModel
      .findOne({ user: id })
      .populate("following")
      .populate("followers");

    if (userId) {
      return res
        .status(200)
        .json({ following: userId.following, followers: userId.followers });
    }
    return res.status(200).json({ following: [], followers: [] });
  } catch (error) {
    return res.status(500).json({ message: "SEERVER ERROR " + error });
  }
};

module.exports = {
  updatProfile,
  followUnFollow,
  displayAllCounts,
  getFollowersFollowing,
};
