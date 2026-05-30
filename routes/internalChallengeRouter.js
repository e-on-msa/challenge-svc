const express = require("express");
const router = express.Router();

const internalChallengeCtrl = require("../controllers/internalChallengeController");

// 추천 서비스용 사용자 챌린지 활동 조회
router.get(
  "/participations/user/:userId",
  internalChallengeCtrl.getUserChallengeActivity
);

// 추천 서비스용 활성 챌린지 내부 조회
router.get(
  "/challenges/active-with-categories",
  internalChallengeCtrl.getActiveWithCategories
);

module.exports = router;