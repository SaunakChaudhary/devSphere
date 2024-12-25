const UserModel = require("../models/user.model");
const { oauth2client } = require("../utils/google.config");
const helper = require("../helper/helper");
const sendMail = require("../helper/sendMail");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Returns a 4-digit OTP
};

const googleSignup = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: "Gooogle Code Not Found" });
    }
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const useRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
      {
        method: "GET",
      }
    );

    const { email, name, id } = await useRes.json();
    const authProvider = "google";
    const avatar = `https://robohash.org/mail@${email}`;
    const googleId = id;
    if (!email || !name || !avatar || !authProvider || !googleId) {
      return res.status(400).json({ message: "Something went wrong" + id });
    }

    const isEmailAlready = await UserModel.findOne({ email });
    if (isEmailAlready) {
      return res.status(400).json({ message: "Email Already Exist" });
    }

    const user = await UserModel.create({
      email,
      name,
      username: email.split("@")[0],
      avatar,
      googleId,
      authProvider,
    });

    const token = await helper.getToken(email, user._id);

    return res.status(200).json({ message: "Welcome " + name, user, token });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: "Gooogle Code Not Found" });
    }
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const useRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
      {
        method: "GET",
      }
    );

    const { email, id } = await useRes.json();
    const googleId = id;
    if (!email || !googleId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const token = await helper.getToken(email, user._id);

    return res
      .status(200)
      .json({ message: "Welcome " + user.name, user, token });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

const manualLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (user.authProvider !== "manual") {
      return res.status(400).json({ message: "Please Login with Google" });
    }

    const bcryptedPassword = await helper.bcryptedPassword(
      password,
      String(user.password)
    );

    if (!bcryptedPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = await helper.getToken(email, user._id);

    return res
      .status(200)
      .json({ message: "Welcome " + user.name, user, token });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

const manualSignup = async (req, res) => {
  const { role, userId } = req.body;
  if (role && userId) {
    try {
      const user = await UserModel.findByIdAndUpdate(userId, { role: role });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: "SERVER ERROR : " + error });
    }
  } else {
    try {
      const { email, password, name, gitHuburl, linkedInUrl } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ message: "All fields required" });
      }

      const isEmailAlready = await UserModel.findOne({ email });
      if (isEmailAlready) {
        return res.status(400).json({ message: "Email Already Exist" });
      }
      const avatar = `https://robohash.org/mail@${email}`;

      const hashedPassword = await helper.hashedPassword(password);
      const user = await UserModel.create({
        email,
        username: email.split("@")[0],
        password: hashedPassword,
        name,
        gitHuburl,
        avatar,
        linkedInUrl,
      });
      const token = await helper.getToken(email, user._id);
      return res
        .status(200)
        .json({ message: "Welcome " + user.name, token, user });
    } catch (error) {
      return res.status(500).json({ message: "SERVER ERROR : " + error });
    }
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate('interest');
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

const sendOtpMail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const isemailAlreadyExist = await UserModel.findOne({ email });

    if (isemailAlreadyExist) {
      return res.status(400).json({ message: "Email Already Exist" });
    }

    const otp = generateOTP();
    const subject = "Your OTP Code";

    const html = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #fdf7dc;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 4px solid #000000;
      box-shadow: 8px 8px 0px 0px #000000;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 24px;
      color: #000000;
      margin: 0;
    }
    .otp-box {
      background-color: #ffeb3b;
      padding: 15px 20px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      border: 2px solid #000000;
      margin: 20px 0;
      box-shadow: 4px 4px 0px 0px #000000;
    }
    .message {
      font-size: 16px;
      color: #333333;
      line-height: 1.6;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #666666;
    }
    .footer a {
      color: #000000;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🔐 Your OTP Code</h1>
    </div>
    <div class="otp-box">
      ${otp}
    </div>
    <div class="message">
      <p>Use the above OTP to complete your verification process. This code is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Need help? <a href="mailto:support@yourwebsite.com">Contact Support</a></p>
      <p>&copy; 2024 Your Website Name</p>
    </div>
  </div>
</body>
</html>

    `;

    const response = await sendMail(email, subject, "", html);

    if (response.success) {
      return res.status(200).json({ message: response.message, OTP: otp });
    } else {
      return res.status(400).json({ message: response.error });
    }
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR : " + error });
  }
};

module.exports = {
  googleLogin,
  googleSignup,
  manualLogin,
  manualSignup,
  getUser,
  sendOtpMail,
};
