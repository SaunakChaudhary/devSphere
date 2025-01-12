const express = require("express");
const router = express.Router();
const communityController = require("../controllers/community.controller");
const { upload2 } = require("../utils/multer");

const conditionalUpload = (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    upload2.fields([
      { name: "logo", maxCount: 1 },
      { name: "coverPhoto", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "File upload error: " + err.message });
      }
      next();
    });
  } else {
    next();
  }
};

router
  .route("/create")
  .post(conditionalUpload, communityController.createCommunity);

  router
  .route("/displayAllCommunity")
  .get(communityController.dispCommunity);

  router
  .route("/searchedCommunity/:id")
  .get(communityController.searchedCommunity);
  
router
  .route("/joinCommunity")
  .post(communityController.joinCommunity);

module.exports = router;
