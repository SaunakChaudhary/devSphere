const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");

router.route("/addProject").post(projectController.addProject);

module.exports = router;
