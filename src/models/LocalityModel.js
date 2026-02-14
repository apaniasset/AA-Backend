import pool from '../config/db.js';

export class LocalityModel {
    static async findAll() {
        const [rows] = await pool.query('SELECT l.*, ci.name as city_name FROM localities l JOIN cities ci ON l.city_id = ci.id ORDER BY l.name ASC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM localities WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async create(data) {
        const [result] = await pool.query('INSERT INTO localities SET ?', [data]);
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query('UPDATE localities SET ? WHERE id = ?', [data, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM localities WHERE id = ?', [id]);
    }
}
