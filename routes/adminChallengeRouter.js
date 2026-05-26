const express = require("express");
const router = express.Router();

const { isLoggedIn, isAdmin } = require("../middleware/auth");
const adminCtrl = require("../controllers/adminChallengeController");

// 승인 대기 중인 챌린지 목록 조회
router.get("/", isLoggedIn, isAdmin, adminCtrl.listPending);

// 관리자용 챌린지 상세 조회 (모든 상태)
router.get('/:id', isAdmin, adminCtrl.detail);

// 챌린지 승인 처리
router.patch("/:id/approve", isLoggedIn, isAdmin, adminCtrl.approve);

// 챌린지 거절
router.patch("/:id/reject", isLoggedIn, isAdmin, adminCtrl.reject);

module.exports = router;