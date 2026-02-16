import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as AdminModel from '../models/admin.model.js';
import Sms from '../utils/Sms.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Admin Login
 */
export const login = async (req, res) => {
    try {
        const identifier = req.body.identifier;
        const password = req.body.password;

        if (!identifier || !password) {
            return errorResponse(res, 'ID and password required', null, 400);
        }

        const admin = await AdminModel.findByEmailOrPhone(identifier);
        if (!admin) {
            return errorResponse(res, 'Invalid credentials', null, 401);
        }

        const adminPassword = admin.password || '';
        const isMatch = await bcrypt.compare(password, adminPassword);

        if (!isMatch && password !== adminPassword) {
            return errorResponse(res, 'Invalid credentials', null, 401);
        }

        const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        await AdminModel.updateLastLogin(admin.id);

        const adminData = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
            status: admin.status
        };

        const responseData = {
            admin: adminData,
            token: token
        };

        return successResponse(res, 'Logged in', responseData);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const logout = async (req, res) => {
    return successResponse(res, 'Logged out');
};

export const forgotPassword = async (req, res) => {
    try {
        const identifier = req.body.identifier;
        const admin = await AdminModel.findByEmailOrPhone(identifier);

        if (!admin) {
            return errorResponse(res, 'Admin not found', null, 404);
        }

        const otp = '123456'; // Static for demo
        await AdminModel.storeResetOTP(admin.id, otp);

        const phoneNumber = admin.phone || identifier;
        await Sms.sendOTP(phoneNumber, otp);

        const responseData = {
            otp: otp
        };

        return successResponse(res, 'OTP sent', responseData);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const identifier = req.body.identifier;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword;

        const admin = await AdminModel.verifyOTP(identifier, otp);
        if (!admin) {
            return errorResponse(res, 'Invalid OTP', null, 401);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await AdminModel.updatePassword(admin.id, hashedPassword);

        return successResponse(res, 'Password reset successful');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
