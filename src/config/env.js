import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This finds the root directory from src/config/env.js
const rootPath = path.resolve(__dirname, '../../');
const envPath = path.join(rootPath, '.env');

console.log(`[ENV] Loading variables from: ${envPath}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('--- ENV LOAD ERROR ---');
    console.error(`Could not find or read .env file at: ${envPath}`);
    console.error('Make sure the file exists and has correct permissions.');
    console.error('-----------------------');
    // We don't exit here to allow fallbacks, but DB will fail later with clear error
} else {
    console.log('[ENV] Variables loaded successfully.');
}

export default process.env;
