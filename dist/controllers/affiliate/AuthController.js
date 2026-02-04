import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AffiliateModel } from '../../models/AffiliateModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
export class AuthController {
    static async login(req, res) {
        try {
            const { identifier, password } = req.body;
            if (!identifier || !password) {
                return ApiResponse.error(res, 'Identifier (email/phone) and password are required', 400);
            }
            const affiliate = await AffiliateModel.findByEmailOrPhone(identifier);
            if (!affiliate) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }
            const isPasswordValid = await bcrypt.compare(password, affiliate.password || '');
            if (!isPasswordValid && password !== affiliate.password) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }
            const token = jwt.sign({ id: affiliate.id, role: 'affiliate' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
            await AffiliateModel.updateLastLogin(affiliate.id);
            const { password: _, ...affiliateData } = affiliate;
            return ApiResponse.success(res, 'Affiliate login successful', {
                affiliate: affiliateData,
                token,
            });
        }
        catch (error) {
            return ApiResponse.error(res, 'Affiliate login failed', 500);
        }
    }
    static async logout(req, res) {
        return ApiResponse.success(res, 'Logged out successfully');
    }
    static async forgotPassword(req, res) {
        try {
            const { identifier } = req.body;
            if (!identifier)
                return ApiResponse.error(res, 'Email or phone is required', 400);
            const affiliate = await AffiliateModel.findByEmailOrPhone(identifier);
            if (!affiliate)
                return ApiResponse.error(res, 'Affiliate not found', 404);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await AffiliateModel.storeResetOTP(affiliate.id, otp);
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
            const affiliate = await AffiliateModel.verifyOTP(identifier, otp);
            if (!affiliate)
                return ApiResponse.error(res, 'Invalid or expired OTP', 401);
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await AffiliateModel.updatePassword(affiliate.id, hashedPassword);
            return ApiResponse.success(res, 'Password reset successfully');
        }
        catch (error) {
            return ApiResponse.error(res, 'Reset password failed', 500);
        }
    }
}
