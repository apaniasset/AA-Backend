import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from '../utils/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');

async function ensureMigrationTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS _migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function migrate() {
    try {
        Logger.info('--- Starting Migrations ---');
        await ensureMigrationTable();

        const files = fs.readdirSync(MIGRATIONS_DIR)
            .filter(f => f.endsWith('.js'))
            .sort();

        const [executed] = await pool.query('SELECT name FROM _migrations');
        const executedNames = executed.map(r => r.name);

        for (const file of files) {
            if (!executedNames.includes(file)) {
                Logger.info(`Running migration: ${file}`);
                const modulePath = path.join(MIGRATIONS_DIR, file);

                // Convert Windows path to file:// URL for dynamic import on Windows
                const fileUrl = `file://${modulePath.replace(/\\/g, '/')}`;
                const migration = await import(fileUrl);

                if (migration.up) {
                    await migration.up(pool);
                    await pool.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
                    Logger.info(`SUCCESS: ${file}`);
                } else {
                    Logger.error(`SKIPPING: ${file} (No up function found)`);
                }
            }
        }

        Logger.info('--- Migrations Complete ---');
        process.exit(0);
    } catch (error) {
        Logger.error('--- MIGRATION FAILED ---');
        Logger.error(error.message);
        Logger.error(error.stack);
        process.exit(1);
    }
}

migrate();
