import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM countries ORDER BY name ASC');
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM countries WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { name, code, phonecode, status } = data;
    const [result] = await pool.query(
        'INSERT INTO countries (name, code, phonecode, status) VALUES (?, ?, ?, ?)',
        [name, code, phonecode, status || 'active']
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { name, code, phonecode, status } = data;
    await pool.query(
        'UPDATE countries SET name = ?, code = ?, phonecode = ?, status = ? WHERE id = ?',
        [name, code, phonecode, status, id]
    );
};

export const destroy = async (id) => {
    await pool.query('DELETE FROM countries WHERE id = ?', [id]);
};
