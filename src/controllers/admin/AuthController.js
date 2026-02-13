import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../../models/AdminModel.js';
import Sms from '../../utils/Sms.js';

export class AuthController {
    /**
     * Admin Login
     */
    static async login(req, res) {
        try {
            const { identifier, password } = req.body;
            if (!identifier || !password) return res.status(400).json({ success: false, message: 'ID and password required' });

            const admin = await AdminModel.findByEmailOrPhone(identifier);
            if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, admin.password || '');
            if (!isMatch && password !== admin.password) return res.status(401).json({ success: false, message: 'Invalid credentials' });

            const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await AdminModel.updateLastLogin(admin.id);

            const { password: _, ...adminData } = admin;
            return res.json({ success: true, message: 'Logged in', data: { admin: adminData, token } });
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
            const admin = await AdminModel.findByEmailOrPhone(identifier);
            if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

            const otp = '123456'; // Static for demo
            await AdminModel.storeResetOTP(admin.id, otp);
            await Sms.sendOTP(admin.phone || identifier, otp);
            return res.json({ success: true, message: 'OTP sent', data: { otp } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { identifier, otp, newPassword } = req.body;
            const admin = await AdminModel.verifyOTP(identifier, otp);
            if (!admin) return res.status(401).json({ success: false, message: 'Invalid OTP' });

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await AdminModel.updatePassword(admin.id, hashedPassword);
            return res.json({ success: true, message: 'Password reset successful', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }
}
