import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { MerchantModel } from '../../models/MerchantModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class MerchantController {
    /**
     * Add new merchant
     */
    static async add(req: Request, res: Response) {
        try {
            const { name, email, password, phone, merchant_type } = req.body;

            if (!name || !email || !password || !merchant_type) {
                return ApiResponse.error(res, 'Required fields missing', 400);
            }

            const existingMerchant = await MerchantModel.findByEmailOrPhone(email);
            if (existingMerchant) {
                return ApiResponse.error(res, 'Email already exists', 400);
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const merchantId = await MerchantModel.create({
                ...req.body,
                password: hashedPassword,
                status: 'pending'
            });

            return ApiResponse.success(res, 'Merchant created successfully', { id: merchantId }, 201);
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to create merchant', 500);
        }
    }

    /**
     * List all merchants
     */
    static async list(req: Request, res: Response) {
        try {
            const merchants = await MerchantModel.findAll();
            const safeMerchants = merchants.map(({ password, ...m }) => m);
            return ApiResponse.success(res, 'Merchants retrieved successfully', safeMerchants);
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to retrieve merchants', 500);
        }
    }

    /**
     * Show single merchant
     */
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const merchant = await MerchantModel.findById(Number(id));

            if (!merchant) {
                return ApiResponse.error(res, 'Merchant not found', 404);
            }

            const { password, ...merchantData } = merchant;
            return ApiResponse.success(res, 'Merchant retrieved successfully', merchantData);
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to retrieve merchant', 500);
        }
    }

    /**
     * Update merchant
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }

            const updated = await MerchantModel.update(Number(id), data);
            if (!updated) {
                return ApiResponse.error(res, 'Merchant not found or no changes made', 404);
            }

            return ApiResponse.success(res, 'Merchant updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to update merchant', 500);
        }
    }

    /**
     * Delete merchant
     */
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await MerchantModel.delete(Number(id));

            if (!deleted) {
                return ApiResponse.error(res, 'Merchant not found', 404);
            }

            return ApiResponse.success(res, 'Merchant deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to delete merchant', 500);
        }
    }
}
