const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middleware/auth');
const attendanceCtrl = require('../controllers/attendanceController');

// 출석 기록 추가
router.post('/:id/attendances', isLoggedIn, attendanceCtrl.add);

module.exports = router;