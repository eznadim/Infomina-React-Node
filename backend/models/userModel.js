const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const userModel = {
  async findByUsername(username) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by username: ${error.message}`);
    }
  },
  
  async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  },
  
  async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  },
  
  async createUser(userData) {
    try {
      const { username, password, email, role } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.query(
        'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, email, role || 'user']
      );
      
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  },
  
  async updateUser(id, userData) {
    try {
      const fields = [];
      const values = [];
      
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      
      Object.keys(userData).forEach(key => {
        if (key !== 'id') {
          fields.push(`${key} = ?`);
          values.push(userData[key]);
        }
      });
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      
      const [result] = await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  },
  
  async deleteUser(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
};

module.exports = userModel;