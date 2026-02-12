import pool from '../config/db.js';

export interface Merchant {
    id: number;
    email: string;
    phone: string;
    password?: string;
    [key: string]: any;
}

export class MerchantModel {
    /**
     * Find merchant by email or phone
     */
    static async findByEmailOrPhone(identifier: string): Promise<Merchant | null> {
        const [rows]: any = await pool.query(
            'SELECT * FROM merchant WHERE email = ? OR phone = ? LIMIT 1',
            [identifier, identifier]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Find merchant by ID
     */
    static async findById(id: number): Promise<Merchant | null> {
        const [rows]: any = await pool.query(
            'SELECT * FROM merchant WHERE id = ? LIMIT 1',
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Create new merchant
     */
    static async create(data: Partial<Merchant>): Promise<number> {
        const [result]: any = await pool.query('INSERT INTO merchant SET ?', [data]);
        return result.insertId;
    }

    /**
     * Get all merchants
     */
    static async findAll(): Promise<Merchant[]> {
        const [rows]: any = await pool.query('SELECT * FROM merchant');
        return rows;
    }

    /**
     * Update merchant
     */
    static async update(id: number, data: Partial<Merchant>): Promise<boolean> {
        const [result]: any = await pool.query('UPDATE merchant SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }

    /**
     * Delete merchant
     */
    static async delete(id: number): Promise<boolean> {
        const [result]: any = await pool.query('DELETE FROM merchant WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    /**
     * Update last login timestamp
     */
    static async updateLastLogin(id: number): Promise<void> {
        await pool.query(
            'UPDATE merchant SET last_login = NOW() WHERE id = ?',
            [id]
        );
    }

    /**
   * Store Reset OTP
   */
    static async storeResetOTP(id: number, otp: string): Promise<void> {
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        await pool.query(
            'UPDATE merchant SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?',
            [otp, expires, id]
        );
    }

    /**
     * Verify OTP
     */
    static async verifyOTP(identifier: string, otp: string): Promise<Merchant | null> {
        const [rows]: any = await pool.query(
            'SELECT * FROM merchant WHERE (email = ? OR phone = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1',
            [identifier, identifier, otp]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Update Password
     */
    static async updatePassword(id: number, hashedPassword: string): Promise<void> {
        await pool.query(
            'UPDATE merchant SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, id]
        );
    }

    /**
     * Store Login OTP
     */
    static async storeLoginOTP(id: number, otp: string): Promise<void> {
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        await pool.query(
            'UPDATE merchant SET login_otp = ?, login_otp_expires = ? WHERE id = ?',
            [otp, expires, id]
        );
    }

    /**
     * Verify Login OTP
     */
    static async verifyLoginOTP(identifier: string, otp: string): Promise<Merchant | null> {
        const [rows]: any = await pool.query(
            'SELECT * FROM merchant WHERE (email = ? OR phone = ?) AND login_otp = ? AND login_otp_expires > NOW() LIMIT 1',
            [identifier, identifier, otp]
        );
        return rows.length > 0 ? rows[0] : null;
    }
}
