import pool from '../config/db.js';

export class StateModel {
    static async findAll() {
        const [rows] = await pool.query('SELECT s.*, c.name as country_name FROM states s JOIN countries c ON s.country_id = c.id ORDER BY s.name ASC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM states WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async create(data) {
        const [result] = await pool.query('INSERT INTO states SET ?', [data]);
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query('UPDATE states SET ? WHERE id = ?', [data, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM states WHERE id = ?', [id]);
    }
}
