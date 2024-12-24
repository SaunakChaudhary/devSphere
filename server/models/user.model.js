const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "manual";
      },
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      required: function () {
        return this.authProvider === "google";
      },
    },
    interest: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hashtag" }],
    authProvider: {
      type: String,
      required: true,
      enum: ["google", "manual"],
      default: "manual",
    },
    avatar: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
    },
    gitHuburl: {
      type: String,
    },
    linkedInUrl: {
      type: String,
    },
    bio: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["user", "organization", "admin"],
      default: "user",
    },
    portfolioWebsite: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to update updatedAt before saving
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
