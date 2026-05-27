const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { isLoggedIn } = require("../middleware/auth");
const challengeCtrl = require("../controllers/challengeController");
const reviewCtrl = require("../controllers/reviewController");
const attachmentCtrl = require("../controllers/attachmentController");
const attendanceCtrl = require("../controllers/attendanceController");

/** ---------------- 챌린지 ---------------- **/
// 챌린지 개설
router.post(
  '/',
  isLoggedIn,
  upload.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'consents', maxCount: 1 }
  ]),
  challengeCtrl.create
);

// 챌린지 목록 조회
router.get("/", challengeCtrl.list);

// 챌린지 상태 변경
router.patch("/:id/state", isLoggedIn, challengeCtrl.changeState);

// 챌린지 상세 조회
router.get("/:id", challengeCtrl.detail);

// 챌린지 수정
router.patch("/:id", isLoggedIn, challengeCtrl.update);

// 챌린지 삭제
router.delete("/:id", isLoggedIn, challengeCtrl.remove);


/** ---------------- 마이페이지용 ---------------- **/
// 내가 신청한 챌린지 활동 내역 조회 (참여 이력)
router.get('/my/participated', isLoggedIn, challengeCtrl.myParticipated);

// 내가 개설한 챌린지 활동 내역 조회
router.get('/my/created', isLoggedIn, challengeCtrl.myCreated);


/** ----------------- 리뷰 ------------------ **/
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


/** ----------------- 출석 ------------------ **/
// 챌린지별 출석 목록 조회
router.get('/:id/attendance', attendanceCtrl.listByChallenge);


module.exports = router;