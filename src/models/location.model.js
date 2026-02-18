import pool from '../config/db.js';

export const getAll = async (filters = {}) => {
    let query = 'SELECT id as locality_id, id, city_id, area_name, pincode, is_active FROM master_areas WHERE 1=1';
    const params = [];

    if (filters.search_name) {
        query += ' AND (area_name LIKE ? OR pincode LIKE ?)';
        const search = `%${filters.search_name}%`;
        params.push(search, search);
    }

    if (filters.is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.is_active);
    }

    query += ' ORDER BY area_name ASC';
    const [rows] = await pool.query(query, params);
    return rows;
};

export const getByCityId = async (cityId, filters = {}) => {
    let query = 'SELECT id as locality_id, id, city_id, area_name, pincode, is_active FROM master_areas WHERE city_id = ?';
    const params = [cityId];

    if (filters.search_name) {
        query += ' AND (area_name LIKE ? OR pincode LIKE ?)';
        const search = `%${filters.search_name}%`;
        params.push(search, search);
    }

    if (filters.is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.is_active);
    }

    query += ' ORDER BY area_name ASC';
    const [rows] = await pool.query(query, params);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT id as locality_id, id, city_id, area_name, pincode, is_active FROM master_areas WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { area_name, city_id, pincode } = data;
    const [result] = await pool.query(
        'INSERT INTO master_areas (area_name, city_id, pincode, is_active) VALUES (?, ?, ?, 1)',
        [area_name, city_id, pincode || null]
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { area_name, city_id, pincode, is_active } = data;
    await pool.query(
        'UPDATE master_areas SET area_name = ?, city_id = ?, pincode = ?, is_active = ? WHERE id = ?',
        [area_name, city_id, pincode, is_active ?? 1, id]
    );
};

export const destroy = async (id) => {
    await pool.query('DELETE FROM master_areas WHERE id = ?', [id]);
};
