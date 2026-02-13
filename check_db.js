import pool from './src/config/db.js';
async function test() {
    try {
        const [rows] = await pool.query('SELECT * FROM users LIMIT 1');
        console.log('USER DATA:', JSON.stringify(rows[0], null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();
