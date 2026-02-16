import pool from '../config/db.js';

/**
 * Find all affiliates
 */
export const findAll = async () => {
    const [rows] = await pool.query(`
        SELECT a1.*, a2.referral_code as referrer_code 
        FROM affiliate a1 
        LEFT JOIN affiliate a2 ON a1.referred_by = a2.id 
        ORDER BY a1.id DESC
    `);
    return rows;
};

/**
 * Find affiliate by email or phone
 */
export const findByEmailOrPhone = async (identifier) => {
    const [rows] = await pool.query(`
        SELECT a1.*, a2.referral_code as referrer_code 
        FROM affiliate a1 
        LEFT JOIN affiliate a2 ON a1.referred_by = a2.id 
        WHERE a1.email = ? OR a1.phone = ? 
        LIMIT 1
    `, [identifier, identifier]);
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Find affiliate by referral code
 */
export const findByReferralCode = async (code) => {
    const [rows] = await pool.query(`
        SELECT a1.*, a2.referral_code as referrer_code 
        FROM affiliate a1 
        LEFT JOIN affiliate a2 ON a1.referred_by = a2.id 
        WHERE a1.referral_code = ? 
        LIMIT 1
    `, [code]);
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Find affiliate by phone
 */
export const findByPhone = async (phone) => {
    const [rows] = await pool.query(`
        SELECT a1.*, a2.referral_code as referrer_code 
        FROM affiliate a1 
        LEFT JOIN affiliate a2 ON a1.referred_by = a2.id 
        WHERE a1.phone = ? 
        LIMIT 1
    `, [phone]);
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Create new affiliate (Laravel Parity)
 */
export const create = async (data) => {
    const referral_code = data.referral_code || Math.random().toString(36).substring(2, 12).toUpperCase();
    const finalData = {
        ...data,
        referral_code: referral_code,
        status: data.status || 'active'
    };
    const [result] = await pool.query('INSERT INTO affiliate SET ?', [finalData]);
    return result.insertId;
};

/**
 * Find affiliate by ID
 */
export const findById = async (id) => {
    const [rows] = await pool.query(`
        SELECT a1.*, a2.referral_code as referrer_code 
        FROM affiliate a1 
        LEFT JOIN affiliate a2 ON a1.referred_by = a2.id 
        WHERE a1.id = ? 
        LIMIT 1
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update affiliate
 */
export const update = async (id, data) => {
    const [result] = await pool.query('UPDATE affiliate SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
};

/**
 * Update last login time
 */
export const updateLastLogin = async (id) => {
    await pool.query(
        'UPDATE affiliate SET last_login = NOW() WHERE id = ?',
        [id]
    );
};

/**
 * Store Reset OTP
 */
export const storeResetOTP = async (id, otp) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await pool.query(
        'UPDATE affiliate SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?',
        [otp, expires, id]
    );
};

/**
 * Verify OTP
 */
export const verifyOTP = async (identifier, otp) => {
    const [rows] = await pool.query(
        'SELECT * FROM affiliate WHERE (email = ? OR phone = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1',
        [identifier, identifier, otp]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update Password
 */
export const updatePassword = async (id, hashedPassword) => {
    await pool.query(
        'UPDATE affiliate SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?',
        [hashedPassword, id]
    );
};

/**
 * Store Registration OTP
 */
export const storeRegistrationOTP = async (phone, otp) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    const affiliate = await findByPhone(phone);

    if (affiliate) {
        await pool.query(
            'UPDATE affiliate SET registration_otp = ?, registration_otp_expires = ? WHERE id = ?',
            [otp, expires, affiliate.id]
        );
        return affiliate.id;
    } else {
        const referral_code = Math.random().toString(36).substring(2, 12).toUpperCase();
        const [result] = await pool.query(
            'INSERT INTO affiliate (phone, registration_otp, registration_otp_expires, status, referral_code) VALUES (?, ?, ?, ?, ?)',
            [phone, otp, expires, 'pending_registration', referral_code]
        );
        return result.insertId;
    }
};

/**
 * Verify Registration OTP
 */
export const verifyRegistrationOTP = async (phone, otp) => {
    const [rows] = await pool.query(
        'SELECT * FROM affiliate WHERE phone = ? AND registration_otp = ? AND registration_otp_expires > NOW() LIMIT 1',
        [phone, otp]
    );
    return rows.length > 0 ? rows[0] : null;
};
