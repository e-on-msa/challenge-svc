const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/attendanceController");
const { isLoggedIn } = require("../middleware/auth");

// 출석 수정
// router.patch("/:id", isLoggedIn, ctrl.update);

// 출석 삭제
// router.delete("/:id", isLoggedIn, ctrl.remove);

// 결석 여부 체크
// router.get("/check-absence", ctrl.checkAbsence);

module.exports = router;