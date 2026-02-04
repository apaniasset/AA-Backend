import pool from '../config/db.js';
export class MerchantModel {
    /**
     * Find merchant by email or phone
     */
    static async findByEmailOrPhone(identifier) {
        const [rows] = await pool.query('SELECT * FROM merchant WHERE email = ? OR phone = ? LIMIT 1', [identifier, identifier]);
        return rows.length > 0 ? rows[0] : null;
    }
    /**
     * Find merchant by ID
     */
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM merchant WHERE id = ? LIMIT 1', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    /**
     * Create new merchant
     */
    static async create(data) {
        const [result] = await pool.query('INSERT INTO merchant SET ?', [data]);
        return result.insertId;
    }
    /**
     * Get all merchants
     */
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM merchant');
        return rows;
    }
    /**
     * Update merchant
     */
    static async update(id, data) {
        const [result] = await pool.query('UPDATE merchant SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }
    /**
     * Delete merchant
     */
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM merchant WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    /**
     * Update last login timestamp
     */
    static async updateLastLogin(id) {
        await pool.query('UPDATE merchant SET last_login = NOW() WHERE id = ?', [id]);
    }
    /**
   * Store Reset OTP
   */
    static async storeResetOTP(id, otp) {
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        await pool.query('UPDATE merchant SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?', [otp, expires, id]);
    }
    /**
     * Verify OTP
     */
    static async verifyOTP(identifier, otp) {
        const [rows] = await pool.query('SELECT * FROM merchant WHERE (email = ? OR phone = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1', [identifier, identifier, otp]);
        return rows.length > 0 ? rows[0] : null;
    }
    /**
     * Update Password
     */
    static async updatePassword(id, hashedPassword) {
        await pool.query('UPDATE merchant SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?', [hashedPassword, id]);
    }
}
