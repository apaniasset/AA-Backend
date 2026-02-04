import pool from './config/db.js';
async function listTables() {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        rows.forEach((row) => {
            console.log(Object.values(row)[0]);
        });
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listTables();
