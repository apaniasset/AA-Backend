import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.resolve(process.cwd(), 'logs');

// Ensure logs directory exists (don't crash if it fails)
try {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
} catch (e) {
    console.error('CRITICAL: Failed to create logs directory:', e.message);
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
        const date = now.toISOString().split('T')[0];

        const fileName = `app-${date}.log`;

        // Handle object messages (like Errors)
        let formattedMessage = message;
        if (typeof message === 'object') {
            formattedMessage = message.stack || JSON.stringify(message);
        }

        const logMessage = `[${timestamp}] ${level}: ${formattedMessage}\n`;

        console.log(logMessage.trim());

        try {
            fs.appendFileSync(path.join(LOG_DIR, fileName), logMessage);
        } catch (err) {
            console.error('Failed to write to log file:', err);
        }
    }
}

export default Logger;
