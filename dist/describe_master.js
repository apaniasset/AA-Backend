import pool from './config/db.js';
async function describeMasterTables() {
    const tables = ['master_countries', 'master_states', 'master_cities', 'master_areas'];
    for (const table of tables) {
        try {
            const [rows] = await pool.query(`DESCRIBE ${table}`);
            console.log(`--- ${table} ---`);
            console.log(JSON.stringify(rows, null, 2));
        }
        catch (err) {
            console.error(`Error describing ${table}:`, err.message);
        }
    }
    process.exit(0);
}
describeMasterTables();
