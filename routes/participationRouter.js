const express = require('express');
const router = express.Router();
const attendanceCtrl = require('../controllers/attendanceController');

// 출석 추가
router.post('/:id/attendances', attendanceCtrl.add);

module.exports = router;