const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");

router.route("/addProject").post(projectController.addProject);
router.route("/fetchProjects").post(projectController.fetchProjects);

module.exports = router;
