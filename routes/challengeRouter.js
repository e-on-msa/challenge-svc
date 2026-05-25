const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { isLoggedIn } = require("../middleware/auth");
const challengeCtrl = require("../controllers/challengeController");
const reviewCtrl = require("../controllers/reviewController");


/** ---------------- 챌린지 ---------------- **/
router.post(
  '/',
  isLoggedIn,
  upload.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'consents', maxCount: 1 }
  ]),
  challengeCtrl.create
);
router.get("/", challengeCtrl.list);
router.patch("/:id/state", isLoggedIn, challengeCtrl.changeState);
router.get("/:id", challengeCtrl.detail);
router.patch("/:id", isLoggedIn, challengeCtrl.update);
router.delete("/:id", isLoggedIn, challengeCtrl.remove);

/** ---------------- 리뷰 ---------------- **/
// 작성
router.post("/:id/reviews", isLoggedIn, reviewCtrl.create);

// 목록 조회
router.get("/:id/reviews", reviewCtrl.list);

module.exports = router;