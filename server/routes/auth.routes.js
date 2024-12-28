const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.route("/google-signup").get(authController.googleSignup);
router.route("/google-login").get(authController.googleLogin);
router.route("/manual-login").post(authController.manualLogin);
router.route("/manual-signup").post(authController.manualSignup);
router.route("/send-otp-mail").post(authController.sendOtpMail);
router.route("/getAllUser").get(authController.getAllUser);

router.route("/get-user").get(authMiddleware.userAuthMiddleware, authController.getUser);

module.exports = router;
