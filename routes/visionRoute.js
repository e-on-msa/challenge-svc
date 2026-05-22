const express = require("express");
const router = express.Router();

const visionController = require("../controllers/visionController");

router.get("/", visionController.getAll);

module.exports = router;