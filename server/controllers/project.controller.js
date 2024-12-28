const projectModel = require("../models/project.model");
const UserModel = require("../models/user.model");
const NotificationModel = require("../models/handleNotification.model");
const { getReceiverSocketId, io } = require("../Socket/socket");

const addProject = async (req, res) => {
  const {
    title,
    technologies,
    description,
    githubRepo,
    demoUrl,
    userId,
    tagedUsers,
  } = req.body;

  try {
    if (!title || !technologies || !description || !githubRepo || !userId) {
      return res.status(400).json({ message: "All Fields Required" });
    }

    // Check if user exists
    const isUser = await UserModel.findById(userId);
    if (!isUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    // Fetch all tagged users in a single query
    const taggedUserDetails = await UserModel.find({
      username: { $in: tagedUsers },
    });

    // Iterate over the tagged users
    for (const taggedUser of taggedUserDetails) {
      const receiverSocketId = getReceiverSocketId(taggedUser._id);

      if (receiverSocketId) {
        const notification = {
          type: "info",
          message: "is Mentioned you in their Project",
          user: taggedUser,
        };
        // Emit notification via socket
        io.to(receiverSocketId).emit("newMessage", notification);
      }
      // Save notification to the database
      await NotificationModel.create({
        sender: userId,
        recipient: taggedUser._id,
        content: "is Mentioned you in their Project",
        type: "message",
      });
    }

    // Create the project
    await projectModel.create({
      title,
      technologies,
      description,
      githubRepo,
      demoUrl: demoUrl || "",
      userId,
      tagedUsers: taggedUserDetails.map((user) => user._id),
    });

    return res.status(200).json({ message: "Project Uploaded" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR: " + error.message });
  }
};

module.exports = { addProject };
