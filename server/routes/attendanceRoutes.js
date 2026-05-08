const express = require('express');
const {
  getDailyAttendance,
  markLogin,
  markLogout,
  getShiftAllocations,
  updateShift,
} = require('../controllers/attendanceController');

const router = express.Router();

router.get('/daily', getDailyAttendance);
router.post('/login', markLogin);
router.post('/logout', markLogout);
router.get('/shifts', getShiftAllocations);
router.put('/shifts/:id', updateShift);

module.exports = router;
