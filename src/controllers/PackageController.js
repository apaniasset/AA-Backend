import { PackageModel } from '../models/PackageModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class PackageController {
    static async index(req, res) {
        try {
            const data = await PackageModel.findAll();
            return successResponse(res, 'Packages retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, price, duration_days, listing_limit, featured_limit, is_active } = req.validatedBody;
            const id = await PackageModel.create({ name, price, duration_days, listing_limit, featured_limit, is_active });
            return successResponse(res, 'Package created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await PackageModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Package not found', null, 404);
            return successResponse(res, 'Package details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, price, duration_days, listing_limit, featured_limit, is_active } = req.validatedBody;
            await PackageModel.update(id, { name, price, duration_days, listing_limit, featured_limit, is_active });
            return successResponse(res, 'Package updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await PackageModel.delete(req.body.id);
            return successResponse(res, 'Package deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
