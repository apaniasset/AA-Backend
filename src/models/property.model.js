import pool from '../config/db.js';

/**
 * Get all properties with images and merchant info
 */
export const findAll = async (filters = {}) => {
    let query = `
        SELECT p.*, m.name as merchant_name, m.company_name
        FROM merchant_properties p
        LEFT JOIN merchant m ON p.merchant_id = m.id
        WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
        const search = `%${filters.search}%`;
        query += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.property_id LIKE ? OR p.city LIKE ? OR p.location LIKE ? OR p.address_line1 LIKE ? OR p.address_line2 LIKE ?)`;
        params.push(search, search, search, search, search, search, search);
    }

    if (filters.type) {
        if (filters.type === 'buy') {
            query += ' AND p.listing_type = "Sale"';
        } else if (filters.type === 'rent') {
            query += ' AND p.listing_type = "Rent"';
        }
    }

    if (filters.property_main_type) {
        query += ' AND p.property_main_type = ?';
        params.push(filters.property_main_type);
    }

    if (filters.merchant_id) {
        query += ' AND p.merchant_id = ?';
        params.push(filters.merchant_id);
    }

    if (filters.status) {
        query += ' AND p.status = ?';
        params.push(filters.status);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(query, params);

    // Fetch images for each property
    for (let row of rows) {
        const [images] = await pool.query('SELECT * FROM property_media WHERE property_id = ?', [row.id]);
        row.images = images;
    }

    return rows;
};

/**
 * Find property by ID
 */
export const findById = async (id) => {
    const [rows] = await pool.query(
        'SELECT p.*, m.name as merchant_name, m.company_name FROM merchant_properties p LEFT JOIN merchant m ON p.merchant_id = m.id WHERE p.id = ? LIMIT 1',
        [id]
    );
    if (rows.length === 0) return null;

    const property = rows[0];
    const [images] = await pool.query('SELECT * FROM property_media WHERE property_id = ?', [property.id]);
    property.images = images;

    return property;
};

/**
 * Create property
 */
export const create = async (data) => {
    const [result] = await pool.query('INSERT INTO merchant_properties SET ?', [data]);
    return result.insertId;
};

/**
 * Update property
 */
export const update = async (id, data) => {
    const [result] = await pool.query('UPDATE merchant_properties SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
};

/**
 * Delete property
 */
export const remove = async (id) => {
    // Delete media first
    await pool.query('DELETE FROM property_media WHERE property_id = ?', [id]);
    const [result] = await pool.query('DELETE FROM merchant_properties WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

/**
 * Add media
 */
export const addMedia = async (data) => {
    const [result] = await pool.query('INSERT INTO property_media SET ?', [data]);
    return result.insertId;
};

/**
 * Delete media
 */
export const deleteMedia = async (mediaId) => {
    await pool.query('DELETE FROM property_media WHERE id = ?', [mediaId]);
};

/**
 * Generate unique Property ID (AA-XXXXX)
 */
export const generateUniqueId = async () => {
    let propertyId;
    let exists = true;
    while (exists) {
        propertyId = 'AA-' + Math.floor(100000000 + Math.random() * 900000000);
        const [rows] = await pool.query('SELECT id FROM merchant_properties WHERE property_id = ?', [propertyId]);
        exists = rows.length > 0;
    }
    return propertyId;
};
