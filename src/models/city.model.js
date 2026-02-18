import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM cities ORDER BY name ASC');
    return rows;
};

export const getByStateId = async (stateId) => {
    const [rows] = await pool.query('SELECT * FROM cities WHERE state_id = ? ORDER BY name ASC', [stateId]);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM cities WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { name, state_id, status } = data;
    const [result] = await pool.query(
        'INSERT INTO cities (name, state_id, status) VALUES (?, ?, ?)',
        [name, state_id, status || 'active']
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { name, state_id, status } = data;
    await pool.query(
        'UPDATE cities SET name = ?, state_id = ?, status = ? WHERE id = ?',
        [name, state_id, status, id]
    );
};

export const destroy = async (id) => {
    await pool.query('DELETE FROM cities WHERE id = ?', [id]);
};
