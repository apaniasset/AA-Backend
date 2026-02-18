import pool from '../../config/db.js';

const down = async () => {
    try {
        console.log('--- Starting Cleanup Migration ---');

        await pool.query('DROP TABLE IF EXISTS locations');
        await pool.query('DROP TABLE IF EXISTS cities');
        await pool.query('DROP TABLE IF EXISTS states');
        await pool.query('DROP TABLE IF EXISTS countries');

        console.log(' - Redundant tables dropped successfully');
        process.exit(0);
    } catch (e) {
        console.error('!!! Cleanup Failed:', e);
        process.exit(1);
    }
};

down();
