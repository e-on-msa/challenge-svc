const express = require("express");
const router = express.Router();

const interestController = require("../controllers/interestController");

// 관심사 전체 조회
router.get("/", interestController.getAll);

// 관심사 카테고리 목록 조회
router.get("/categories", interestController.getCategories);

// 카테고리별 세부 관심사 조회
router.get("/categories/:categoryCode", interestController.getList);

module.exports = router;