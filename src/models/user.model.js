import pool from '../config/db.js';

/**
 * Find user by email or mobile (Identifier)
 */
export const findByEmailOrMobile = async (identifier) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1',
        [identifier, identifier]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Find user by phone only
 */
export const findByPhone = async (phone) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE phone = ? LIMIT 1',
        [phone]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Create new user
 */
export const create = async (data) => {
    const [result] = await pool.query('INSERT INTO users SET ?', [data]);
    return result.insertId;
};

/**
 * Get all users
 */
export const findAll = async () => {
    const [rows] = await pool.query('SELECT id, name, email, phone, role, created_at FROM users');
    return rows;
};

/**
 * Find user by ID
 */
export const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update user
 */
export const update = async (id, data) => {
    const [result] = await pool.query('UPDATE users SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
};

/**
 * Delete user
 */
export const remove = async (id) => {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

/**
 * Update last login time
 */
export const updateLastLogin = async (id) => {
    await pool.query(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [id]
    );
};

/**
 * Store Reset OTP (For Forgot Password)
 */
export const storeResetOTP = async (id, otp) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await pool.query(
        'UPDATE users SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?',
        [otp, expires, id]
    );
};

/**
 * Verify Reset OTP
 */
export const verifyOTP = async (identifier, otp) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE (email = ? OR phone = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1',
        [identifier, identifier, otp]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update Password
 */
export const updatePassword = async (id, hashedPassword) => {
    await pool.query(
        'UPDATE users SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?',
        [hashedPassword, id]
    );
};

/**
 * Store Login OTP (For OTP Login)
 */
export const storeLoginOTP = async (id, otp) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await pool.query(
        'UPDATE users SET login_otp = ?, login_otp_expires = ? WHERE id = ?',
        [otp, expires, id]
    );
};

/**
 * Verify login OTP
 */
export const verifyLoginOTP = async (identifier, otp) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE (email = ? OR phone = ?) AND login_otp = ? AND login_otp_expires > NOW() LIMIT 1',
        [identifier, identifier, otp]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Store Registration OTP
 */
export const storeRegistrationOTP = async (phone, otp) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Check if pending user exists
    const user = await findByPhone(phone);
    if (user) {
        await pool.query(
            'UPDATE users SET registration_otp = ?, registration_otp_expires = ? WHERE id = ?',
            [otp, expires, user.id]
        );
        return user.id;
    } else {
        const [result] = await pool.query(
            'INSERT INTO users (phone, registration_otp, registration_otp_expires, status) VALUES (?, ?, ?, ?)',
            [phone, otp, expires, 'pending_registration']
        );
        return result.insertId;
    }
};

/**
 * Verify Registration OTP
 */
export const verifyRegistrationOTP = async (phone, otp) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE phone = ? AND registration_otp = ? AND registration_otp_expires > NOW() LIMIT 1',
        [phone, otp]
    );
    return rows.length > 0 ? rows[0] : null;
};
