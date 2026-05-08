-- One-time migration for existing databases (run against hospital_db).
-- If a statement errors because it was already applied, skip that line and continue.
-- mysql -u root -p hospital_db < server/migrations/001_departments_and_staff_department.sql

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO departments (name) VALUES
  ('Cardiology'),
  ('ICU'),
  ('Emergency'),
  ('Pediatrics'),
  ('Surgery'),
  ('Administration'),
  ('General');

ALTER TABLE staff ADD COLUMN department_id INT NULL;

UPDATE staff s
INNER JOIN departments d ON d.name = 'General'
SET s.department_id = d.id
WHERE s.department_id IS NULL;

ALTER TABLE staff MODIFY department_id INT NOT NULL;

ALTER TABLE staff
  ADD CONSTRAINT fk_staff_department
  FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE staff
  ADD COLUMN shift_type ENUM('Morning','Evening','Night') NOT NULL DEFAULT 'Morning';

CREATE TABLE IF NOT EXISTS attendance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  login_time DATETIME NULL,
  logout_time DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_staff_date (staff_id, attendance_date),
  CONSTRAINT fk_attendance_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
);

