import pool from '../config/db.js';

/**
 * Find admin by email or phone
 */
export const findByEmailOrPhone = async (identifier) => {
    const [rows] = await pool.query(
        'SELECT * FROM admin WHERE email = ? OR phone = ?',
        [identifier, identifier]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Create new admin
 */
export const create = async (data) => {
    const [result] = await pool.query('INSERT INTO admin SET ?', [data]);
    return result.insertId;
};

/**
 * Get all admins
 */
export const findAll = async () => {
    const [rows] = await pool.query('SELECT id, name, email, phone, role, status, last_login, created_at FROM admin');
    return rows;
};

/**
 * Find admin by ID
 */
export const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM admin WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update admin
 */
export const update = async (id, data) => {
    const [result] = await pool.query('UPDATE admin SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
};

/**
 * Delete admin
 */
export const remove = async (id) => {
    const [result] = await pool.query('DELETE FROM admin WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

/**
 * Update last login time
 */
export const updateLastLogin = async (id) => {
    await pool.query('UPDATE admin SET last_login = NOW() WHERE id = ?', [id]);
};

/**
 * Store Reset OTP
 */
export const storeResetOTP = async (id, otp) => {
    const expires = new Date(Date.now() + 10 * 60000); // 10 minutes
    await pool.query(
        'UPDATE admin SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?',
        [otp, expires, id]
    );
};

/**
 * Verify Reset OTP
 */
export const verifyOTP = async (identifier, otp) => {
    const [rows] = await pool.query(
        'SELECT * FROM admin WHERE (email = ? OR phone = ?) AND reset_password_otp = ? AND reset_password_expires > NOW()',
        [identifier, identifier, otp]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update Password
 */
export const updatePassword = async (id, hashedPassword) => {
    await pool.query(
        'UPDATE admin SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?',
        [hashedPassword, id]
    );
};
