import pool from '../config/db.js';

export const getAll = async (filters = {}) => {
    let query = 'SELECT id as city_id, id, state_id, city_name, is_active FROM master_cities WHERE 1=1';
    const params = [];

    if (filters.search_name) {
        query += ' AND city_name LIKE ?';
        params.push(`%${filters.search_name}%`);
    }

    if (filters.is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.is_active);
    }

    query += ' ORDER BY city_name ASC';
    const [rows] = await pool.query(query, params);
    return rows;
};

export const getByStateId = async (stateId, filters = {}) => {
    let query = 'SELECT id as city_id, id, state_id, city_name, is_active FROM master_cities WHERE state_id = ?';
    const params = [stateId];

    if (filters.search_name) {
        query += ' AND city_name LIKE ?';
        params.push(`%${filters.search_name}%`);
    }

    if (filters.is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.is_active);
    }

    query += ' ORDER BY city_name ASC';
    const [rows] = await pool.query(query, params);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT id as city_id, id, state_id, city_name, is_active FROM master_cities WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { city_name, state_id } = data;
    const [result] = await pool.query(
        'INSERT INTO master_cities (city_name, state_id, is_active) VALUES (?, ?, 1)',
        [city_name, state_id]
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { city_name, state_id, is_active } = data;
    await pool.query(
        'UPDATE master_cities SET city_name = ?, state_id = ?, is_active = ? WHERE id = ?',
        [city_name, state_id, is_active ?? 1, id]
    );
};

export const destroy = async (id) => {
    await pool.query('DELETE FROM master_cities WHERE id = ?', [id]);
};
