import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT id as locality_id, id, city_id, area_name, pincode, is_active FROM master_areas ORDER BY area_name ASC');
    return rows;
};

export const getByCityId = async (cityId) => {
    const [rows] = await pool.query('SELECT id as locality_id, id, city_id, area_name, pincode, is_active FROM master_areas WHERE city_id = ? ORDER BY area_name ASC', [cityId]);
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
