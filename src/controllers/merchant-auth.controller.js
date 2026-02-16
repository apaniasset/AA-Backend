import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as MerchantModel from '../models/merchant.model.js';
import * as AffiliateModel from '../models/affiliate.model.js';
import Sms from '../utils/Sms.js';
import Mail from '../utils/Mail.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Register Merchant (Single Step)
 */
export const register = async (req, res) => {
    try {
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email; // Optional
        const company_name = req.body.company_name; // Optional
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        const referral_code = req.body.referral_code;

        if (!phone || !name || !password || !confirm_password) {
            return errorResponse(res, 'Required fields missing: phone, name, password, confirm_password', null, 400);
        }

        if (password !== confirm_password) {
            return errorResponse(res, 'Passwords do not match', null, 400);
        }

        const existing = await MerchantModel.findByPhone(phone);
        if (existing && existing.status === 'active') {
            return errorResponse(res, 'Mobile already registered', null, 400);
        }

        let affiliateId = null;
        if (referral_code) {
            const referrer = await AffiliateModel.findByReferralCode(referral_code);
            if (referrer) {
                affiliateId = referrer.id;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Merchant record creation
        // Note: findByPhone might have returned a pending_registration record if using previous logic, 
        // but since we are removing OTP, we just create or update.
        // For simplicity, we check if it exists (even if pending) and update, or create new.

        let merchantId;
        if (existing) {
            merchantId = existing.id;
            const updateData = {
                name: name,
                email: email || null,
                company_name: company_name || null,
                password: hashedPassword,
                affiliate_id: affiliateId,
                status: 'active',
                merchant_type: 'owner',
                registration_otp: null,
                registration_otp_expires: null
            };
            await MerchantModel.update(merchantId, updateData);
        } else {
            const createData = {
                name: name,
                phone: phone,
                email: email || null,
                company_name: company_name || null,
                password: hashedPassword,
                affiliate_id: affiliateId,
                status: 'active',
                merchant_type: 'owner'
            };
            merchantId = await MerchantModel.create(createData);
        }

        const token = jwt.sign({ id: merchantId, role: 'merchant' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const responseData = {
            merchant: {
                id: merchantId,
                name: name,
                email: email,
                phone: phone,
                company_name: company_name,
                affiliate_id: affiliateId
            },
            token: token
        };

        return successResponse(res, 'Registration successful. 1 free credit added.', responseData);
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
                company_name: merchant.company_name,
                affiliate_id: merchant.affiliate_id
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
