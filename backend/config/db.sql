-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS fitness_center;
USE fitness_center;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  date_of_birth DATE,
  membership_status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
  membership_type ENUM('basic', 'premium', 'gold') DEFAULT 'basic',
  joining_date DATE NOT NULL,
  membership_expiry DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes
ALTER TABLE members ADD INDEX idx_membership_status (membership_status);
ALTER TABLE members ADD INDEX idx_membership_type (membership_type);
ALTER TABLE members ADD INDEX idx_membership_expiry (membership_expiry); 