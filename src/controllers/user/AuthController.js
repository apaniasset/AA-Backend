import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/UserModel.js';
import Sms from '../../utils/Sms.js';

export class AuthController {
    /**
     * Password Login
     */
    static async login(req, res) {
        try {
            const { identifier, password } = req.body;
            if (!identifier || !password) {
                return res.status(400).json({ success: false, message: 'Identifier and password are required' });
            }

            const user = await UserModel.findByEmailOrMobile(identifier);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password || '');
            if (!isPasswordValid && password !== user.password) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await UserModel.updateLastLogin(user.id);

            const { password: _, ...userData } = user;
            return res.json({ success: true, message: 'Login successful', data: { user: userData, token } });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
        }
    }

    /**
     * Send Login OTP
     */
    static async sendLoginOTP(req, res) {
        try {
            const { identifier } = req.body;
            if (!identifier) return res.status(400).json({ success: false, message: 'ID is required' });

            const user = await UserModel.findByEmailOrMobile(identifier);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            const otp = '123456'; // Static for demo as requested
            await UserModel.storeLoginOTP(user.id, otp);

            // Send via centralized SMS utility
            await Sms.sendOTP(user.phone || identifier, otp);

            return res.json({ success: true, message: 'OTP sent successfully', data: { otp } });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to send OTP' });
        }
    }

    /**
     * Login with OTP
     */
    static async loginWithOTP(req, res) {
        try {
            const { identifier, otp } = req.body;
            if (!identifier || !otp) return res.status(400).json({ success: false, message: 'ID and OTP required' });

            const user = await UserModel.verifyLoginOTP(identifier, otp);
            if (!user) return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });

            const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await UserModel.updateLastLogin(user.id);

            const { password: _, ...userData } = user;
            return res.json({ success: true, message: 'OTP Login successful', data: { user: userData, token } });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'OTP login failed' });
        }
    }

    static async logout(req, res) {
        return res.json({ success: true, message: 'Logged out successfully', data: null });
    }

    static async forgotPassword(req, res) {
        try {
            const { identifier } = req.body;
            const user = await UserModel.findByEmailOrMobile(identifier);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            const otp = '123456';
            await UserModel.storeResetOTP(user.id, otp);
            await Sms.sendOTP(user.phone || identifier, otp);
            return res.json({ success: true, message: 'Reset OTP sent', data: { otp } });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Request failed' });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { identifier, otp, newPassword } = req.body;
            const user = await UserModel.verifyOTP(identifier, otp);
            if (!user) return res.status(401).json({ success: false, message: 'Invalid OTP' });

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await UserModel.updatePassword(user.id, hashedPassword);
            return res.json({ success: true, message: 'Password updated', data: null });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Reset failed' });
        }
    }
}
