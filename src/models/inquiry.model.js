import pool from '../config/db.js';

/**
 * Create inquiry
 */
export const create = async (data) => {
    const [result] = await pool.query('INSERT INTO merchant_property_inquiries SET ?', [data]);
    return result.insertId;
};

/**
 * Log property view
 */
export const logView = async (data) => {
    const [result] = await pool.query('INSERT INTO merchant_property_views SET ?', [data]);
    return result.insertId;
};

/**
 * Get inquiries for a merchant
 */
export const findByMerchant = async (merchantId) => {
    const [rows] = await pool.query(
        'SELECT i.*, p.title as property_title FROM merchant_property_inquiries i JOIN merchant_properties p ON i.property_id = p.id WHERE i.merchant_id = ? ORDER BY i.created_at DESC',
        [merchantId]
    );
    return rows;
};
