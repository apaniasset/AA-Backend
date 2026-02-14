import pool from '../config/db.js';

export class CityModel {
    static async findAll() {
        const [rows] = await pool.query('SELECT ci.*, s.name as state_name FROM cities ci JOIN states s ON ci.state_id = s.id ORDER BY ci.name ASC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM cities WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async create(data) {
        const [result] = await pool.query('INSERT INTO cities SET ?', [data]);
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query('UPDATE cities SET ? WHERE id = ?', [data, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM cities WHERE id = ?', [id]);
    }
}
