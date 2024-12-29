const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");

router.route("/getSearchResults").get(searchController.getSearchResults);
router.route("/searchedUser/:id").get(searchController.searchedUser);
router.route("/redirectUser/:username").get(searchController.redirectUser);

module.exports = router;