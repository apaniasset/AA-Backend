import pool from './src/config/db.js';

async function checkSchema() {
    try {
        const tables = ['merchant', 'affiliate'];
        for (const table of tables) {
            const [columns] = await pool.query(`DESCRIBE ${table}`);
            console.log(`\n--- ${table} table ---`);
            columns.forEach(col => {
                console.log(`${col.Field} (${col.Type})`);
            });
        }
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

checkSchema();
