import express from 'express';
import dotenv from 'dotenv';
import { ApiResponse } from './utils/ApiResponse.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
// Auth Routes
import adminAuthRoutes from './routes/admin/authRoutes.js';
import merchantAuthRoutes from './routes/merchant/authRoutes.js';
import affiliateAuthRoutes from './routes/affiliate/authRoutes.js';
import userAuthRoutes from './routes/user/authRoutes.js';
// Management (CRUD) Routes
import adminRoutes from './routes/admin/adminRoutes.js';
import merchantRoutes from './routes/merchant/merchantRoutes.js';
import affiliateRoutes from './routes/affiliate/affiliateRoutes.js';
import userRoutes from './routes/user/userRoutes.js';
import locationRoutes from './routes/admin/locationRoutes.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
// Auth Endpoints
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/merchant/auth', merchantAuthRoutes);
app.use('/api/affiliate/auth', affiliateAuthRoutes);
app.use('/api/user/auth', userAuthRoutes);
// Management (CRUD) Endpoints
app.use('/api/admin', adminRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin/location', locationRoutes);
app.get('/', (req, res) => {
    return ApiResponse.success(res, 'Welcome to ApniAsset Backend API');
});
// Sample Route for "Data added successfully"
app.post('/api/sample', (req, res) => {
    const data = req.body;
    // Imagine database logic here...
    return ApiResponse.success(res, 'Data added successfully', { id: 1, ...data }, 201);
});
// Error handling - MUST be the last middleware
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
