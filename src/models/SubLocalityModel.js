import pool from '../config/db.js';

export class SubLocalityModel {
    static async findAll() {
        const [rows] = await pool.query('SELECT sl.*, l.name as locality_name FROM sub_localities sl JOIN localities l ON sl.locality_id = l.id ORDER BY sl.name ASC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM sub_localities WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async create(data) {
        const [result] = await pool.query('INSERT INTO sub_localities SET ?', [data]);
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query('UPDATE sub_localities SET ? WHERE id = ?', [data, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM sub_localities WHERE id = ?', [id]);
    }
}
