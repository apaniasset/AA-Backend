import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/user.model.js';
import Sms from '../utils/Sms.js';
import Mail from '../utils/Mail.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Send OTP for Registration
 */
export const sendRegistrationOTP = async (req, res) => {
    try {
        const phone = req.body.phone;
        if (!phone) return errorResponse(res, 'Phone number is required', null, 400);

        const existingUser = await UserModel.findByPhone(phone);
        if (existingUser && existingUser.status === 'active') {
            return errorResponse(res, 'Mobile number already registered', null, 400);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await UserModel.storeRegistrationOTP(phone, otp);
        await Sms.sendOTP(phone, otp);

        return successResponse(res, 'OTP sent successfully', { otp });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Verify OTP for Registration
 */
export const verifyRegistrationOTP = async (req, res) => {
    try {
        const phone = req.body.phone;
        const otp = req.body.otp;

        if (!phone || !otp) return errorResponse(res, 'Phone and OTP are required', null, 400);

        const user = await UserModel.verifyRegistrationOTP(phone, otp);
        if (!user) return errorResponse(res, 'Invalid or expired OTP', null, 401);

        const token = jwt.sign({ id: user.id, phone: phone, role: 'user_pending' }, process.env.JWT_SECRET, { expiresIn: '15m' });
        return successResponse(res, 'OTP verified successfully. You can now complete registration.', { token });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Register User (Step 2 - Details after OTP)
 */
export const register = async (req, res) => {
    try {
        const phone = req.body.phone || (req.user ? req.user.phone : null);
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if (!name) {
            return errorResponse(res, 'Name field is required', null, 400);
        }

        if (!phone && !req.user) {
            return errorResponse(res, 'Phone number is required', null, 400);
        }

        const existingUser = (req.user && req.user.id) ? await UserModel.findById(req.user.id) : await UserModel.findByPhone(phone);
        if (!existingUser || existingUser.status !== 'pending_registration') {
            return errorResponse(res, 'Phone number not verified or already registered', null, 403);
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const userId = existingUser.id;
        const data = {
            name: name,
            email: email || null,
            password: hashedPassword,
            status: 'active',
            registration_otp: null,
            registration_otp_expires: null
        };
        await UserModel.update(userId, data);

        const token = jwt.sign({ id: userId, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const userData = {
            id: userId,
            name: name,
            email: email,
            phone: phone,
            status: 'active'
        };

        const responseData = {
            user: userData,
            token: token
        };

        return successResponse(res, 'Registration successful', responseData);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Flexible Login (Email/Phone)
 */
export const login = async (req, res) => {
    try {
        const identifier = req.body.identifier;
        const password = req.body.password;

        if (!identifier || !password) {
            return errorResponse(res, 'Identifier and password required', null, 400);
        }

        const user = await UserModel.findByEmailOrMobile(identifier);
        if (!user || user.status !== 'active') {
            return errorResponse(res, 'Invalid credentials or inactive account', null, 401);
        }

        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch && password !== user.password) {
            return errorResponse(res, 'Invalid credentials', null, 401);
        }

        const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        await UserModel.updateLastLogin(user.id);

        const responseData = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                status: user.status
            },
            token: token
        };

        return successResponse(res, 'Login successful', responseData);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (req, res) => {
    try {
        const identifier = req.body.identifier;
        const user = await UserModel.findByEmailOrMobile(identifier);

        if (!user) {
            return errorResponse(res, 'User not found', null, 404);
        }

        const otp = '123456';
        await UserModel.storeResetOTP(user.id, otp);

        if (user.phone) await Sms.sendOTP(user.phone, otp);
        if (user.email) {
            await Mail.send({
                to: user.email,
                subject: 'Password Reset OTP',
                html: `<p>OTP: <b>${otp}</b></p>`
            });
        }

        return successResponse(res, 'Reset OTP sent to mobile and email', { otp });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const identifier = req.body.identifier;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword;

        const user = await UserModel.verifyOTP(identifier, otp);
        if (!user) return errorResponse(res, 'Invalid OTP', null, 401);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.updatePassword(user.id, hashedPassword);

        return successResponse(res, 'Password reset successful');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const logout = async (req, res) => {
    return successResponse(res, 'Logged out');
};
