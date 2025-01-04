const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");
const UserModel = require("../models/user.model");
const { getReceiverSocketId , io} = require("../Socket/socket");

const sendMessage = async (req, res) => {
  try {
    const { message, senderId, receiverId } = req.body;
    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new messageModel({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);
    // socket io functionality
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("sendMsg", newMessage);
    }
    return res
      .status(200)
      .json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error : " + error });
  }
};

const getMessage = async (req, res) => {
  try {
    const { receiverId, senderId } = req.params;

    const conversation = await conversationModel
      .findOne({
        participants: { $all: [senderId, receiverId] },
      })
      .populate("messages");
    if (!conversation) {
      return res.status(200).json({messages:[]});
    }

    return res.status(200).json({
      messages: conversation.messages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error : " + error });
  }
};

const SearchUserExceptLoggedInUser = async (req, res) => {
  try {
    const { loggedInUser } = req.body;
    const { query } = req.params;
    const allUserExceptLoggedIn = await UserModel.find({
      _id: { $ne: loggedInUser },
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).json(allUserExceptLoggedIn);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

module.exports = { sendMessage, SearchUserExceptLoggedInUser, getMessage };
