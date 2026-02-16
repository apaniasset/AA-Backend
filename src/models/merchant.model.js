import pool from '../config/db.js';

/**
 * Find all merchants
 */
export const findAll = async () => {
    const [rows] = await pool.query(`
        SELECT m.*, a.referral_code as referrer_code 
        FROM merchant m 
        LEFT JOIN affiliate a ON m.affiliate_id = a.id 
        ORDER BY m.id DESC
    `);
    return rows;
};

/**
 * Find merchant by email or phone
 */
export const findByEmailOrPhone = async (identifier) => {
    const [rows] = await pool.query(`
        SELECT m.*, a.referral_code as referrer_code 
        FROM merchant m 
        LEFT JOIN affiliate a ON m.affiliate_id = a.id 
        WHERE m.email = ? OR m.phone = ? 
        LIMIT 1
    `, [identifier, identifier]);
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Find merchant by phone
 */
export const findByPhone = async (phone) => {
    const [rows] = await pool.query(`
        SELECT m.*, a.referral_code as referrer_code 
        FROM merchant m 
        LEFT JOIN affiliate a ON m.affiliate_id = a.id 
        WHERE m.phone = ? 
        LIMIT 1
    `, [phone]);
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Find merchant by ID
 */
export const findById = async (id) => {
    const [rows] = await pool.query(`
        SELECT m.*, a.referral_code as referrer_code 
        FROM merchant m 
        LEFT JOIN affiliate a ON m.affiliate_id = a.id 
        WHERE m.id = ? 
        LIMIT 1
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Create new merchant (Laravel Parity)
 */
export const create = async (data) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        // Default merchant type to 'owner' if not provided (matching Laravel)
        const merchantData = {
            ...data,
            merchant_type: data.merchant_type || 'owner'
        };

        const [result] = await connection.query('INSERT INTO merchant SET ?', [merchantData]);
        const merchantId = result.insertId;

        // Award 1 free credit (matching Laravel)
        const creditData = {
            merchant_id: merchantId,
            credits: 1,
            source: 'free_signup',
            used_credits: 0
        };
        await connection.query('INSERT INTO merchant_credits SET ?', [creditData]);

        await connection.commit();
        return merchantId;
    } catch (e) {
        await connection.rollback();
        throw e;
    } finally {
        connection.release();
    }
};

/**
 * Update merchant
 */
export const update = async (id, data) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        const [result] = await connection.query('UPDATE merchant SET ? WHERE id = ?', [data, id]);

        // If this is a registration completion, award credits if not already awarded
        if (data.status === 'active') {
            const [credits] = await connection.query('SELECT * FROM merchant_credits WHERE merchant_id = ? AND source = "free_signup"', [id]);
            if (credits.length === 0) {
                await connection.query('INSERT INTO merchant_credits SET ?', [{
                    merchant_id: id,
                    credits: 1,
                    source: 'free_signup',
                    used_credits: 0
                }]);
            }
        }

        await connection.commit();
        return result.affectedRows > 0;
    } catch (e) {
        await connection.rollback();
        throw e;
    } finally {
        connection.release();
    }
};

/**
 * Delete merchant
 */
export const remove = async (id) => {
    const [result] = await pool.query('DELETE FROM merchant WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

/**
 * Update last login timestamp
 */
export const updateLastLogin = async (id) => {
    await pool.query(
        'UPDATE merchant SET last_login = NOW() WHERE id = ?',
        [id]
    );
};

/**
 * Store Reset OTP
 */
export const storeResetOTP = async (id, otp) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await pool.query(
        'UPDATE merchant SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?',
        [otp, expires, id]
    );
};

/**
 * Verify OTP
 */
export const verifyOTP = async (identifier, otp) => {
    const [rows] = await pool.query(
        'SELECT * FROM merchant WHERE (email = ? OR phone = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1',
        [identifier, identifier, otp]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Store login OTP
 */
export const storeLoginOTP = async (id, otp) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await pool.query(
        'UPDATE merchant SET login_otp = ?, login_otp_expires = ? WHERE id = ?',
        [otp, expires, id]
    );
};

/**
 * Verify login OTP
 */
export const verifyLoginOTP = async (identifier, otp) => {
    const [rows] = await pool.query(
        'SELECT * FROM merchant WHERE (email = ? OR phone = ?) AND login_otp = ? AND login_otp_expires > NOW() LIMIT 1',
        [identifier, identifier, otp]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update Password
 */
export const updatePassword = async (id, hashedPassword) => {
    await pool.query(
        'UPDATE merchant SET password = ?, reset_password_otp = NULL, reset_password_expires = NULL WHERE id = ?',
        [hashedPassword, id]
    );
};

/**
 * Store Registration OTP
 */
export const storeRegistrationOTP = async (phone, otp) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const merchant = await findByPhone(phone);
    if (merchant) {
        await pool.query(
            'UPDATE merchant SET registration_otp = ?, registration_otp_expires = ? WHERE id = ?',
            [otp, expires, merchant.id]
        );
        return merchant.id;
    } else {
        const [result] = await pool.query(
            'INSERT INTO merchant (phone, registration_otp, registration_otp_expires, status, merchant_type) VALUES (?, ?, ?, ?, ?)',
            [phone, otp, expires, 'pending_registration', 'owner']
        );
        return result.insertId;
    }
};

/**
 * Verify Registration OTP
 */
export const verifyRegistrationOTP = async (phone, otp) => {
    const [rows] = await pool.query(
        'SELECT * FROM merchant WHERE phone = ? AND registration_otp = ? AND registration_otp_expires > NOW() LIMIT 1',
        [phone, otp]
    );
    return rows.length > 0 ? rows[0] : null;
};
