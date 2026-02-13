import pool from '../config/db.js';

export class AffiliateModel {
    /**
     * Find affiliate by email or phone
     */
    static async findByEmailOrPhone(identifier) {
        const [rows] = await pool.query(
            'SELECT * FROM affiliate WHERE email = ? OR phone = ? LIMIT 1',
            [identifier, identifier]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Create new affiliate
     */
    static async create(data) {
        const [result] = await pool.query('INSERT INTO affiliate SET ?', [data]);
        return result.insertId;
    }

    /**
     * Get all affiliates
     */
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM affiliate');
        return rows;
    }

    /**
     * Find affiliate by ID
     */
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM affiliate WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Update affiliate
     */
    static async update(id, data) {
        const [result] = await pool.query('UPDATE affiliate SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }

    /**
     * Delete affiliate
     */
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM affiliate WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    /**
     * Update last login time
     */
    static async updateLastLogin(id) {
        await pool.query(
            'UPDATE affiliate SET last_login = NOW() WHERE id = ?',
            [id]
        );
    }

    static async storeResetOTP(id, otp) {
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await pool.query(
            'UPDATE affiliate SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?',
            [otp, expires, id]
        );
    }

    static async verifyOTP(identifier, otp) {
        const [rows] = await pool.query(
            'SELECT * FROM affiliate WHERE (email = ? OR phone = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1',
            [identifier, identifier, otp]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    static async updatePassword(id, hashedPassword) {
        await pool.query(
            'UPDATE affiliate SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, id]
        );
    }
}
