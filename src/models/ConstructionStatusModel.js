import pool from '../config/db.js';

export class ConstructionStatusModel {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM construction_statuses ORDER BY name ASC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM construction_statuses WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async create(data) {
        const [result] = await pool.query('INSERT INTO construction_statuses SET ?', [data]);
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query('UPDATE construction_statuses SET ? WHERE id = ?', [data, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM construction_statuses WHERE id = ?', [id]);
    }
}
