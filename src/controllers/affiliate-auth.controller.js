import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as AffiliateModel from '../models/affiliate.model.js';
import Sms from '../utils/Sms.js';
import Mail from '../utils/Mail.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Register Affiliate (Single Step)
 */
export const register = async (req, res) => {
    try {
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email; // Optional
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        const referral_code = req.body.referral_code;

        if (!phone || !name || !password || !confirm_password) {
            return errorResponse(res, 'Required fields missing: phone, name, password, confirm_password', null, 400);
        }

        if (password !== confirm_password) {
            return errorResponse(res, 'Passwords do not match', null, 400);
        }

        const existing = await AffiliateModel.findByPhone(phone);
        if (existing && existing.status === 'active') {
            return errorResponse(res, 'Mobile already registered', null, 400);
        }

        let referredBy = req.body.referred_by || null;
        if (referral_code) {
            const referrer = await AffiliateModel.findByReferralCode(referral_code);
            if (referrer) {
                referredBy = referrer.id;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let affiliateId;
        if (existing) {
            affiliateId = existing.id;
            const updateData = {
                name: name,
                email: email || null,
                password: hashedPassword,
                status: 'active',
                referred_by: referredBy,
                registration_otp: null,
                registration_otp_expires: null
            };
            await AffiliateModel.update(affiliateId, updateData);
        } else {
            const createData = {
                name: name,
                phone: phone,
                email: email || null,
                password: hashedPassword,
                status: 'active',
                referred_by: referredBy
            };
            affiliateId = await AffiliateModel.create(createData);
        }

        const affiliate = await AffiliateModel.findById(affiliateId);
        const token = jwt.sign({ id: affiliate.id, role: 'affiliate' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const responseData = {
            affiliate: {
                id: affiliate.id,
                name: name,
                email: email,
                phone: phone,
                referral_code: affiliate.referral_code,
                referred_by: referredBy,
                referrer_code: referral_code || null
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
                referral_code: affiliate.referral_code,
                referred_by: affiliate.referred_by,
                referrer_code: affiliate.referrer_code || null
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
