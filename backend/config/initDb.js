const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  const dbName = process.env.DB_NAME || 'fitness_center';
  
  try {
    console.log(`Attempting to connect to MySQL at ${process.env.DB_HOST || 'localhost'} with user ${process.env.DB_USER || 'fitness_user'}`);
    
    // First connect without database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'fitness_user',
      password: process.env.DB_PASSWORD || 'strong_password',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('Connected to MySQL server successfully');
    
    // Create database if it doesn't exist
    console.log(`Creating database ${dbName} if it doesn't exist`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database ${dbName} created or already exists`);
    
    // Use the database
    console.log(`Switching to database ${dbName}`);
    await connection.query(`USE ${dbName}`);
    console.log(`Now using database ${dbName}`);
    
    // Create users table
    console.log('Creating users table if it doesn\'t exist');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create members table
    console.log('Creating members table if it doesn\'t exist');
    await connection.query(`
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
      )
    `);
    
    // Add indexes
    console.log('Adding indexes to members table');
    await connection.query('ALTER TABLE members ADD INDEX idx_membership_status (membership_status)');
    await connection.query('ALTER TABLE members ADD INDEX idx_membership_type (membership_type)');
    await connection.query('ALTER TABLE members ADD INDEX idx_membership_expiry (membership_expiry)');
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Check your username/password in .env file');
    console.log('3. If using root, try with an empty password');
    console.log('4. Create a new MySQL user with full privileges');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase }; 