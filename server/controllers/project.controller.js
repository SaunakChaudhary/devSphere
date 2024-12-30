const projectModel = require("../models/project.model");
const UserModel = require("../models/user.model");
const hashtagModel = require("../models/hashtag.model");
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

    // Update hashtag counts
    for (const techId of technologies) {
      await hashtagModel.findByIdAndUpdate(
        techId,
        { $inc: { count: 1 } },
        { new: true }
      );
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

const fetchProjects = async (req, res) => {
  const { id } = req.body;
  try {
    const projects = await projectModel
      .find({ userId: id })
      .populate("technologies")
      .populate("userId");
    const count = await projectModel.countDocuments({ userId: id });
    if (!projects) {
      return res.status(200).json({ projects: [], count: 0 });
    }
    return res.status(200).json({ projects, count });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR " + error });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Id is required" });
    await projectModel.findOneAndDelete(id);
    return res.status(200).json({ message: "Project Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

module.exports = { addProject, fetchProjects,deleteProject };
