import pool from './src/config/db.js';

async function migrate() {
    try {
        const tables = ['users', 'merchant', 'affiliate'];
        for (const table of tables) {
            console.log(`Migrating ${table}...`);
            // Check if column exists first to avoid error if MariaDB version doesn't support IF NOT EXISTS for ADD COLUMN
            const [columns] = await pool.query(`SHOW COLUMNS FROM ${table} LIKE 'registration_otp'`);
            if (columns.length === 0) {
                await pool.query(`ALTER TABLE ${table} ADD COLUMN registration_otp VARCHAR(6) NULL`);
                await pool.query(`ALTER TABLE ${table} ADD COLUMN registration_otp_expires DATETIME NULL`);
                console.log(`Added registration columns to ${table}`);
            } else {
                console.log(`Registration columns already exist in ${table}`);
            }
        }
        console.log('Migration complete.');
        process.exit(0);
    } catch (e) {
        console.error('Migration failed:', e.message);
        process.exit(1);
    }
}

migrate();
