const pool = require('../config/db');

const getAllStaff = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email, role, created_at FROM staff ORDER BY id DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
  }
};

const createStaff = async (req, res) => {
  const { first_name, last_name, email, role } = req.body;

  if (!first_name || !last_name || !email || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO staff (first_name, last_name, email, role) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, role]
    );

    const [newStaffRows] = await pool.query(
      'SELECT id, first_name, last_name, email, role, created_at FROM staff WHERE id = ?',
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
  const { first_name, last_name, email, role } = req.body;

  if (!first_name || !last_name || !email || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE staff SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ?',
      [first_name, last_name, email, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const [updatedRows] = await pool.query(
      'SELECT id, first_name, last_name, email, role, created_at FROM staff WHERE id = ?',
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
