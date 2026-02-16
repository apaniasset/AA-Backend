import mysql from 'mysql2/promise';
import './env.js'; // Ensure env is loaded

// Critical Validation: Check if .env variables are actually present
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    console.error('--- DATABASE CONFIG ERROR ---');
    console.error('Required environment variables (DB_HOST, DB_USER, DB_NAME) are missing!');
    console.error('This usually means your .env file is missing or not being read correctly.');
    console.error('-----------------------------');
    process.exit(1);
}

/**
 * Database Connection Pool
 * Simple and direct: pulls everything from .env
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
