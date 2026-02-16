import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as AffiliateModel from '../models/affiliate.model.js';
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

        const existing = await AffiliateModel.findByPhone(phone);
        if (existing && existing.status === 'active') {
            return errorResponse(res, 'Mobile already registered', null, 400);
        }

        const otp = '123456'; // demo
        await AffiliateModel.storeRegistrationOTP(phone, otp);
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
 * Step 2: Complete Profile (Matches Laravel logic + Referral)
 */
export const completeRegistration = async (req, res) => {
    try {
        const phone = req.body.phone;
        const otp = req.body.otp;
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const referrerCode = req.body.referrer_code;

        if (!phone || !otp || !name || !email || !password) {
            return errorResponse(res, 'All fields required', null, 400);
        }

        const affiliate = await AffiliateModel.verifyRegistrationOTP(phone, otp);
        if (!affiliate) {
            return errorResponse(res, 'Invalid or expired OTP', null, 401);
        }

        let referredBy = null;
        if (referrerCode) {
            const referrer = await AffiliateModel.findByReferralCode(referrerCode);
            if (referrer) {
                referredBy = referrer.id;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            name: name,
            email: email,
            password: hashedPassword,
            status: 'active',
            referred_by: referredBy,
            registration_otp: null,
            registration_otp_expires: null
        };

        await AffiliateModel.update(affiliate.id, data);

        const token = jwt.sign({ id: affiliate.id, role: 'affiliate' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const responseData = {
            affiliate: {
                id: affiliate.id,
                name,
                email,
                phone,
                referral_code: affiliate.referral_code
            },
            token: token
        };

        return successResponse(res, 'Registration complete', responseData);
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
            return errorResponse(res, 'Required fields missing', null, 400);
        }

        const affiliate = await AffiliateModel.findByEmailOrPhone(identifier);
        if (!affiliate || affiliate.status !== 'active') {
            return errorResponse(res, 'Invalid credentials', null, 401);
        }

        const isMatch = await bcrypt.compare(password, affiliate.password || '');
        if (!isMatch && password !== affiliate.password) {
            return errorResponse(res, 'Invalid credentials', null, 401);
        }

        const token = jwt.sign({ id: affiliate.id, role: 'affiliate' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        await AffiliateModel.updateLastLogin(affiliate.id);

        const responseData = {
            affiliate: {
                id: affiliate.id,
                name: affiliate.name,
                email: affiliate.email,
                phone: affiliate.phone,
                referral_code: affiliate.referral_code
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
        const affiliate = await AffiliateModel.findByEmailOrPhone(identifier);

        if (!affiliate) {
            return errorResponse(res, 'Affiliate not found', null, 404);
        }

        const otp = '123456';
        await AffiliateModel.storeResetOTP(affiliate.id, otp);

        if (affiliate.phone) await Sms.sendOTP(affiliate.phone, otp);
        if (affiliate.email) {
            await Mail.send({
                to: affiliate.email,
                subject: 'Reset Password',
                html: `OTP: <b>${otp}</b>`
            });
        }

        return successResponse(res, 'OTP sent to mobile and email', { otp });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const identifier = req.body.identifier;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword;

        const affiliate = await AffiliateModel.verifyOTP(identifier, otp);
        if (!affiliate) return errorResponse(res, 'Invalid OTP', null, 401);

        const hashed = await bcrypt.hash(newPassword, 10);
        await AffiliateModel.updatePassword(affiliate.id, hashed);

        return successResponse(res, 'Password updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const logout = async (req, res) => {
    return successResponse(res, 'Logged out');
};
