import pool from '../config/db.js';

export const getAll = async (filters = {}) => {
    let query = 'SELECT id as state_id, id, country_id, state_name, state_type, is_active FROM master_states WHERE 1=1';
    const params = [];

    if (filters.search_name) {
        query += ' AND state_name LIKE ?';
        params.push(`%${filters.search_name}%`);
    }

    if (filters.is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.is_active);
    }

    query += ' ORDER BY state_name ASC';
    const [rows] = await pool.query(query, params);
    return rows;
};

export const getByCountryId = async (countryId, filters = {}) => {
    let query = 'SELECT id as state_id, id, country_id, state_name, state_type, is_active FROM master_states WHERE country_id = ?';
    const params = [countryId];

    if (filters.search_name) {
        query += ' AND state_name LIKE ?';
        params.push(`%${filters.search_name}%`);
    }

    if (filters.is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.is_active);
    }

    query += ' ORDER BY state_name ASC';
    const [rows] = await pool.query(query, params);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT id as state_id, id, country_id, state_name, state_type, is_active FROM master_states WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { state_name, country_id, state_type } = data;
    const [result] = await pool.query(
        'INSERT INTO master_states (state_name, country_id, state_type, is_active) VALUES (?, ?, ?, 1)',
        [state_name, country_id, state_type || 'State']
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { state_name, country_id, state_type, is_active } = data;
    await pool.query(
        'UPDATE master_states SET state_name = ?, country_id = ?, state_type = ?, is_active = ? WHERE id = ?',
        [state_name, country_id, state_type, is_active ?? 1, id]
    );
};

export const destroy = async (id) => {
    await pool.query('DELETE FROM master_states WHERE id = ?', [id]);
};
