import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- ENV DIAGNOSTIC ---');
console.log('Current CWD:', process.cwd());
console.log('__dirname:', __dirname);

const envPath = path.resolve(process.cwd(), '.env');
console.log('Attempting to load .env from:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Dotenv Error:', result.error.message);
} else {
    console.log('Dotenv loaded successfully');
}

console.log('DB_HOST:', process.env.DB_HOST || 'MISSING');
console.log('DB_USER:', process.env.DB_USER || 'MISSING');
console.log('PORT:', process.env.PORT || 'MISSING');
console.log('----------------------');
process.exit();
