import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

import path from 'path';

// Load .env variables from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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
