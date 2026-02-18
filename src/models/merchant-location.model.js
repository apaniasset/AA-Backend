import pool from '../config/db.js';

/**
 * Get all working locations for a merchant
 */
export const findByMerchantId = async (merchantId) => {
    const [rows] = await pool.query(
        'SELECT * FROM merchant_working_locations WHERE merchant_id = ? ORDER BY created_at DESC',
        [merchantId]
    );
    return rows;
};

/**
 * Add a new working location
 */
export const create = async (data) => {
    const [result] = await pool.query('INSERT INTO merchant_working_locations SET ?', [data]);
    return result.insertId;
};

/**
 * Update a working location
 */
export const update = async (id, merchantId, data) => {
    const [result] = await pool.query(
        'UPDATE merchant_working_locations SET ? WHERE id = ? AND merchant_id = ?',
        [data, id, merchantId]
    );
    return result.affectedRows > 0;
};

/**
 * Delete a working location
 */
export const remove = async (id, merchantId) => {
    const [result] = await pool.query(
        'DELETE FROM merchant_working_locations WHERE id = ? AND merchant_id = ?',
        [id, merchantId]
    );
    return result.affectedRows > 0;
};

/**
 * Find location by ID and Merchant ID
 */
export const findById = async (id, merchantId) => {
    const [rows] = await pool.query(
        'SELECT * FROM merchant_working_locations WHERE id = ? AND merchant_id = ? LIMIT 1',
        [id, merchantId]
    );
    return rows.length > 0 ? rows[0] : null;
};
