import mysql from 'mysql2/promise';
import './env.js'; // Ensure env is loaded
import Logger from '../utils/Logger.js';

// Critical Validation: Check if .env variables are actually present
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    const errorMsg = `DATABASE CONFIG ERROR: Required environment variables (DB_HOST, DB_USER, DB_NAME) are missing. Check your .env file. Currently DB_USER is "${process.env.DB_USER || 'EMPTY'}"`;
    Logger.error('-----------------------------');
    Logger.error(errorMsg);
    Logger.error('-----------------------------');
    // DISABLED THROW: We don't throw anymore so the server can start and we can see diagnostics
    // throw new Error(errorMsg);
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
