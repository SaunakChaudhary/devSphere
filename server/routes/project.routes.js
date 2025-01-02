const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");

router.route("/addProject").post(projectController.addProject);
router.route("/fetchProjects").post(projectController.fetchProjects);
router.route("/deleteProject").delete(projectController.deleteProject);
router.route("/editProject").put(projectController.editProject);
router.route("/likeUnlikePost").post(projectController.likeUnlikePost);

module.exports = router;
