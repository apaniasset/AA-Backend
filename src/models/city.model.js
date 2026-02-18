import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT id as city_id, id, state_id, city_name, is_active FROM master_cities ORDER BY city_name ASC');
    return rows;
};

export const getByStateId = async (stateId) => {
    const [rows] = await pool.query('SELECT id as city_id, id, state_id, city_name, is_active FROM master_cities WHERE state_id = ? ORDER BY city_name ASC', [stateId]);
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
