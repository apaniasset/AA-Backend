import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from '../utils/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This finds the root directory from src/config/env.js
const rootPath = path.resolve(__dirname, '../../');
const envPath = path.join(rootPath, '.env');
const cwdEnvPath = path.join(process.cwd(), '.env');

// Try loading from root path first, then CWD
let result = dotenv.config({ path: envPath });

if (result.error) {
    Logger.info(`[ENV] .env not found at ${envPath}, trying CWD: ${cwdEnvPath}`);
    result = dotenv.config({ path: cwdEnvPath });
}

if (result.error) {
    Logger.error('--- ENV LOAD ERROR ---');
    Logger.error(`Could not find or read .env file. Tried: ${envPath} AND ${cwdEnvPath}`);
    Logger.error('This will cause database connection failures if variables are not set in the environment.');
    Logger.error('-----------------------');
} else {
    Logger.info(`[ENV] Variables loaded successfully from: ${result.parsed ? (envPath === result.path ? envPath : cwdEnvPath) : 'Environment'}`);
}

export default process.env;
