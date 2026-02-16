import { Router } from 'express';
import adminRoutes from './admin.routes.js';
import merchantRoutes from './merchant.routes.js';
import affiliateRoutes from './affiliate.routes.js';
import userRoutes from './user.routes.js';
import propertyRoutes from './property.routes.js';
import inquiryRoutes from './inquiry.routes.js';

const api = Router();

api.use('/admin', adminRoutes);
api.use('/merchant', merchantRoutes);
api.use('/affiliate', affiliateRoutes);
api.use('/user', userRoutes);
api.use('/properties', propertyRoutes);
api.use('/inquiries', inquiryRoutes);

export default api;
