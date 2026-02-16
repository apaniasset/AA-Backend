import pool from '../config/db.js';

// --- Countries ---
export const findAllCountries = async () => {
    const [rows] = await pool.query('SELECT * FROM master_countries');
    return rows;
};

export const createCountry = async (data) => {
    const [result] = await pool.query('INSERT INTO master_countries SET ?', [data]);
    return result.insertId;
};

export const updateCountry = async (id, data) => {
    const [result] = await pool.query('UPDATE master_countries SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
};

export const deleteCountry = async (id) => {
    const [result] = await pool.query('DELETE FROM master_countries WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

// --- States ---
export const findAllStates = async () => {
    const [rows] = await pool.query('SELECT s.*, c.name as country_name FROM master_states s LEFT JOIN master_countries c ON s.country_id = c.id');
    return rows;
};

export const createState = async (data) => {
    const [result] = await pool.query('INSERT INTO master_states SET ?', [data]);
    return result.insertId;
};

export const updateState = async (id, data) => {
    const [result] = await pool.query('UPDATE master_states SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
};

export const deleteState = async (id) => {
    const [result] = await pool.query('DELETE FROM master_states WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

// --- Cities ---
export const findAllCities = async () => {
    const [rows] = await pool.query('SELECT c.*, s.state_name FROM master_cities c LEFT JOIN master_states s ON c.state_id = s.id');
    return rows;
};

export const createCity = async (data) => {
    const [result] = await pool.query('INSERT INTO master_cities SET ?', [data]);
    return result.insertId;
};

export const updateCity = async (id, data) => {
    const [result] = await pool.query('UPDATE master_cities SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
};

export const deleteCity = async (id) => {
    const [result] = await pool.query('DELETE FROM master_cities WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

// --- Areas ---
export const findAllAreas = async () => {
    const [rows] = await pool.query('SELECT a.*, c.city_name FROM master_areas a LEFT JOIN master_cities c ON a.city_id = c.id');
    return rows;
};

export const createArea = async (data) => {
    const [result] = await pool.query('INSERT INTO master_areas SET ?', [data]);
    return result.insertId;
};

export const updateArea = async (id, data) => {
    const [result] = await pool.query('UPDATE master_areas SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
};

export const deleteArea = async (id) => {
    const [result] = await pool.query('DELETE FROM master_areas WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
