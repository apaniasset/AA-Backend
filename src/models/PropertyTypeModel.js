import pool from '../config/db.js';

export class PropertyTypeModel {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM property_types ORDER BY name ASC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM property_types WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async create(data) {
        const [result] = await pool.query('INSERT INTO property_types SET ?', [data]);
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query('UPDATE property_types SET ? WHERE id = ?', [data, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM property_types WHERE id = ?', [id]);
    }
}
