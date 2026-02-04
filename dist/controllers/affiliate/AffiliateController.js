import bcrypt from 'bcryptjs';
import { AffiliateModel } from '../../models/AffiliateModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
export class AffiliateController {
    /**
     * Add new affiliate
     */
    static async add(req, res) {
        try {
            const { name, email, password, referral_code } = req.body;
            if (!name || !email || !password || !referral_code) {
                return ApiResponse.error(res, 'Required fields missing', 400);
            }
            const existingAffiliate = await AffiliateModel.findByEmailOrPhone(email);
            if (existingAffiliate) {
                return ApiResponse.error(res, 'Email already exists', 400);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const affiliateId = await AffiliateModel.create({
                ...req.body,
                password: hashedPassword,
                status: 'pending'
            });
            return ApiResponse.success(res, 'Affiliate created successfully', { id: affiliateId }, 201);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to create affiliate', 500);
        }
    }
    /**
     * List all affiliates
     */
    static async list(req, res) {
        try {
            const affiliates = await AffiliateModel.findAll();
            const safeAffiliates = affiliates.map(({ password, ...a }) => a);
            return ApiResponse.success(res, 'Affiliates retrieved successfully', safeAffiliates);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to retrieve affiliates', 500);
        }
    }
    /**
     * Show single affiliate
     */
    static async show(req, res) {
        try {
            const { id } = req.params;
            const affiliate = await AffiliateModel.findById(Number(id));
            if (!affiliate) {
                return ApiResponse.error(res, 'Affiliate not found', 404);
            }
            const { password, ...affiliateData } = affiliate;
            return ApiResponse.success(res, 'Affiliate retrieved successfully', affiliateData);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to retrieve affiliate', 500);
        }
    }
    /**
     * Update affiliate
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }
            const updated = await AffiliateModel.update(Number(id), data);
            if (!updated) {
                return ApiResponse.error(res, 'Affiliate not found or no changes made', 404);
            }
            return ApiResponse.success(res, 'Affiliate updated successfully');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to update affiliate', 500);
        }
    }
    /**
     * Delete affiliate
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await AffiliateModel.delete(Number(id));
            if (!deleted) {
                return ApiResponse.error(res, 'Affiliate not found', 404);
            }
            return ApiResponse.success(res, 'Affiliate deleted successfully');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to delete affiliate', 500);
        }
    }
}
