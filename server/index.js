const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const staffRoutes = require('./routes/staffRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/departments', departmentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/attendance', attendanceRoutes);

async function ensureDepartmentSchema() {
  const pool = require('./config/db');
  const defaultDepartments = [
    'Cardiology',
    'ICU',
    'Emergency',
    'Pediatrics',
    'Surgery',
    'Administration',
    'General',
  ];

  await pool.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  for (const name of defaultDepartments) {
    await pool.query('INSERT IGNORE INTO departments (name) VALUES (?)', [name]);
  }

  const [staffTable] = await pool.query(`SHOW TABLES LIKE 'staff'`);
  if (!staffTable.length) {
    throw new Error("Missing 'staff' table. Run server/schema.sql first.");
  }

  const [deptColumn] = await pool.query(`SHOW COLUMNS FROM staff LIKE 'department_id'`);
  if (!deptColumn.length) {
    await pool.query('ALTER TABLE staff ADD COLUMN department_id INT NULL');
  }

  const [generalRows] = await pool.query("SELECT id FROM departments WHERE name = 'General' LIMIT 1");
  const generalDepartmentId = generalRows[0]?.id;
  if (!generalDepartmentId) {
    throw new Error("Unable to resolve default 'General' department.");
  }

  await pool.query('UPDATE staff SET department_id = ? WHERE department_id IS NULL', [generalDepartmentId]);

  if (!deptColumn.length || deptColumn[0].Null !== 'NO') {
    await pool.query('ALTER TABLE staff MODIFY department_id INT NOT NULL');
  }

  const [fkRows] = await pool.query(`
    SELECT CONSTRAINT_NAME
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'staff'
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      AND CONSTRAINT_NAME = 'fk_staff_department'
  `);

  if (!fkRows.length) {
    await pool.query(`
      ALTER TABLE staff
      ADD CONSTRAINT fk_staff_department
      FOREIGN KEY (department_id) REFERENCES departments(id)
    `);
  }

  const [shiftColumn] = await pool.query(`SHOW COLUMNS FROM staff LIKE 'shift_type'`);
  if (!shiftColumn.length) {
    await pool.query("ALTER TABLE staff ADD COLUMN shift_type ENUM('Morning','Evening','Night') NOT NULL DEFAULT 'Morning'");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance_records (
      id INT AUTO_INCREMENT PRIMARY KEY,
      staff_id INT NOT NULL,
      attendance_date DATE NOT NULL,
      login_time DATETIME NULL,
      logout_time DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_staff_date (staff_id, attendance_date),
      CONSTRAINT fk_attendance_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
    )
  `);

}

async function startServer() {
  try {
    await ensureDepartmentSchema();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
}

startServer();
