import pool from '../config/db.js';
export class UserModel {
    /**
     * Find user by email or mobile
     */
    static async findByEmailOrMobile(identifier) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? OR mobile = ?', [identifier, identifier]);
        return rows.length > 0 ? rows[0] : null;
    }
    /**
     * Create new user
     */
    static async create(data) {
        const [result] = await pool.query('INSERT INTO users SET ?', [data]);
        return result.insertId;
    }
    /**
     * Get all users
     */
    static async findAll() {
        const [rows] = await pool.query('SELECT id, name, email, mobile, role, created_at FROM users');
        return rows;
    }
    /**
     * Find user by ID
     */
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    /**
     * Update user
     */
    static async update(id, data) {
        const [result] = await pool.query('UPDATE users SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }
    /**
     * Delete user
     */
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    /**
     * Update last login time
     */
    static async updateLastLogin(id) {
        // Note: 'users' table might not have last_login, check schema
        // await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
    }
    static async storeResetOTP(id, otp) {
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await pool.query('UPDATE users SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?', [otp, expires, id]);
    }
    static async verifyOTP(identifier, otp) {
        const [rows] = await pool.query('SELECT * FROM users WHERE (email = ? OR mobile = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1', [identifier, identifier, otp]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async updatePassword(id, hashedPassword) {
        await pool.query('UPDATE users SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?', [hashedPassword, id]);
    }
}
