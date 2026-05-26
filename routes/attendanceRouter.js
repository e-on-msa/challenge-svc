const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/auth");
const ctrl = require("../controllers/attendanceController");

// 출석 기록 수정
router.patch("/:id", isLoggedIn, ctrl.update);

// 출석 기록 삭제
router.delete("/:id", isLoggedIn, ctrl.remove);

// 최근 7일 이내 결석 여부 조회
router.get("/check-absence", ctrl.checkAbsence);

module.exports = router;