const pool = require('../config/db');
const { isAllowedRole } = require('../constants');

async function departmentExists(departmentId) {
  const [rows] = await pool.query('SELECT id FROM departments WHERE id = ?', [departmentId]);
  return rows.length > 0;
}

const getAllStaff = async (req, res) => {
  const { id, department_id, q } = req.query;

  let sql = `
    SELECT s.id, s.first_name, s.last_name, s.email, s.role, s.department_id, s.shift_type,
           d.name AS department_name, s.created_at
    FROM staff s
    INNER JOIN departments d ON d.id = s.department_id
    WHERE 1 = 1
  `;
  const params = [];

  if (id !== undefined && String(id).trim() !== '') {
    const nid = Number(id);
    if (!Number.isInteger(nid) || nid < 1) {
      return res.status(400).json({ message: 'Invalid staff ID' });
    }
    sql += ' AND s.id = ?';
    params.push(nid);
  }

  if (department_id !== undefined && String(department_id).trim() !== '') {
    const did = Number(department_id);
    if (!Number.isInteger(did) || did < 1) {
      return res.status(400).json({ message: 'Invalid department' });
    }
    sql += ' AND s.department_id = ?';
    params.push(did);
  }

  if (q !== undefined && String(q).trim() !== '') {
    const term = `%${String(q).trim()}%`;
    sql += ` AND (
      s.first_name LIKE ? OR s.last_name LIKE ? OR s.email LIKE ?
      OR CAST(s.id AS CHAR) LIKE ? OR d.name LIKE ?
    )`;
    params.push(term, term, term, term, term);
  }

  sql += ' ORDER BY s.id DESC';

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
  }
};

const createStaff = async (req, res) => {
  const { first_name, last_name, email, role, department_id, shift_type = 'Morning' } = req.body;

  if (!first_name || !last_name || !email || !role || department_id === undefined || department_id === '') {
    return res.status(400).json({ message: 'All fields are required, including department' });
  }

  if (!isAllowedRole(role)) {
    return res.status(400).json({ message: 'Invalid role. Allowed: Doctor, Nurse, Admin, Receptionist' });
  }

  const deptId = Number(department_id);
  if (!Number.isInteger(deptId) || deptId < 1) {
    return res.status(400).json({ message: 'Invalid department' });
  }
  const shiftType = ['Morning', 'Evening', 'Night'].includes(shift_type) ? shift_type : 'Morning';

  try {
    if (!(await departmentExists(deptId))) {
      return res.status(400).json({ message: 'Department not found' });
    }

    const [result] = await pool.query(
      'INSERT INTO staff (first_name, last_name, email, role, department_id, shift_type) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, role, deptId, shiftType]
    );

    const [newStaffRows] = await pool.query(
      `SELECT s.id, s.first_name, s.last_name, s.email, s.role, s.department_id, s.shift_type,
              d.name AS department_name, s.created_at
       FROM staff s
       INNER JOIN departments d ON d.id = s.department_id
       WHERE s.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newStaffRows[0]);
  } catch (error) {
    const status = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
    const message = error.code === 'ER_DUP_ENTRY' ? 'Email already exists' : 'Failed to create staff';
    res.status(status).json({ message, error: error.message });
  }
};

const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, role, department_id, shift_type = 'Morning' } = req.body;

  if (!first_name || !last_name || !email || !role || department_id === undefined || department_id === '') {
    return res.status(400).json({ message: 'All fields are required, including department' });
  }

  if (!isAllowedRole(role)) {
    return res.status(400).json({ message: 'Invalid role. Allowed: Doctor, Nurse, Admin, Receptionist' });
  }

  const deptId = Number(department_id);
  if (!Number.isInteger(deptId) || deptId < 1) {
    return res.status(400).json({ message: 'Invalid department' });
  }
  const shiftType = ['Morning', 'Evening', 'Night'].includes(shift_type) ? shift_type : 'Morning';

  try {
    if (!(await departmentExists(deptId))) {
      return res.status(400).json({ message: 'Department not found' });
    }

    const [result] = await pool.query(
      'UPDATE staff SET first_name = ?, last_name = ?, email = ?, role = ?, department_id = ?, shift_type = ? WHERE id = ?',
      [first_name, last_name, email, role, deptId, shiftType, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const [updatedRows] = await pool.query(
      `SELECT s.id, s.first_name, s.last_name, s.email, s.role, s.department_id, s.shift_type,
              d.name AS department_name, s.created_at
       FROM staff s
       INNER JOIN departments d ON d.id = s.department_id
       WHERE s.id = ?`,
      [id]
    );

    res.json(updatedRows[0]);
  } catch (error) {
    const status = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
    const message = error.code === 'ER_DUP_ENTRY' ? 'Email already exists' : 'Failed to update staff';
    res.status(status).json({ message, error: error.message });
  }
};

const deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM staff WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete staff', error: error.message });
  }
};

module.exports = {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
};
