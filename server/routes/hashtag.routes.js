const express = require("express");
const router = express.Router();
const hashtagsController = require("../controllers/hashtag.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.route("/get-hashtags").get(hashtagsController.getHashtags);
router.route("/addIntoUserSchema").post(authMiddleware.userAuthMiddleware,hashtagsController.addIntoUserSchema);

module.exports = router;