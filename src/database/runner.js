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

        const toRun = files.filter(f => !executedNames.includes(f));

        if (toRun.length === 0) {
            Logger.info('Everything is up to date. No new migrations found.');
            process.exit(0);
        }

        Logger.info(`Found ${toRun.length} new migration(s) to run.`);

        for (const file of toRun) {
            Logger.info(`>> Executing: ${file}`);
            const modulePath = path.join(MIGRATIONS_DIR, file);

            try {
                // Convert Windows path to file:// URL for dynamic import
                const fileUrl = `file://${modulePath.replace(/\\/g, '/')}`;
                const migration = await import(fileUrl);

                if (migration.up) {
                    await migration.up(pool);
                    await pool.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
                    Logger.info(`   SUCCESS: ${file}`);
                } else {
                    Logger.info(`   SKIPPING: ${file} (No up function found)`);
                }
            } catch (err) {
                Logger.error(`   FAILED: ${file}`);
                Logger.error(`   Error details: ${err.message}`);
                throw err; // Stop on first failure
            }
        }

        Logger.info('--- All Migrations Applied Successfully ---');
        process.exit(0);
    } catch (error) {
        Logger.error('--- MIGRATION HALTED ---');
        Logger.error(`Reason: ${error.message}`);
        process.exit(1);
    }
}

migrate();
