import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT id as country_id, id, name, short_name, country_code, is_active FROM master_countries ORDER BY name ASC');
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT id as country_id, id, name, short_name, country_code, is_active FROM master_countries WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { name, short_name, country_code } = data;
    const [result] = await pool.query(
        'INSERT INTO master_countries (name, short_name, country_code, is_active) VALUES (?, ?, ?, 1)',
        [name, short_name || null, country_code || null]
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { name, short_name, country_code, is_active } = data;
    await pool.query(
        'UPDATE master_countries SET name = ?, short_name = ?, country_code = ?, is_active = ? WHERE id = ?',
        [name, short_name, country_code, is_active ?? 1, id]
    );
};

export const destroy = async (id) => {
    await pool.query('DELETE FROM master_countries WHERE id = ?', [id]);
};
