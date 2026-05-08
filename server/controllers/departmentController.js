const pool = require('../config/db');

const getAllDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, created_at FROM departments ORDER BY name ASC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch departments', error: error.message });
  }
};

const createDepartment = async (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const [result] = await pool.query('INSERT INTO departments (name) VALUES (?)', [name]);
    const [rows] = await pool.query('SELECT id, name, created_at FROM departments WHERE id = ?', [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    const status = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
    const message = error.code === 'ER_DUP_ENTRY' ? 'Department name already exists' : 'Failed to create department';
    res.status(status).json({ message, error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const name = (req.body.name || '').trim();

  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const [result] = await pool.query('UPDATE departments SET name = ? WHERE id = ?', [name, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const [rows] = await pool.query('SELECT id, name, created_at FROM departments WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    const status = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
    const message = error.code === 'ER_DUP_ENTRY' ? 'Department name already exists' : 'Failed to update department';
    res.status(status).json({ message, error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const [countRows] = await pool.query(
      'SELECT COUNT(*) AS c FROM staff WHERE department_id = ?',
      [id]
    );

    if (countRows[0].c > 0) {
      return res.status(409).json({
        message: 'Cannot delete department while staff are assigned. Reassign staff first.',
      });
    }

    const [result] = await pool.query('DELETE FROM departments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete department', error: error.message });
  }
};

module.exports = {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
