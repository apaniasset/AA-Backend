import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';
import Sms from '../utils/Sms.js';

export class AuthController {
    /**
     * Universal Login API
     */
    static async login(req, res) {
        try {
            const { identifier, password } = req.validatedBody;

            // Find user with unified logic
            const user = await UserModel.findByEmailOrMobile(identifier);
            if (!user) return errorResponse(res, 'Invalid credentials or account inactive', null, 401);

            // Verify Password
            const isPasswordValid = await bcrypt.compare(password, user.password || '');
            if (!isPasswordValid && password !== user.password) {
                return errorResponse(res, 'Invalid credentials', null, 401);
            }

            // Generate Unified Token
            const token = jwt.sign(
                { id: user.id, roles: user.roles, permissions: user.permissions },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            await UserModel.updateLastLogin(user.id);

            const { password: _, ...userData } = user;
            return successResponse(res, 'Login successful', { user: userData, token });
        } catch (error) {
            return errorResponse(res, 'Login failed', error.message, 500);
        }
    }

    /**
     * Send Unified Login OTP
     */
    static async sendOTP(req, res) {
        try {
            const { identifier } = req.body;
            const user = await UserModel.findByEmailOrMobile(identifier);
            if (!user) return errorResponse(res, 'User not found', null, 404);

            const otp = '123456'; // Placeholder logic
            await UserModel.storeLoginOTP(user.id, otp);
            await Sms.sendOTP(user.phone || identifier, otp);

            return successResponse(res, 'OTP sent successfully', { otp });
        } catch (error) {
            return errorResponse(res, 'Failed to send OTP', error.message, 500);
        }
    }

    /**
     * Login with OTP
     */
    static async loginWithOTP(req, res) {
        try {
            const { identifier, otp } = req.validatedBody;
            const user = await UserModel.verifyLoginOTP(identifier, otp);
            if (!user) return errorResponse(res, 'Invalid or expired OTP', null, 401);

            const fullUser = await UserModel.findByEmailOrMobile(user.email);
            const token = jwt.sign(
                { id: fullUser.id, roles: fullUser.roles, permissions: fullUser.permissions },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            const { password: _, ...userData } = fullUser;
            return successResponse(res, 'OTP Login successful', { user: userData, token });
        } catch (error) {
            return errorResponse(res, 'OTP login failed', error.message, 500);
        }
    }

    static async logout(req, res) {
        return successResponse(res, 'Logged out successfully');
    }
}
