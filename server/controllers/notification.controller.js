const NotificationModel = require("../models/handleNotification.model");
const UserModel = require("../models/user.model");

const updateNotificationMode = async (req, res) => {
  const { user, isRead } = req.body;

  try {
    // Validate user existence
    const checkUser = await UserModel.findById(user);
    if (!checkUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (isRead) {
      await NotificationModel.updateMany(
        { recipient: user },
        { $set: { isRead: isRead } }
      );

      const notification = await NotificationModel.find({
        recipient: user,
      })
        .populate("recipient")
        .populate("sender");
      return res.status(200).json({
        message: "Notifications updated successfully",
        notification,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR: " + error.message });
  }
};

const notificationCount = async (req, res) => {
  const { user } = req.params;
  try {
    const readAndCount = await NotificationModel.find({ recipient: user ,isRead:false});
    const count = readAndCount.length;
    return res.status(200).json({
      count
    });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

module.exports = { updateNotificationMode, notificationCount };
