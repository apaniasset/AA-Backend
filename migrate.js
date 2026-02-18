import pool from './src/config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    try {
        console.log('--- Starting Database Migrations (Laravel Style) ---');

        // 1. Ensure migrations table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                migration VARCHAR(255) NOT NULL,
                batch INT NOT NULL
            )
        `);

        // 2. Get executed migrations
        const [executed] = await pool.query('SELECT migration FROM migrations');
        const executedNames = executed.map(m => m.migration);

        // 3. Get next batch number
        const [batchResult] = await pool.query('SELECT MAX(batch) as max_batch FROM migrations');
        const nextBatch = (batchResult[0].max_batch || 0) + 1;

        // 4. Find all migration files
        const migrationsDir = path.join(__dirname, 'src', 'database', 'migrations');
        if (!fs.existsSync(migrationsDir)) {
            console.log('No migrations directory found.');
            return;
        }

        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.js'))
            .sort();

        let runCount = 0;
        for (const file of files) {
            const migrationName = file.replace('.js', '');

            if (executedNames.includes(migrationName)) {
                // console.log(`Skipping: ${file} (Already run)`);
                continue;
            }

            console.log(`\nRunning migration: ${file}`);
            const migrationPath = path.join(migrationsDir, file);

            // Convert to file URL for Windows compatibility with dynamic import
            const migrationUrl = pathToFileURL(migrationPath).href;

            const { up } = await import(migrationUrl);

            if (typeof up === 'function') {
                await up(pool);
                await pool.query('INSERT INTO migrations (migration, batch) VALUES (?, ?)', [migrationName, nextBatch]);
                runCount++;
            }
        }

        if (runCount === 0) {
            console.log('\nNo new migrations to run.');
        } else {
            console.log(`\n--- Batch ${nextBatch} completed: ${runCount} migrations run ---`);
        }

        process.exit(0);
    } catch (e) {
        console.error('\n!!! Migration failed:', e.message);
        process.exit(1);
    }
}

migrate();
