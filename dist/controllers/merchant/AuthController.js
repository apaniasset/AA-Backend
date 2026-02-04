import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MerchantModel } from '../../models/MerchantModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
export class AuthController {
    static async login(req, res) {
        try {
            const { identifier, password } = req.body;
            if (!identifier || !password) {
                return ApiResponse.error(res, 'Identifier (email/phone) and password are required', 400);
            }
            const merchant = await MerchantModel.findByEmailOrPhone(identifier);
            if (!merchant) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }
            const isPasswordValid = await bcrypt.compare(password, merchant.password || '');
            if (!isPasswordValid && password !== merchant.password) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }
            const token = jwt.sign({ id: merchant.id, role: 'merchant' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
            await MerchantModel.updateLastLogin(merchant.id);
            const { password: _, ...merchantData } = merchant;
            return ApiResponse.success(res, 'Merchant login successful', {
                merchant: merchantData,
                token,
            });
        }
        catch (error) {
            return ApiResponse.error(res, 'Merchant login failed', 500);
        }
    }
    /**
     * Logout
     */
    static async logout(req, res) {
        return ApiResponse.success(res, 'Logged out successfully');
    }
    /**
     * Forgot Password
     */
    static async forgotPassword(req, res) {
        try {
            const { identifier } = req.body;
            if (!identifier) {
                return ApiResponse.error(res, 'Email or phone is required', 400);
            }
            const merchant = await MerchantModel.findByEmailOrPhone(identifier);
            if (!merchant) {
                return ApiResponse.error(res, 'Merchant not found', 404);
            }
            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await MerchantModel.storeResetOTP(merchant.id, otp);
            // In a real app, send OTP via Email or SMS here
            return ApiResponse.success(res, 'OTP sent successfully (for demo, check data field)', { otp });
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to process forgot password', 500);
        }
    }
    /**
     * Reset Password
     */
    static async resetPassword(req, res) {
        try {
            const { identifier, otp, newPassword } = req.body;
            if (!identifier || !otp || !newPassword) {
                return ApiResponse.error(res, 'Identifier, OTP and new password are required', 400);
            }
            const merchant = await MerchantModel.verifyOTP(identifier, otp);
            if (!merchant) {
                return ApiResponse.error(res, 'Invalid or expired OTP', 401);
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await MerchantModel.updatePassword(merchant.id, hashedPassword);
            return ApiResponse.success(res, 'Password reset successfully');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to reset password', 500);
        }
    }
}
