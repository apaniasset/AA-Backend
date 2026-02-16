import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as MerchantModel from '../models/merchant.model.js';
import Sms from '../utils/Sms.js';
import Mail from '../utils/Mail.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Step 1: Send Registration OTP (Mobile Only)
 */
export const sendRegistrationOTP = async (req, res) => {
    try {
        const phone = req.body.phone;
        if (!phone) {
            return errorResponse(res, 'Mobile number required', null, 400);
        }

        const existing = await MerchantModel.findByPhone(phone);
        if (existing && existing.status === 'active') {
            return errorResponse(res, 'Mobile already registered', null, 400);
        }

        const otp = '123456'; // demo
        await MerchantModel.storeRegistrationOTP(phone, otp);
        await Sms.sendOTP(phone, otp);

        const responseData = {
            otp: otp
        };

        return successResponse(res, 'Registration OTP sent', responseData);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Step 2: Complete Profile (Matches Laravel logic + OTP)
 */
export const completeRegistration = async (req, res) => {
    try {
        const phone = req.body.phone;
        const otp = req.body.otp;
        const name = req.body.name;
        const email = req.body.email;
        const business = req.body.business_name;
        const password = req.body.password;

        if (!phone || !otp || !name || !email || !password) {
            return errorResponse(res, 'All fields required', null, 400);
        }

        const merchant = await MerchantModel.verifyRegistrationOTP(phone, otp);
        if (!merchant) {
            return errorResponse(res, 'Invalid or expired OTP', null, 401);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            name: name,
            email: email,
            company_name: business, // matching schema 'company_name'
            password: hashedPassword,
            status: 'active',
            merchant_type: 'owner', // Defaulting to owner as in Laravel
            registration_otp: null,
            registration_otp_expires: null
        };

        // Model.update now handles credit awarding if status becomes 'active'
        await MerchantModel.update(merchant.id, data);

        const token = jwt.sign({ id: merchant.id, role: 'merchant' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const merchantData = {
            id: merchant.id,
            name,
            email,
            phone,
            company_name: business
        };

        const responseData = {
            merchant: merchantData,
            token: token
        };

        return successResponse(res, 'Registration complete. 1 free credit added.', responseData);
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

        const merchant = await MerchantModel.findByEmailOrPhone(identifier);
        if (!merchant || merchant.status !== 'active') {
            return errorResponse(res, 'Invalid credentials', null, 401);
        }

        const isMatch = await bcrypt.compare(password, merchant.password || '');
        if (!isMatch && password !== merchant.password) {
            return errorResponse(res, 'Invalid credentials', null, 401);
        }

        const token = jwt.sign({ id: merchant.id, role: 'merchant' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        await MerchantModel.updateLastLogin(merchant.id);

        const responseData = {
            merchant: {
                id: merchant.id,
                name: merchant.name,
                email: merchant.email,
                phone: merchant.phone,
                company_name: merchant.company_name
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
        const merchant = await MerchantModel.findByEmailOrPhone(identifier);

        if (!merchant) {
            return errorResponse(res, 'Merchant not found', null, 404);
        }

        const otp = '123456';
        await MerchantModel.storeResetOTP(merchant.id, otp);

        if (merchant.phone) await Sms.sendOTP(merchant.phone, otp);
        if (merchant.email) {
            await Mail.send({
                to: merchant.email,
                subject: 'Reset Password',
                html: `OTP: <b>${otp}</b>`
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

        const merchant = await MerchantModel.verifyOTP(identifier, otp);
        if (!merchant) return errorResponse(res, 'Invalid OTP', null, 401);

        const hashed = await bcrypt.hash(newPassword, 10);
        await MerchantModel.updatePassword(merchant.id, hashed);

        return successResponse(res, 'Password reset successful');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const logout = async (req, res) => {
    return successResponse(res, 'Logged out');
};
