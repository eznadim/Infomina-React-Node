const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'fitness_user',
  password: process.env.DB_PASSWORD || '1q2w3E#',
  database: process.env.DB_NAME || 'fitness_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to test the database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection }; 