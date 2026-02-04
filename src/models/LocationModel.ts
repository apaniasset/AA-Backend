import pool from '../config/db.js';

export class LocationModel {
    // --- Countries ---
    static async findAllCountries() {
        const [rows]: any = await pool.query('SELECT * FROM master_countries');
        return rows;
    }

    static async createCountry(data: any) {
        const [result]: any = await pool.query('INSERT INTO master_countries SET ?', [data]);
        return result.insertId;
    }

    static async updateCountry(id: number, data: any) {
        const [result]: any = await pool.query('UPDATE master_countries SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }

    static async deleteCountry(id: number) {
        const [result]: any = await pool.query('DELETE FROM master_countries WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- States ---
    static async findAllStates() {
        const [rows]: any = await pool.query('SELECT s.*, c.name as country_name FROM master_states s LEFT JOIN master_countries c ON s.country_id = c.id');
        return rows;
    }

    static async createState(data: any) {
        const [result]: any = await pool.query('INSERT INTO master_states SET ?', [data]);
        return result.insertId;
    }

    static async updateState(id: number, data: any) {
        const [result]: any = await pool.query('UPDATE master_states SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }

    static async deleteState(id: number) {
        const [result]: any = await pool.query('DELETE FROM master_states WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- Cities ---
    static async findAllCities() {
        const [rows]: any = await pool.query('SELECT c.*, s.state_name FROM master_cities c LEFT JOIN master_states s ON c.state_id = s.id');
        return rows;
    }

    static async createCity(data: any) {
        const [result]: any = await pool.query('INSERT INTO master_cities SET ?', [data]);
        return result.insertId;
    }

    static async updateCity(id: number, data: any) {
        const [result]: any = await pool.query('UPDATE master_cities SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }

    static async deleteCity(id: number) {
        const [result]: any = await pool.query('DELETE FROM master_cities WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- Areas ---
    static async findAllAreas() {
        const [rows]: any = await pool.query('SELECT a.*, c.city_name FROM master_areas a LEFT JOIN master_cities c ON a.city_id = c.id');
        return rows;
    }

    static async createArea(data: any) {
        const [result]: any = await pool.query('INSERT INTO master_areas SET ?', [data]);
        return result.insertId;
    }

    static async updateArea(id: number, data: any) {
        const [result]: any = await pool.query('UPDATE master_areas SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }

    static async deleteArea(id: number) {
        const [result]: any = await pool.query('DELETE FROM master_areas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
