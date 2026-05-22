const express = require("express");
const router = express.Router();

const challengeController = require("../controllers/challengeController");

router.get("/health", challengeController.healthCheck);

module.exports = router;