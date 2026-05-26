const express = require("express");
const router = express.Router();

const visionController = require("../controllers/visionController");

// 진로희망 전체 조회
router.get("/", visionController.getAll);

module.exports = router;