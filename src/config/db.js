import mysql from 'mysql2/promise';
import './env.js'; // Ensure env is loaded
import Logger from '../utils/Logger.js';

let pool;

/**
 * Lazy-load database pool to prevent startup crashes 
 * when environment variables are missing on remote servers.
 */
const getPool = () => {
    if (!pool) {
        if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
            const errorMsg = `DATABASE CONFIG ERROR: Required environment variables (DB_HOST, DB_USER, DB_NAME) are missing. Check your .env file. Currently DB_USER is "${process.env.DB_USER || 'EMPTY'}"`;
            Logger.error('-----------------------------');
            Logger.error(errorMsg);
            Logger.error('-----------------------------');
            // We still don't throw here, but the pool won't be created
            return null;
        }

        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }
    return pool;
};

/**
 * Explicit Lazy-load wrapper for the database pool.
 * This is safer than a Proxy for older Node versions or quirky environments.
 */
const db = {
    query: async (...args) => {
        const p = getPool();
        if (!p) throw new Error('Database connection failed: Environment variables not set. Check .env file.');
        return p.query(...args);
    },
    execute: async (...args) => {
        const p = getPool();
        if (!p) throw new Error('Database connection failed: Environment variables not set. Check .env file.');
        return p.execute(...args);
    },
    getConnection: async () => {
        const p = getPool();
        if (!p) throw new Error('Database connection failed: Environment variables not set. Check .env file.');
        return p.getConnection();
    },
    // Diagnostic helper
    checkConnection: async () => {
        const p = getPool();
        if (!p) return { success: false, error: 'Database variables missing' };
        try {
            const [rows] = await p.query('SELECT 1 as connected');
            return { success: true, data: rows[0] };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
};

export default db;
