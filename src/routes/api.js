import { Router } from 'express';
import adminRoutes from './admin.js';
import merchantRoutes from './merchant.js';
import affiliateRoutes from './affiliate.js';
import userRoutes from './user.js';

const api = Router();

api.use('/admin', adminRoutes);
api.use('/merchant', merchantRoutes);
api.use('/affiliate', affiliateRoutes);
api.use('/user', userRoutes);

export default api;
