import pool from './config/db.js';

async function updateSchema() {
    try {
        await pool.query(`
            ALTER TABLE merchant 
            ADD COLUMN IF NOT EXISTS login_otp VARCHAR(6) NULL,
            ADD COLUMN IF NOT EXISTS login_otp_expires DATETIME NULL
        `);
        console.log('Merchant schema update check completed.');
    } catch (err: any) {
        console.error('Error updating merchant schema:', err.message);
    } finally {
        process.exit(0);
    }
}

updateSchema();
