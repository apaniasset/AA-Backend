import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

class Logger {
    static info(message) {
        this.log('INFO', message);
    }

    static error(message) {
        this.log('ERROR', message);
    }

    static log(level, message) {
        const now = new Date();
        const timestamp = now.toISOString();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD

        // Use a daily filename like in Laravel: app-2024-02-13.log
        const fileName = `app-${date}.log`;
        const logMessage = `[${timestamp}] ${level}: ${message}\n`;

        // Print to console (terminal)
        console.log(logMessage.trim());

        // Write to a daily file
        try {
            fs.appendFileSync(path.join(LOG_DIR, fileName), logMessage);
        } catch (err) {
            console.error('Failed to write to log file:', err);
        }
    }
}

export default Logger;
