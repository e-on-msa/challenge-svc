const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middleware/auth');
const attendanceCtrl = require('../controllers/attendanceController');
const participationCtrl = require('../controllers/participationController');

// 챌린지 참여 신청
router.post('/', isLoggedIn, participationCtrl.join);

// 유저별 챌린지 참여 상태 조회
router.get('/', isLoggedIn, participationCtrl.listByUser);

// 참여 기록 단건 조회
router.get('/:id', isLoggedIn, participationCtrl.getOne);

// 참여 취소
router.patch('/:id/cancel', isLoggedIn, participationCtrl.cancel);

// 출석 기록 추가
router.post('/:id/attendances', isLoggedIn, attendanceCtrl.add);

module.exports = router;
