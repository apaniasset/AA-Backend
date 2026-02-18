import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM locations ORDER BY name ASC');
    return rows;
};

export const getByCityId = async (cityId) => {
    const [rows] = await pool.query('SELECT * FROM locations WHERE city_id = ? ORDER BY name ASC', [cityId]);
    return rows;
};

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { name, city_id, status } = data;
    const [result] = await pool.query(
        'INSERT INTO locations (name, city_id, status) VALUES (?, ?, ?)',
        [name, city_id, status || 'active']
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { name, city_id, status } = data;
    await pool.query(
        'UPDATE locations SET name = ?, city_id = ?, status = ? WHERE id = ?',
        [name, city_id, status, id]
    );
};

export const destroy = async (id) => {
    await pool.query('DELETE FROM locations WHERE id = ?', [id]);
};
