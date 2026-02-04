import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../../models/AdminModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { identifier, password } = req.body;

            if (!identifier || !password) {
                return ApiResponse.error(res, 'Identifier and password are required', 400);
            }

            const admin = await AdminModel.findByEmailOrPhone(identifier);

            if (!admin) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password || '');

            if (!isPasswordValid && password !== admin.password) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }

            const token = jwt.sign(
                { id: admin.id, role: 'admin' },
                process.env.JWT_SECRET as string,
                { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d' }
            );

            await AdminModel.updateLastLogin(admin.id);

            const { password: _, ...adminData } = admin;
            return ApiResponse.success(res, 'Admin login successful', {
                admin: adminData,
                token,
            });

        } catch (error: any) {
            return ApiResponse.error(res, 'Admin login failed', 500);
        }
    }

    static async logout(req: Request, res: Response) {
        return ApiResponse.success(res, 'Logged out successfully');
    }

    static async forgotPassword(req: Request, res: Response) {
        try {
            const { identifier } = req.body;
            if (!identifier) return ApiResponse.error(res, 'Identifier (email/phone) is required', 400);

            const admin = await AdminModel.findByEmailOrPhone(identifier);
            if (!admin) return ApiResponse.error(res, 'Admin not found', 404);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await AdminModel.storeResetOTP(admin.id, otp);

            return ApiResponse.success(res, 'OTP sent successfully', { otp });
        } catch (error: any) {
            return ApiResponse.error(res, 'Forgot password failed', 500);
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { identifier, otp, newPassword } = req.body;
            if (!identifier || !otp || !newPassword) return ApiResponse.error(res, 'Required fields missing', 400);

            const admin = await AdminModel.verifyOTP(identifier, otp);
            if (!admin) return ApiResponse.error(res, 'Invalid or expired OTP', 401);

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await AdminModel.updatePassword(admin.id, hashedPassword);

            return ApiResponse.success(res, 'Password reset successfully');
        } catch (error: any) {
            return ApiResponse.error(res, 'Reset password failed', 500);
        }
    }
}
