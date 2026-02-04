import pool from './config/db.js';

async function listTables() {
    try {
        const [rows]: any = await pool.query('SHOW TABLES');
        rows.forEach((row: any) => {
            console.log(Object.values(row)[0]);
        });
        process.exit(0);
    } catch (err: any) {
        console.error(err);
        process.exit(1);
    }
}

listTables();
