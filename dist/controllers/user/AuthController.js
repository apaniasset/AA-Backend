import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/UserModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
export class AuthController {
    static async login(req, res) {
        try {
            const { identifier, password } = req.body;
            if (!identifier || !password) {
                return ApiResponse.error(res, 'Identifier (email/mobile) and password are required', 400);
            }
            const user = await UserModel.findByEmailOrMobile(identifier);
            if (!user) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }
            const isPasswordValid = await bcrypt.compare(password, user.password || '');
            if (!isPasswordValid && password !== user.password) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }
            const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
            await UserModel.updateLastLogin(user.id);
            const { password: _, ...userData } = user;
            return ApiResponse.success(res, 'User login successful', {
                user: userData,
                token,
            });
        }
        catch (error) {
            return ApiResponse.error(res, 'User login failed', 500);
        }
    }
    static async logout(req, res) {
        return ApiResponse.success(res, 'Logged out successfully');
    }
    static async forgotPassword(req, res) {
        try {
            const { identifier } = req.body;
            if (!identifier)
                return ApiResponse.error(res, 'Email or mobile is required', 400);
            const user = await UserModel.findByEmailOrMobile(identifier);
            if (!user)
                return ApiResponse.error(res, 'User not found', 404);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await UserModel.storeResetOTP(user.id, otp);
            return ApiResponse.success(res, 'OTP sent successfully', { otp });
        }
        catch (error) {
            return ApiResponse.error(res, 'Forgot password failed', 500);
        }
    }
    static async resetPassword(req, res) {
        try {
            const { identifier, otp, newPassword } = req.body;
            if (!identifier || !otp || !newPassword)
                return ApiResponse.error(res, 'Required fields missing', 400);
            const user = await UserModel.verifyOTP(identifier, otp);
            if (!user)
                return ApiResponse.error(res, 'Invalid or expired OTP', 401);
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await UserModel.updatePassword(user.id, hashedPassword);
            return ApiResponse.success(res, 'Password reset successfully');
        }
        catch (error) {
            return ApiResponse.error(res, 'Reset password failed', 500);
        }
    }
}
