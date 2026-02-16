import bcrypt from 'bcryptjs';
import * as MerchantModel from '../models/merchant.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * List Merchants
 */
export const index = async (req, res) => {
    try {
        const data = await MerchantModel.findAll();

        // Clean data explicitly
        const responseList = [];
        for (let i = 0; i < data.length; i++) {
            const m = data[i];
            const item = {
                id: m.id,
                name: m.name,
                email: m.email,
                phone: m.phone,
                company_name: m.company_name,
                referred_by: m.affiliate_id,
                referrer_code: m.referrer_code || null,
                status: m.status,
                created_at: m.created_at
            };
            responseList.push(item);
        }

        return successResponse(res, 'Merchants retrieved', responseList);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Create Merchant
 */
export const store = async (req, res) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            company_name: req.body.company_name,
            affiliate_id: req.body.affiliate_id || null,
            status: 'pending',
            password: hashedPassword
        };

        const id = await MerchantModel.create(data);

        const responseData = {
            id: id
        };

        return successResponse(res, 'Merchant created', responseData);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Show Merchant
 */
export const show = async (req, res) => {
    try {
        const id = req.body.id;
        const merchant = await MerchantModel.findById(id);

        if (!merchant) {
            return errorResponse(res, 'Merchant not found', null, 404);
        }

        const data = {
            id: merchant.id,
            name: merchant.name,
            email: merchant.email,
            phone: merchant.phone,
            company_name: merchant.company_name,
            referred_by: merchant.affiliate_id,
            referrer_code: merchant.referrer_code || null,
            status: merchant.status,
            created_at: merchant.created_at
        };

        return successResponse(res, 'Merchant details', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Update Merchant
 */
export const update = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {};

        if (req.body.name) data.name = req.body.name;
        if (req.body.email) data.email = req.body.email;
        if (req.body.phone) data.phone = req.body.phone;
        if (req.body.company_name) data.company_name = req.body.company_name;
        if (req.body.affiliate_id !== undefined) data.affiliate_id = req.body.affiliate_id;
        if (req.body.status) data.status = req.body.status;

        if (req.body.password) {
            data.password = await bcrypt.hash(req.body.password, 10);
        }

        await MerchantModel.update(id, data);
        return successResponse(res, 'Merchant updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Delete Merchant
 */
export const destroy = async (req, res) => {
    try {
        const id = req.body.id;
        await MerchantModel.remove(id);
        return successResponse(res, 'Merchant deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
