import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import merchantRoutes from './merchant.js';
import affiliateRoutes from './affiliate.js';
import userRoutes from './user.js';
import masterRoutes from './master/index.js';

const api = Router();

api.use('/auth', authRoutes); // The single entrance for all logins
api.use('/admin', adminRoutes);
api.use('/merchant', merchantRoutes);
api.use('/affiliate', affiliateRoutes);
api.use('/user', userRoutes);
api.use('/master', masterRoutes);

export default api;
