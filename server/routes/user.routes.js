const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { upload1 } = require("../utils/multer");

const conditionalUpload = (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    // Apply multer middleware
    return upload1.fields([{ name: "avatar", maxCount: 1 }])(req, res, next);
  }
  // Skip multer middleware and proceed
  next();
};

router
  .route("/update-profile")
  .post(conditionalUpload, userController.updatProfile);

router.route("/displayAllCounts").post(userController.displayAllCounts);
router.route("/followUnFollow").post(userController.followUnFollow);
module.exports = router;
