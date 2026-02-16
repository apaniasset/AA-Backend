import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import routes from './routes/index.routes.js';
import Logger from './utils/Logger.js';
import Mail from './utils/Mail.js';

import path from 'path';

// Load environment variables immediately
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const port = process.env.PORT || 1700;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, req_res, next) => {
    Logger.info(`${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api', routes);

// Email Test Route
app.post('/api/test-email', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email required' });

        await Mail.send({
            to: email,
            subject: 'Test Email from ApniAsset',
            html: '<h1>Success!</h1><p>The email system is working perfectly.</p>'
        });

        return res.json({ success: true, message: 'Test email sent successfully', data: null });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/', (req, res) => {
    return res.json({ success: true, message: 'Welcome to ApniAsset Backend API', data: null });
});

// Error handling - MUST be the last middleware
app.use(errorMiddleware);

app.listen(port, () => {
    Logger.info(`Server is running at http://localhost:${port}`);
});
