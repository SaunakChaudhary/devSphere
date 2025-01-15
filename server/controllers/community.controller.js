const { default: mongoose } = require("mongoose");
const Community = require("../models/community.model");
const CommunityPostModel = require("../models/communityPost.model");
const UserModel = require("../models/user.model");
const { io, getReceiverSocketIds } = require("../Socket/socket");

const createCommunity = async (req, res) => {
  try {
    const { name, createdBy, description, privacy } = req.body;

    // Validate required fields
    if (!name || !createdBy || !description || !privacy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate file uploads
    if (!req.files || !req.files["logo"] || !req.files["coverPhoto"]) {
      return res
        .status(400)
        .json({ message: "Logo and Cover Photo are required" });
    }

    const userObjectId = new mongoose.Types.ObjectId(createdBy);

    // Create the new community
    const newCommunity = new Community({
      name,
      description,
      logo: req.files["logo"][0]?.path,
      coverPhoto: req.files["coverPhoto"][0]?.path,
      createdBy: userObjectId,
      privacy,
      members: [userObjectId], // Members should be an array of ObjectIds
    });

    // Save the new community
    const savedCommunity = await newCommunity.save();

    res.status(201).json({
      message: "Community created successfully",
      community: savedCommunity,
    });
  } catch (error) {
    console.error("Error creating community:", error); // Log error for debugging
    res.status(500).json({
      message: "An error occurred while creating the community",
      error: error.message || error,
    });
  }
};

const dispCommunity = async (req, res) => {
  try {
    const allCommunity = await Community.find({ privacy: "Public" });
    if (!allCommunity || allCommunity.length === 0) {
      // If no communities found, return an empty array
      return res.status(200).json([]);
    }
    // If communities are found, return them
    return res.status(200).json(allCommunity);
  } catch (error) {
    // Handle server errors
    return res.status(500).json({ message: "SERVER ERROR: " + error.message });
  }
};

const searchedCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) {
      return res.status(400).json({ message: "Id is required" });
    }
    return res.status(200).json({ community });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const { CommunityId, userId } = req.body;

    // Validate input
    if (!CommunityId || !userId) {
      return res
        .status(400)
        .json({ message: "CommunityId and userId are required" });
    }

    const community = await Community.findById(CommunityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if user is already a member
    if (community.members.some((member) => member.equals(userObjectId))) {
      // Remove user from the community
      community.members.pull(userObjectId);
      io.emit("joinComm", community.members.length);

      await community.save();
      return res.status(200).json({
        message: "User successfully left the community",
        community,
      });
    } else {
      // Add user to the community
      community.members.push(userObjectId);
      io.emit("joinComm", community.members.length);

      await community.save();
      return res.status(200).json({
        message: "User successfully joined the community",
        community,
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "SERVER ERROR: " + error });
  }
};

const sendMessageToAll = async (req, res) => {
  try {
    const { content, communityId, senderId, isCode, language } = req.body;

    // Validate required fields
    if (!content || !communityId || !senderId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the community
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Create the community post
    const communityPost = await CommunityPostModel.create({
      communityId,
      createdBy: senderId,
      isCode: Boolean(isCode),
      language: language || null,
      content,
    });

    // Add post to the community's posts array
    community.posts.push(communityPost._id);

    // Fetch the sender's user details
    const populatedUser = await UserModel.findById(senderId);
    if (!populatedUser) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Notify community members via Socket.IO
    const receiverSocketIds = getReceiverSocketIds(
      community.members.filter(
        (member) =>
          member._id.toString() !== community.members[0]._id.toString() &&
          member._id.toString() !== senderId
      )
    );

    receiverSocketIds.forEach((receiverSocketId) => {
      if (receiverSocketId) {
        const notification = {
          message: content,
          user: populatedUser,
        };

        io.to(receiverSocketId).emit("sendCommMsg", {
          communityId,
          createdAt: communityPost.createdAt,
          content,
          isCode,
          isRead:communityPost.isRead,
          language,
          _id: communityPost._id,
          sender: populatedUser,
        });
        
        io.to(receiverSocketId).emit("sendCommNotiMsg", notification);
      }
    });

    // Save community changes
    await community.save();

    // Respond with success
    return res
      .status(201)
      .json({ message: "Post created successfully", post: communityPost });
  } catch (error) {
    console.error("Error in sendMessageToAll:", error);
    return res.status(500).json({ message: "SERVER ERROR: " + error.message });
  }
};

const getMessagesOfCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId).populate("posts");
    if (!community) return res.status(200).json({ messages: [] });

    return res.status(200).json({
      messages: community.posts,
    });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

module.exports = {
  getMessagesOfCommunity,
  sendMessageToAll,
  createCommunity,
  dispCommunity,
  searchedCommunity,
  joinCommunity,
};
