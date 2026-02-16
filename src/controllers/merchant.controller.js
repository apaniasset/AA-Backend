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
                business_name: m.business_name,
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
            business_name: req.body.business_name,
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
            business_name: merchant.business_name,
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
        if (req.body.business_name) data.business_name = req.body.business_name;
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
