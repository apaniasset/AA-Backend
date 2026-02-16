import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/user.model.js';
import Sms from '../utils/Sms.js';
import Mail from '../utils/Mail.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Register User (Single Step)
 */
export const register = async (req, res) => {
    try {
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;
        const password = req.body.password;

        if (!phone || !name || !email || !password) {
            return errorResponse(res, 'All fields are required: name, phone, email, password', null, 400);
        }

        const existingUser = await UserModel.findByPhone(phone);
        if (existingUser && existingUser.status === 'active') {
            return errorResponse(res, 'Mobile number already registered', null, 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let userId;
        if (existingUser) {
            userId = existingUser.id;
            const data = {
                name: name,
                email: email,
                password: hashedPassword,
                status: 'active',
                registration_otp: null,
                registration_otp_expires: null
            };
            await UserModel.update(userId, data);
        } else {
            const data = {
                name: name,
                phone: phone,
                email: email,
                password: hashedPassword,
                status: 'active'
            };
            userId = await UserModel.create(data);
        }

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
