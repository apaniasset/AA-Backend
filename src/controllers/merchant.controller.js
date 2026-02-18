import bcrypt from 'bcryptjs';
import * as MerchantModel from '../models/merchant.model.js';
import * as MerchantLocationModel from '../models/merchant-location.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Get multiple working locations for the logged-in merchant
 */
export const getMyWorkingLocations = async (req, res) => {
    try {
        const merchantId = req.user.id;
        const data = await MerchantLocationModel.findByMerchantId(merchantId);
        return successResponse(res, 'Working locations retrieved', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Add a new working location
 */
export const addWorkingLocation = async (req, res) => {
    try {
        const merchantId = req.user.id;
        const data = {
            merchant_id: merchantId,
            state_id: req.body.state_id || null,
            city_id: req.body.city_id || null,
            city_name: req.body.city_name || null,
            area_id: req.body.area_id || null,
            area_name: req.body.area_name || null,
            pincode: req.body.pincode || null,
            country_id: req.body.country_id || null
        };

        if (!data.city_id && !data.city_name) {
            return errorResponse(res, 'City (ID or Name) is required', null, 400);
        }

        const id = await MerchantLocationModel.create(data);
        return successResponse(res, 'Working location added', { id }, 201);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Update a working location
 */
export const updateWorkingLocation = async (req, res) => {
    try {
        const id = req.body.id || req.params.id;
        const merchantId = req.user.id;

        const existing = await MerchantLocationModel.findById(id, merchantId);
        if (!existing) return errorResponse(res, 'Location not found', null, 404);

        const data = {};
        if (req.body.state_id) data.state_id = req.body.state_id;
        if (req.body.city_id) data.city_id = req.body.city_id;
        if (req.body.city_name) data.city_name = req.body.city_name;
        if (req.body.area_id) data.area_id = req.body.area_id;
        if (req.body.area_name) data.area_name = req.body.area_name;
        if (req.body.pincode) data.pincode = req.body.pincode;
        if (req.body.country_id) data.country_id = req.body.country_id;

        await MerchantLocationModel.update(id, merchantId, data);
        return successResponse(res, 'Working location updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Delete a working location
 */
export const deleteWorkingLocation = async (req, res) => {
    try {
        const id = req.body.id || req.params.id;
        const merchantId = req.user.id;

        const deleted = await MerchantLocationModel.remove(id, merchantId);
        if (!deleted) return errorResponse(res, 'Location not found or unauthorized', null, 404);

        return successResponse(res, 'Working location deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

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
