import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MerchantModel } from '../../models/MerchantModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            let { identifier, password, mobile, phone } = req.body;
            identifier = identifier || mobile || phone;

            if (!identifier || !password) {
                return ApiResponse.error(res, 'Identifier (email/phone), mobile or phone, and password are required', 400);
            }

            const merchant = await MerchantModel.findByEmailOrPhone(identifier);

            if (!merchant) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }

            const isPasswordValid = await bcrypt.compare(password, merchant.password || '');

            if (!isPasswordValid && password !== merchant.password) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }

            const token = jwt.sign(
                { id: merchant.id, role: 'merchant' },
                process.env.JWT_SECRET as string,
                { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d' }
            );

            await MerchantModel.updateLastLogin(merchant.id);

            const { password: _, ...merchantData } = merchant;
            return ApiResponse.success(res, 'Merchant login successful', {
                merchant: merchantData,
                token,
            });

        } catch (error: any) {
            return ApiResponse.error(res, 'Merchant login failed', 500);
        }
    }

    /**
     * Logout
     */
    static async logout(req: Request, res: Response) {
        return ApiResponse.success(res, 'Logged out successfully');
    }

    /**
     * Forgot Password
     */
    static async forgotPassword(req: Request, res: Response) {
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

        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to process forgot password', 500);
        }
    }

    /**
     * Reset Password
     */
    static async resetPassword(req: Request, res: Response) {
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

        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to reset password', 500);
        }
    }

    /**
     * Send Login OTP
     */
    static async sendLoginOTP(req: Request, res: Response) {
        try {
            let { identifier, mobile, phone } = req.body;
            identifier = identifier || mobile || phone;

            if (!identifier) {
                return ApiResponse.error(res, 'Mobile number or email is required', 400);
            }

            const merchant = await MerchantModel.findByEmailOrPhone(identifier);
            if (!merchant) {
                return ApiResponse.error(res, 'Merchant not found', 404);
            }

            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await MerchantModel.storeLoginOTP(merchant.id, otp);

            // In a real app, send OTP via SMS here
            return ApiResponse.success(res, 'Login OTP sent successfully (for demo, check data field)', { otp });

        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to send login OTP', 500);
        }
    }

    /**
     * Login with OTP
     */
    static async loginWithOTP(req: Request, res: Response) {
        try {
            let { identifier, otp, mobile, phone } = req.body;
            identifier = identifier || mobile || phone;

            if (!identifier || !otp) {
                return ApiResponse.error(res, 'Identifier and OTP are required', 400);
            }

            const merchant = await MerchantModel.verifyLoginOTP(identifier, otp);
            if (!merchant) {
                return ApiResponse.error(res, 'Invalid or expired OTP', 401);
            }

            const token = jwt.sign(
                { id: merchant.id, role: 'merchant' },
                process.env.JWT_SECRET as string,
                { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d' }
            );

            await MerchantModel.updateLastLogin(merchant.id);

            const { password: _, ...merchantData } = merchant;
            return ApiResponse.success(res, 'Merchant login successful', {
                merchant: merchantData,
                token,
            });

        } catch (error: any) {
            return ApiResponse.error(res, 'Merchant login with OTP failed', 500);
        }
    }
}
