const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

router.route("/SearchUserExceptLoggedInUser/:query").post(messageController.SearchUserExceptLoggedInUser);
router.route("/sendMessage").post(messageController.sendMessage);
router.route("/deleteMessage").delete(messageController.deleteMessage);
router.route("/clear-msg").delete(messageController.clearMsg);
router.route("/recentChats/:senderId").get(messageController.recentChats);
router.route("/getMessage/:senderId/:receiverId").get(messageController.getMessage);
router.route("/isRead/:senderId/:receiverId").put(messageController.isRead);

module.exports = router;
