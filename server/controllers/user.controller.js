const UserModel = require("../models/user.model");

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
    };

    // Add avatar path if a file is uploaded
    if (req.files?.["avatar"]?.[0]?.path) {
      updateData.avatar = req.files["avatar"][0].path;
    }

    // Update user profile
    const user = await UserModel.findOneAndUpdate({ email }, updateData, {
      new: true,
    });

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

module.exports = { updatProfile };
