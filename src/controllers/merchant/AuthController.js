import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MerchantModel } from '../../models/MerchantModel.js';
import Sms from '../../utils/Sms.js';

export class AuthController {
    /**
     * Standard Password Login
     */
    static async login(req, res) {
        try {
            const { identifier, password } = req.body;
            if (!identifier || !password) {
                return res.status(400).json({ success: false, message: 'Email/Phone and Password required' });
            }

            const merchant = await MerchantModel.findByEmailOrPhone(identifier);
            if (!merchant) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, merchant.password || '');
            if (!isPasswordValid && password !== merchant.password) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: merchant.id, role: 'merchant' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await MerchantModel.updateLastLogin(merchant.id);

            const { password: _, ...merchantData } = merchant;
            return res.json({ success: true, message: 'Login successful', data: { merchant: merchantData, token } });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Login failed' });
        }
    }

    /**
     * Send Login OTP
     */
    static async sendLoginOTP(req, res) {
        try {
            const { identifier } = req.body;
            if (!identifier) return res.status(400).json({ success: false, message: 'ID required' });

            const merchant = await MerchantModel.findByEmailOrPhone(identifier);
            if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found' });

            const otp = '123456'; // Static for demo
            await MerchantModel.storeLoginOTP(merchant.id, otp);

            // Send via centralized SMS utility
            await Sms.sendOTP(merchant.phone || identifier, otp);

            return res.json({ success: true, message: 'OTP sent (static 123456)', data: { otp } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Login with OTP
     */
    static async loginWithOTP(req, res) {
        try {
            const { identifier, otp } = req.body;
            if (!identifier || !otp) return res.status(400).json({ success: false, message: 'ID and OTP required' });

            const merchant = await MerchantModel.verifyLoginOTP(identifier, otp);
            if (!merchant) return res.status(401).json({ success: false, message: 'Invalid OTP' });

            const token = jwt.sign({ id: merchant.id, role: 'merchant' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await MerchantModel.updateLastLogin(merchant.id);

            const { password: _, ...merchantData } = merchant;
            return res.json({ success: true, message: 'OTP Login successful', data: { merchant: merchantData, token } });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'OTP Login failed' });
        }
    }

    static async logout(req, res) {
        return res.json({ success: true, message: 'Logged out', data: null });
    }

    static async forgotPassword(req, res) {
        try {
            const { identifier } = req.body;
            const merchant = await MerchantModel.findByEmailOrPhone(identifier);
            if (!merchant) return res.status(404).json({ success: false, message: 'Not found' });

            const otp = '123456';
            await MerchantModel.storeResetOTP(merchant.id, otp);
            await Sms.sendOTP(merchant.phone || identifier, otp);
            return res.json({ success: true, message: 'Reset OTP sent', data: { otp } });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed' });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { identifier, otp, newPassword } = req.body;
            const merchant = await MerchantModel.verifyOTP(identifier, otp);
            if (!merchant) return res.status(401).json({ success: false, message: 'Invalid OTP' });

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await MerchantModel.updatePassword(merchant.id, hashedPassword);
            return res.json({ success: true, message: 'Password reset successful', data: null });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed' });
        }
    }
}
