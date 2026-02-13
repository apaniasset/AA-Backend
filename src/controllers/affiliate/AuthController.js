import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AffiliateModel } from '../../models/AffiliateModel.js';
import Sms from '../../utils/Sms.js';

export class AuthController {
    /**
     * Affiliate Login
     */
    static async login(req, res) {
        try {
            const { identifier, password } = req.body;
            if (!identifier || !password) return res.status(400).json({ success: false, message: 'ID and password required' });

            const affiliate = await AffiliateModel.findByEmailOrPhone(identifier);
            if (!affiliate) return res.status(401).json({ success: false, message: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, affiliate.password || '');
            if (!isMatch && password !== affiliate.password) return res.status(401).json({ success: false, message: 'Invalid credentials' });

            const token = jwt.sign({ id: affiliate.id, role: 'affiliate' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await AffiliateModel.updateLastLogin(affiliate.id);

            const { password: _, ...affiliateData } = affiliate;
            return res.json({ success: true, message: 'Logged in', data: { affiliate: affiliateData, token } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async logout(req, res) {
        return res.json({ success: true, message: 'Logged out', data: null });
    }

    static async forgotPassword(req, res) {
        try {
            const { identifier } = req.body;
            const affiliate = await AffiliateModel.findByEmailOrPhone(identifier);
            if (!affiliate) return res.status(404).json({ success: false, message: 'Affiliate not found' });

            const otp = '123456'; // Static for demo
            await AffiliateModel.storeResetOTP(affiliate.id, otp);
            await Sms.sendOTP(affiliate.phone || identifier, otp);
            return res.json({ success: true, message: 'OTP sent', data: { otp } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { identifier, otp, newPassword } = req.body;
            const affiliate = await AffiliateModel.verifyOTP(identifier, otp);
            if (!affiliate) return res.status(401).json({ success: false, message: 'Invalid OTP' });

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await AffiliateModel.updatePassword(affiliate.id, hashedPassword);
            return res.json({ success: true, message: 'Password reset successful', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }
}
