import { Router } from 'express';
import adminRoutes from './admin.routes.js';
import merchantRoutes from './merchant.routes.js';
import affiliateRoutes from './affiliate.routes.js';
import userRoutes from './user.routes.js';
import propertyRoutes from './property.routes.js';
import inquiryRoutes from './inquiry.routes.js';
import masterRoutes from './master.routes.js';

const api = Router();

api.get('/status', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        env: {
            DB_HOST: process.env.DB_HOST ? 'SET' : 'MISSING',
            DB_USER: process.env.DB_USER || 'MISSING',
            DB_NAME: process.env.DB_NAME ? 'SET' : 'MISSING',
            NODE_ENV: process.env.NODE_ENV,
        },
        timestamp: new Date().toISOString()
    });
});

api.use('/admin', adminRoutes);
api.use('/merchant', merchantRoutes);
api.use('/affiliate', affiliateRoutes);
api.use('/user', userRoutes);
api.use('/properties', propertyRoutes);
api.use('/inquiries', inquiryRoutes);
api.use('/master', masterRoutes);

export default api;
