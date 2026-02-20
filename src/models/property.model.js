import pool from '../config/db.js';

/**
 * Get all properties with images and owner info
 */
export const findAll = async (filters = {}) => {
    const hasValue = (val) => val !== undefined && val !== null && val !== '';

    let query = `
        SELECT p.*, 
        CASE 
            WHEN p.merchant_id IS NOT NULL THEN m.name 
            WHEN p.user_id IS NOT NULL THEN u.name 
            ELSE 'Admin'
        END as owner_name,
        CASE 
            WHEN p.merchant_id IS NOT NULL THEN m.company_name 
            ELSE NULL 
        END as company_name,
        c.city_name,
        s.state_name,
        co.name as country_name,
        a.area_name as locality_name
        FROM merchant_properties p
        LEFT JOIN merchant m ON p.merchant_id = m.id
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN master_cities c ON p.city_id = c.id
        LEFT JOIN master_states s ON p.state_id = s.id
        LEFT JOIN master_countries co ON p.country_id = co.id
        LEFT JOIN master_areas a ON p.locality_id = a.id
        WHERE 1=1
    `;
    const params = [];

    // Filter by ownership (My Deals)
    if (filters.my_deals) {
        if (filters.user_id) {
            query += ' AND p.user_id = ?';
            params.push(filters.user_id);
        } else if (filters.merchant_id) {
            query += ' AND p.merchant_id = ?';
            params.push(filters.merchant_id);
        } else if (filters.admin_id) {
            query += ' AND p.admin_id = ?';
            params.push(filters.admin_id);
        }
    } else {
        // Public view: only active unless status is explicitly requested
        if (hasValue(filters.status)) {
            query += ' AND p.status = ?';
            params.push(filters.status);
        } else {
            query += ' AND p.status = "active"';
        }

        if (hasValue(filters.merchant_id)) {
            query += ' AND p.merchant_id = ?';
            params.push(filters.merchant_id);
        }

        if (hasValue(filters.user_id)) {
            query += ' AND p.user_id = ?';
            params.push(filters.user_id);
        }
    }

    // Search
    if (hasValue(filters.search) || hasValue(filters.search_name)) {
        const search = `%${filters.search || filters.search_name}%`;
        query += ` AND (
            p.title LIKE ? OR 
            p.description LIKE ? OR 
            p.property_id LIKE ? OR 
            c.city_name LIKE ? OR 
            s.state_name LIKE ? OR 
            co.name LIKE ? OR 
            a.area_name LIKE ? OR 
            p.location LIKE ? OR 
            p.address_line1 LIKE ?
        )`;
        params.push(search, search, search, search, search, search, search, search, search);
    }

    // type: buy / rent (shorthand)
    if (hasValue(filters.type)) {
        if (filters.type === 'buy') {
            query += ' AND p.listing_type = "Sale"';
        } else if (filters.type === 'rent') {
            query += ' AND p.listing_type = "Rent"';
        }
    }

    // Direct listing_type filter (Sale / Rent / Lease)
    if (hasValue(filters.listing_type)) {
        query += ' AND p.listing_type = ?';
        params.push(filters.listing_type);
    }

    // Property main type (Apartment/Flat, Villa, etc.)
    if (hasValue(filters.property_main_type)) {
        query += ' AND p.property_main_type = ?';
        params.push(filters.property_main_type);
    }

    // Property segment (Residential / Commercial / Agricultural)
    if (hasValue(filters.property_segment)) {
        query += ' AND p.property_segment = ?';
        params.push(filters.property_segment);
    }

    // City
    if (hasValue(filters.city)) {
        query += ' AND p.city = ?';
        params.push(filters.city);
    }

    // City ID
    if (hasValue(filters.city_id)) {
        query += ' AND p.city_id = ?';
        params.push(filters.city_id);
    }

    // Bedrooms
    if (hasValue(filters.bedrooms)) {
        query += ' AND p.bedrooms = ?';
        params.push(filters.bedrooms);
    }

    // Price range
    if (hasValue(filters.min_price)) {
        query += ' AND p.sale_price >= ?';
        params.push(filters.min_price);
    }
    if (hasValue(filters.max_price)) {
        query += ' AND p.sale_price <= ?';
        params.push(filters.max_price);
    }

    // Furnishing status (furnished / unfurnished / semi-furnished)
    if (hasValue(filters.furnishing_status)) {
        query += ' AND p.furnishing_status = ?';
        params.push(filters.furnishing_status);
    }

    // Possession status (ready_to_move / under_construction)
    if (hasValue(filters.possession_status)) {
        query += ' AND p.possession_status = ?';
        params.push(filters.possession_status);
    }

    // Featured properties
    if (hasValue(filters.featured)) {
        query += ' AND p.featured = ?';
        params.push(filters.featured);
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
    const [rows] = await pool.query(`
        SELECT p.*, 
        CASE 
            WHEN p.merchant_id IS NOT NULL THEN m.name 
            WHEN p.user_id IS NOT NULL THEN u.name 
            ELSE 'Admin'
        END as owner_name,
        CASE 
            WHEN p.merchant_id IS NOT NULL THEN m.company_name 
            ELSE NULL 
        END as company_name,
        c.city_name,
        s.state_name,
        co.name as country_name,
        a.area_name as locality_name
        FROM merchant_properties p 
        LEFT JOIN merchant m ON p.merchant_id = m.id
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN master_cities c ON p.city_id = c.id
        LEFT JOIN master_states s ON p.state_id = s.id
        LEFT JOIN master_countries co ON p.country_id = co.id
        LEFT JOIN master_areas a ON p.locality_id = a.id
        WHERE p.id = ? 
        LIMIT 1
    `, [id]);
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
