import pool from '../config/db.js';

export class FurnishingStatusModel {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM furnishing_statuses ORDER BY name ASC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM furnishing_statuses WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async create(data) {
        const [result] = await pool.query('INSERT INTO furnishing_statuses SET ?', [data]);
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query('UPDATE furnishing_statuses SET ? WHERE id = ?', [data, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM furnishing_statuses WHERE id = ?', [id]);
    }
}
