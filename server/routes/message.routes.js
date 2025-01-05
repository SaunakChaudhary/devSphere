const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

router.route("/SearchUserExceptLoggedInUser/:query").post(messageController.SearchUserExceptLoggedInUser);
router.route("/sendMessage").post(messageController.sendMessage);
router.route("/deleteMessage").delete(messageController.deleteMessage);
router.route("/getMessage/:senderId/:receiverId").get(messageController.getMessage);

module.exports = router;
