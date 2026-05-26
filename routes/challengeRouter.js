const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { isLoggedIn } = require("../middleware/auth");
const challengeCtrl = require("../controllers/challengeController");
const reviewCtrl = require("../controllers/reviewController");
const attachmentCtrl = require("../controllers/attachmentController");
const attendanceCtrl = require("../controllers/attendanceController");

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
// 리뷰 작성
router.post("/:id/reviews", isLoggedIn, reviewCtrl.create);

// 리뷰 목록 조회
router.get("/:id/reviews", reviewCtrl.list);

/** ---------------- 첨부파일 ---------------- **/
// 첨부파일 업로드
router.post(
  "/:id/attachments",
  isLoggedIn,
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "consents", maxCount: 1 },
  ]),
  attachmentCtrl.add
);

// 첨부파일 목록 조회
router.get("/:id/attachments",attachmentCtrl.list);

/** ---------------- 출석 ---------------- **/
// 챌린지별 출석 목록 조회
router.get('/:id/attendance', attendanceCtrl.listByChallenge);


module.exports = router;