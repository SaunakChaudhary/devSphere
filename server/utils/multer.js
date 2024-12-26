const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary.config");

const storage1 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "devsphere_user_profile", // Set folder name in Cloudinary
      allowed_formats: ["jpg", "png", "jpeg", "pdf"], // Allowed file formats
      public_id: `${Date.now()}-${file.originalname}`, // Unique image name
    };
  },
});

const upload1 = multer({ storage: storage1 });

module.exports = {upload1};