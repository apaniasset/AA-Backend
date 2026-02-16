import bcrypt from 'bcryptjs';
import * as AffiliateModel from '../models/affiliate.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * List Affiliates
 */
export const index = async (req, res) => {
    try {
        const data = await AffiliateModel.findAll();

        const responseList = [];
        for (let i = 0; i < data.length; i++) {
            const a = data[i];
            const item = {
                id: a.id,
                name: a.name,
                email: a.email,
                phone: a.phone,
                referral_code: a.referral_code,
                referred_by: a.referred_by,
                status: a.status,
                created_at: a.created_at
            };
            responseList.push(item);
        }

        return successResponse(res, 'Affiliate list retrieved', responseList);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Create Affiliate
 */
export const store = async (req, res) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            referred_by: req.body.referred_by || null,
            status: 'pending',
            password: hashedPassword
        };

        const id = await AffiliateModel.create(data);
        return successResponse(res, 'Affiliate created', { id: id });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Show Affiliate
 */
export const show = async (req, res) => {
    try {
        const id = req.body.id;
        const affiliate = await AffiliateModel.findById(id);

        if (!affiliate) {
            return errorResponse(res, 'Affiliate not found', null, 404);
        }

        const data = {
            id: affiliate.id,
            name: affiliate.name,
            email: affiliate.email,
            phone: affiliate.phone,
            referral_code: affiliate.referral_code,
            referred_by: affiliate.referred_by,
            status: affiliate.status,
            created_at: affiliate.created_at
        };

        return successResponse(res, 'Affiliate details', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Update Affiliate
 */
export const update = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {};

        if (req.body.name) data.name = req.body.name;
        if (req.body.email) data.email = req.body.email;
        if (req.body.phone) data.phone = req.body.phone;
        if (req.body.referred_by !== undefined) data.referred_by = req.body.referred_by;
        if (req.body.status) data.status = req.body.status;

        if (req.body.password) {
            data.password = await bcrypt.hash(req.body.password, 10);
        }

        await AffiliateModel.update(id, data);
        return successResponse(res, 'Affiliate updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Delete Affiliate
 */
export const destroy = async (req, res) => {
    try {
        const id = req.body.id;
        await AffiliateModel.remove(id);
        return successResponse(res, 'Affiliate deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
