const Conversation = require("../models/conversation.model");
const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");
const UserModel = require("../models/user.model");
const { getReceiverSocketId, io } = require("../Socket/socket");

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

    const populatedUser = await UserModel.findById(senderId);
    // socket io functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      const notification = {
        message: newMessage,
        user: populatedUser,
      };

      io.to(receiverSocketId).emit("sendMsg", newMessage);
      io.to(receiverSocketId).emit("sendNotiMsg", notification);
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
      return res.status(200).json({ messages: [] });
    }
    await messageModel.updateMany(
      {
        $and: [
          { _id: { $in: conversation.messages } },
          { senderId: receiverId },
        ],
      },
      { $set: { isRead: true } }
    );
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

    const usersWithLastMessage = await Promise.all(
      allUserExceptLoggedIn.map(async (user) => {
        const lastMessage = await messageModel
          .findOne({
            $or: [
              { senderId: loggedInUser, receiverId: user._id },
              { senderId: user._id, receiverId: loggedInUser },
            ],
          })
          .sort({ updatedAt: -1 });

        return {
          ...user.toObject(),
          lastMessage: lastMessage || "",
        };
      })
    );

    return res.status(200).json(usersWithLastMessage);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

const deleteMessage = async (req, res) => {
  const { messageId, receiverId, senderId } = req.body;
  try {
    if (!messageId) {
      return res.status(400).json({ message: "MessageId Not Provided" });
    }

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    const finalMessages = conversation.messages.filter(
      (msg) => messageId != msg
    );

    await conversationModel.findOneAndUpdate(
      {
        participants: { $all: [senderId, receiverId] },
      },
      { $set: { messages: finalMessages } }
    );
    await messageModel.findByIdAndDelete(messageId);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("dltMsg", messageId);
    }
    return res.status(200).json({ message: "Message Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR " + error });
  }
};

const clearMsg = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(400).json({ message: "Chatbox Already Empty" });
    }

    await conversationModel.findOneAndUpdate(
      {
        participants: { $all: [senderId, receiverId] },
      },
      { $set: { messages: [] } }
    );
    await messageModel.deleteMany({
      $and: [{ senderId }, { receiverId }],
    });
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("clrMsg", "clear");
    }
    return res.status(200).json({ message: "Chat Cleared" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

const recentChats = async (req, res) => {
  try {
    const { senderId } = req.params;

    // Find all conversations involving the sender
    let conversations = await Conversation.find({
      participants: { $in: [senderId] },
    })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } },
        populate: { path: "senderId receiverId isRead" },
      })
      .populate({
        path: "participants",
        select: "name email username avatar",
      })
      .sort({ updatedAt: -1 });

    // Format the response to include only relevant data
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (participant) => participant._id.toString() !== senderId
      );

      const messages = conv.messages;
      const isReadCount = messages.filter(
        (msg) =>
          msg.isRead === false &&
          msg.receiverId &&
          msg.receiverId._id.toString() === senderId
      ).length;

      const latestMessage = conv.messages.length > 0 ? conv.messages[0] : null;

      return {
        conversationId: conv._id,
        otherParticipant,
        latestMessage,
        isReadCount,
      };
    });

    // Respond with the formatted conversations
    return res.status(200).json({
      message: "Conversations retrieved successfully",
      conversations: formattedConversations,
    });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR: " + error.message });
  }
};

const isRead = async (req, res) => {
  try {
    const { receiverId, senderId } = req.params;

    const conversation = await conversationModel
      .findOne({
        participants: { $all: [senderId, receiverId] },
      })
      .populate("messages");
    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    await messageModel.updateMany(
      {
        $and: [
          { _id: { $in: conversation.messages } },
          { senderId: receiverId },
        ],
      },
      { $set: { isRead: true } }
    );
    return res.status(200).json({ message: "isRead" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

const DeleteConversation = async (req, res) => {
  try {
    const { convId } = req.body;
    if (!convId)
      return res.status(400).json({ message: "Conversation Id is Required" });
    const data = await conversationModel.findByIdAndDelete(convId);
    await messageModel.deleteMany({
      $or: [
        {
          $and: [
            { senderId: data.participants[0] },
            { receiverId: data.participants[1] },
          ],
        },
        {
          $and: [
            { senderId: data.participants[1] },
            { receiverId: data.participants[0] },
          ],
        },
      ],
    });
    return res
      .status(200)
      .json({ message: "Conversation Deleted Successfully"});
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error});
  }
};

module.exports = {
  DeleteConversation,
  clearMsg,
  sendMessage,
  SearchUserExceptLoggedInUser,
  getMessage,
  deleteMessage,
  recentChats,
  isRead,
};
