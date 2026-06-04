const express = require("express");
const router = express.Router();

const visionController = require("../controllers/visionController");

// 진로희망 전체 조회
router.get("/", visionController.getAll);

// 진로희망 카테고리 목록 조회
router.get("/categories", visionController.getCategories);

// 카테고리별 세부 진로희망 조회
router.get("/list/:categoryCode", visionController.getList);

module.exports = router;