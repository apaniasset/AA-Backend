import pool from './config/db.js';
import fs from 'fs';

async function dumpSchema() {
    const tables = ['admin', 'merchant', 'affiliate', 'users'];
    const schema: any = {};

    for (const table of tables) {
        try {
            const [rows]: any = await pool.query(`DESCRIBE ${table}`);
            schema[table] = rows;
        } catch (err: any) {
            console.error(`Error describing ${table}:`, err.message);
        }
    }

    fs.writeFileSync('full_schema.json', JSON.stringify(schema, null, 2));
    console.log('Schema dumped to full_schema.json');
    process.exit(0);
}

dumpSchema();
