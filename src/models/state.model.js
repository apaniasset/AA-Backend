import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM states ORDER BY name ASC');
    return rows;
};

export const getByCountryId = async (countryId) => {
    const [rows] = await pool.query('SELECT * FROM states WHERE country_id = ? ORDER BY name ASC', [countryId]);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM states WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { name, country_id, status } = data;
    const [result] = await pool.query(
        'INSERT INTO states (name, country_id, status) VALUES (?, ?, ?)',
        [name, country_id, status || 'active']
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { name, country_id, status } = data;
    await pool.query(
        'UPDATE states SET name = ?, country_id = ?, status = ? WHERE id = ?',
        [name, country_id, status, id]
    );
};

export const destroy = async (id) => {
    await pool.query('DELETE FROM states WHERE id = ?', [id]);
};
