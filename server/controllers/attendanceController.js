const pool = require('../config/db');

const ALLOWED_SHIFTS = ['Morning', 'Evening', 'Night'];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const getDailyAttendance = async (req, res) => {
  const date = req.query.date || todayISO();
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.staff_id, a.attendance_date, a.login_time, a.logout_time,
              s.first_name, s.last_name, s.shift_type, d.name AS department_name
       FROM attendance_records a
       INNER JOIN staff s ON s.id = a.staff_id
       INNER JOIN departments d ON d.id = s.department_id
       WHERE a.attendance_date = ?
       ORDER BY a.id DESC`,
      [date]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message });
  }
};

const markLogin = async (req, res) => {
  const { staff_id, attendance_date } = req.body;
  const date = attendance_date || todayISO();
  if (!staff_id) return res.status(400).json({ message: 'staff_id is required' });

  try {
    const [existing] = await pool.query(
      'SELECT id FROM attendance_records WHERE staff_id = ? AND attendance_date = ? LIMIT 1',
      [staff_id, date]
    );
    if (existing.length) {
      return res.status(409).json({ message: 'Login already marked for this staff today' });
    }

    await pool.query(
      'INSERT INTO attendance_records (staff_id, attendance_date, login_time) VALUES (?, ?, NOW())',
      [staff_id, date]
    );
    res.status(201).json({ message: 'Login marked' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark login', error: error.message });
  }
};

const markLogout = async (req, res) => {
  const { staff_id, attendance_date } = req.body;
  const date = attendance_date || todayISO();
  if (!staff_id) return res.status(400).json({ message: 'staff_id is required' });

  try {
    const [result] = await pool.query(
      `UPDATE attendance_records
       SET logout_time = NOW()
       WHERE staff_id = ? AND attendance_date = ? AND logout_time IS NULL`,
      [staff_id, date]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No active login found for this staff on selected date' });
    }
    res.json({ message: 'Logout marked' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark logout', error: error.message });
  }
};

const getShiftAllocations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.first_name, s.last_name, s.shift_type, d.name AS department_name
       FROM staff s
       INNER JOIN departments d ON d.id = s.department_id
       ORDER BY s.id DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shifts', error: error.message });
  }
};

const updateShift = async (req, res) => {
  const { id } = req.params;
  const { shift_type } = req.body;
  if (!ALLOWED_SHIFTS.includes(shift_type)) {
    return res.status(400).json({ message: 'Invalid shift. Use Morning, Evening, or Night.' });
  }
  try {
    const [result] = await pool.query('UPDATE staff SET shift_type = ? WHERE id = ?', [shift_type, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ message: 'Shift updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update shift', error: error.message });
  }
};

module.exports = {
  getDailyAttendance,
  markLogin,
  markLogout,
  getShiftAllocations,
  updateShift,
};
