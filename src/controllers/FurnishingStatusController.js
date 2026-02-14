import { FurnishingStatusModel } from '../models/FurnishingStatusModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class FurnishingStatusController {
    static async index(req, res) {
        try {
            const data = await FurnishingStatusModel.findAll();
            return successResponse(res, 'Furnishing statuses retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, is_active } = req.validatedBody;
            const id = await FurnishingStatusModel.create({ name, is_active });
            return successResponse(res, 'Furnishing status created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await FurnishingStatusModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Furnishing status not found', null, 404);
            return successResponse(res, 'Furnishing status details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, is_active } = req.validatedBody;
            await FurnishingStatusModel.update(id, { name, is_active });
            return successResponse(res, 'Furnishing status updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await FurnishingStatusModel.delete(req.body.id);
            return successResponse(res, 'Furnishing status deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
