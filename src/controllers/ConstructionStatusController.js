import { ConstructionStatusModel } from '../models/ConstructionStatusModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class ConstructionStatusController {
    static async index(req, res) {
        try {
            const data = await ConstructionStatusModel.findAll();
            return successResponse(res, 'Construction statuses retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, is_active } = req.validatedBody;
            const id = await ConstructionStatusModel.create({ name, is_active });
            return successResponse(res, 'Construction status created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await ConstructionStatusModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Construction status not found', null, 404);
            return successResponse(res, 'Construction status details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, is_active } = req.validatedBody;
            await ConstructionStatusModel.update(id, { name, is_active });
            return successResponse(res, 'Construction status updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await ConstructionStatusModel.delete(req.body.id);
            return successResponse(res, 'Construction status deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
