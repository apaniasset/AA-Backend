import pool from '../config/db.js';

export const getAll = async (filters = {}) => {
    let query = 'SELECT id as country_id, id, name, short_name, country_code, is_active FROM master_countries WHERE 1=1';
    const params = [];

    if (filters.search_name) {
        query += ' AND (name LIKE ? OR short_name LIKE ? OR country_code LIKE ?)';
        const search = `%${filters.search_name}%`;
        params.push(search, search, search);
    }

    if (filters.is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.is_active);
    }

    query += ' ORDER BY name ASC';
    const [rows] = await pool.query(query, params);
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
