import pool from '../config/db.js';

export interface User {
    id: number;
    name: string;
    email: string;
    mobile?: string;
    password?: string;
    [key: string]: any;
}

export class UserModel {
    /**
     * Find user by email or mobile
     */
    static async findByEmailOrMobile(identifier: string): Promise<User | null> {
        const [rows]: any = await pool.query(
            'SELECT * FROM users WHERE email = ? OR mobile = ?',
            [identifier, identifier]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Create new user
     */
    static async create(data: Partial<User>): Promise<number> {
        const [result]: any = await pool.query('INSERT INTO users SET ?', [data]);
        return result.insertId;
    }

    /**
     * Get all users
     */
    static async findAll(): Promise<User[]> {
        const [rows]: any = await pool.query('SELECT id, name, email, mobile, role, created_at FROM users');
        return rows;
    }

    /**
     * Find user by ID
     */
    static async findById(id: number): Promise<User | null> {
        const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Update user
     */
    static async update(id: number, data: Partial<User>): Promise<boolean> {
        const [result]: any = await pool.query('UPDATE users SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }

    /**
     * Delete user
     */
    static async delete(id: number): Promise<boolean> {
        const [result]: any = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    /**
     * Update last login time
     */
    static async updateLastLogin(id: number): Promise<void> {
        // Note: 'users' table might not have last_login, check schema
        // await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
    }

    static async storeResetOTP(id: number, otp: string): Promise<void> {
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await pool.query(
            'UPDATE users SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?',
            [otp, expires, id]
        );
    }

    static async verifyOTP(identifier: string, otp: string): Promise<User | null> {
        const [rows]: any = await pool.query(
            'SELECT * FROM users WHERE (email = ? OR mobile = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1',
            [identifier, identifier, otp]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    static async updatePassword(id: number, hashedPassword: string): Promise<void> {
        await pool.query(
            'UPDATE users SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, id]
        );
    }
}
