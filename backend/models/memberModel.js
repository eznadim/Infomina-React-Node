const { pool } = require('../config/database');

const memberModel = {
  // Find all members
  async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM members ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error finding members: ${error.message}`);
    }
  },

  // Find a member by id
  async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM members WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding member: ${error.message}`);
    }
  },

  // Create a new member
  async create(memberData) {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        address,
        date_of_birth,
        membership_status,
        membership_type,
        joining_date,
        membership_expiry
      } = memberData;

      const [result] = await pool.query(
        `INSERT INTO members (
          first_name, 
          last_name, 
          email, 
          phone, 
          address, 
          date_of_birth, 
          membership_status, 
          membership_type, 
          joining_date, 
          membership_expiry
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name,
          last_name,
          email,
          phone || null,
          address || null,
          date_of_birth || null,
          membership_status || 'active',
          membership_type || 'basic',
          joining_date,
          membership_expiry || null
        ]
      );

      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating member: ${error.message}`);
    }
  },

  // Update a member
  async update(id, memberData) {
    try {
      const fields = [];
      const values = [];

      // Dynamically build the update query based on provided fields
      Object.keys(memberData).forEach(key => {
        if (key !== 'id') {
          fields.push(`${key} = ?`);
          values.push(memberData[key]);
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      // Add the id to the values array
      values.push(id);

      const [result] = await pool.query(
        `UPDATE members SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating member: ${error.message}`);
    }
  },

  // Delete a member
  async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM members WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting member: ${error.message}`);
    }
  },

  // Search members by name or email
  async search(query) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await pool.query(
        `SELECT * FROM members 
         WHERE first_name LIKE ? 
         OR last_name LIKE ? 
         OR email LIKE ?
         ORDER BY first_name ASC`,
        [searchTerm, searchTerm, searchTerm]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error searching members: ${error.message}`);
    }
  },

  // Filter members by status and/or type
  async filter(filters) {
    try {
      let query = 'SELECT * FROM members WHERE 1=1';
      const values = [];

      if (filters.membership_status) {
        query += ' AND membership_status = ?';
        values.push(filters.membership_status);
      }

      if (filters.membership_type) {
        query += ' AND membership_type = ?';
        values.push(filters.membership_type);
      }

      query += ' ORDER BY first_name ASC';
      
      const [rows] = await pool.query(query, values);
      return rows;
    } catch (error) {
      throw new Error(`Error filtering members: ${error.message}`);
    }
  },

  // Get member statistics
  async getStats() {
    try {
      const [totalMembers] = await pool.query('SELECT COUNT(*) as total FROM members');
      const [activeMembers] = await pool.query('SELECT COUNT(*) as active FROM members WHERE membership_status = "active"');
      const [byType] = await pool.query('SELECT membership_type, COUNT(*) as count FROM members GROUP BY membership_type');
      
      return {
        totalMembers: totalMembers[0].total,
        activeMembers: activeMembers[0].active,
        membershipTypes: byType
      };
    } catch (error) {
      throw new Error(`Error getting member statistics: ${error.message}`);
    }
  }
};

module.exports = memberModel;