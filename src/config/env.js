import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from '../utils/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This finds the root directory from src/config/env.js
const rootPath = path.resolve(__dirname, '../../');
const envPath = path.join(rootPath, '.env');

Logger.info(`[ENV] Loading variables from: ${envPath}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
    Logger.error('--- ENV LOAD ERROR ---');
    Logger.error(`Could not find or read .env file at: ${envPath}`);
    Logger.error('Make sure the file exists and has correct permissions.');
    Logger.error('-----------------------');
} else {
    Logger.info('[ENV] Variables loaded successfully.');
}

export default process.env;
