import pool from '../config/db.js';

export interface Affiliate {
    id: number;
    name: string;
    email: string;
    phone: string;
    password?: string;
    referral_code: string;
    status: 'active' | 'inactive' | 'pending' | 'blocked';
    [key: string]: any;
}

export class AffiliateModel {
    /**
     * Find affiliate by email or phone
     */
    static async findByEmailOrPhone(identifier: string): Promise<Affiliate | null> {
        const [rows]: any = await pool.query(
            'SELECT * FROM affiliate WHERE email = ? OR phone = ? LIMIT 1',
            [identifier, identifier]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Create new affiliate
     */
    static async create(data: Partial<Affiliate>): Promise<number> {
        const [result]: any = await pool.query('INSERT INTO affiliate SET ?', [data]);
        return result.insertId;
    }

    /**
     * Get all affiliates
     */
    static async findAll(): Promise<Affiliate[]> {
        const [rows]: any = await pool.query('SELECT * FROM affiliate');
        return rows;
    }

    /**
     * Find affiliate by ID
     */
    static async findById(id: number): Promise<Affiliate | null> {
        const [rows]: any = await pool.query('SELECT * FROM affiliate WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Update affiliate
     */
    static async update(id: number, data: Partial<Affiliate>): Promise<boolean> {
        const [result]: any = await pool.query('UPDATE affiliate SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }

    /**
     * Delete affiliate
     */
    static async delete(id: number): Promise<boolean> {
        const [result]: any = await pool.query('DELETE FROM affiliate WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    /**
     * Update last login time
     */
    static async updateLastLogin(id: number): Promise<void> {
        await pool.query(
            'UPDATE affiliate SET last_login = NOW() WHERE id = ?',
            [id]
        );
    }

    static async storeResetOTP(id: number, otp: string): Promise<void> {
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await pool.query(
            'UPDATE affiliate SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?',
            [otp, expires, id]
        );
    }

    static async verifyOTP(identifier: string, otp: string): Promise<Affiliate | null> {
        const [rows]: any = await pool.query(
            'SELECT * FROM affiliate WHERE (email = ? OR phone = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1',
            [identifier, identifier, otp]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    static async updatePassword(id: number, hashedPassword: string): Promise<void> {
        await pool.query(
            'UPDATE affiliate SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, id]
        );
    }
}
