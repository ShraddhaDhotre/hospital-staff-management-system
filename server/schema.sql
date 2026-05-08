CREATE DATABASE IF NOT EXISTS hospital_db;

USE hospital_db;



CREATE TABLE IF NOT EXISTS departments (

  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(100) NOT NULL UNIQUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS staff (

  id INT AUTO_INCREMENT PRIMARY KEY,

  first_name VARCHAR(100) NOT NULL,

  last_name VARCHAR(100) NOT NULL,

  email VARCHAR(150) NOT NULL UNIQUE,

  role VARCHAR(50) NOT NULL,

  department_id INT NOT NULL,

  shift_type ENUM('Morning','Evening','Night') NOT NULL DEFAULT 'Morning',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_staff_department FOREIGN KEY (department_id) REFERENCES departments(id)

);

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

INSERT IGNORE INTO departments (name) VALUES

  ('Cardiology'),

  ('ICU'),

  ('Emergency'),

  ('Pediatrics'),

  ('Surgery'),

  ('Administration'),

  ('General');

