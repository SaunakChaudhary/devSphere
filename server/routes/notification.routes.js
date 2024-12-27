const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");

router.route("/updateNotificationMode").post(NotificationController.updateNotificationMode);
router.route("/notificationCount/:user").get(NotificationController.notificationCount);

module.exports = router;
