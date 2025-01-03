const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

router.route("/create-comment").post(commentController.createComment);
router.route("/update-comment/:commentId").put(commentController.updateComment);
router.route("/delete-comment/:commentId/:postId").delete(commentController.deleteComment);
router.route("/fecth-comment/:postId").get(commentController.getCommentsByPost);

module.exports = router;
