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
 * Robust Lazy-load Proxy for the database pool.
 * This mimics the mysql2 pool object perfectly but only creates it 
 * when the first property (like .query or .getConnection) is accessed.
 */
const lazyPool = new Proxy({}, {
    get: (target, prop) => {
        const pool = getPool();
        if (!pool) {
            // If someone tries to use the pool before .env is set, we throw a clear error 
            // but ONLY when they try to use it, not when the app starts.
            return (...args) => {
                throw new Error('Database connection failed: Environment variables not set. Please check your .env file.');
            };
        }

        const value = pool[prop];
        return typeof value === 'function' ? value.bind(pool) : value;
    }
});

export default lazyPool;
