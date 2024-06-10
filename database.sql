CREATE DATABASE medical_database;

USE medical_databse;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    firstName VARCHAR(20) NOT NULL,
    lastName VARCHAR(20) Not NULL,
    identity_number VARCHAR(20) NOT NULL,
    role ENUM('patient', 'secretary', 'doctor') NOT NULL
);

CREATE TABLE patients (
    user_id INT PRIMARY KEY,
    amka VARCHAR(20) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE doctors (
    user_id INT PRIMARY KEY,
    specialization VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    date DATETIME NOT NULL,
    reason VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('created', 'attended', 'completed', 'cancelled') NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(user_id)
);

CREATE TABLE medical_history (
    patient_id INT NOT NULL,
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detected_health_issues TEXT NOT NULL,
    treatment TEXT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(user_id)
);

CREATE TABLE appointment_history (
    appointment_id INT NOT NULL,
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detected_health_issues TEXT NOT NULL,
    treatment TEXT NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

CREATE TABLE doctor_availability (
    doctor_id INT NOT NULL,
    slot DATETIME NOT NULL,
    PRIMARY KEY (doctor_id, slot),
    FOREIGN KEY (doctor_id) REFERENCES doctors(user_id)
);
-- Use the medical_database
USE medical_database;

-- Insert example data into the users table
    INSERT INTO users (username, email, password, firstName, lastName, identity_number, role) VALUES
    ('johndoe', 'johndoe@example.com', 'password123', 'John', 'Doe', '123456789', 'patient'),
('janedoe', 'janedoe@example.com', 'password123', 'Jane', 'Doe', '987654321', 'doctor'),
('marysmith', 'marysmith@example.com', 'password123', 'Mary', 'Smith', '111222333', 'secretary');

-- Insert example data into the patients table
INSERT INTO patients (user_id, amka) VALUES
(1, 'AMKA123456');

-- Insert example data into the doctors table
INSERT INTO doctors (user_id, specialization) VALUES
(2, 'Cardiologist');

-- Insert example data into the appointments table
INSERT INTO appointments (patient_id, date, reason, status) VALUES
(1, '2024-06-10 10:00:00', 'Regular check-up', 'created');

-- Insert example data into the medical_history table
INSERT INTO medical_history (patient_id, detected_health_issues, treatment) VALUES
(1, 'Hypertension', 'Prescribed medication');

-- Insert example data into the appointment_history table
INSERT INTO appointment_history (appointment_id, detected_health_issues, treatment) VALUES
(1, 'Hypertension', 'Blood pressure medication prescribed');

-- Insert example data into the doctor_availability table
INSERT INTO doctor_availability (doctor_id, slot) VALUES
(2, '2024-06-15 09:00:00');
