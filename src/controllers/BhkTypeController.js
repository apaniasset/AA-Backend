import { BhkTypeModel } from '../models/BhkTypeModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class BhkTypeController {
    static async index(req, res) {
        try {
            const data = await BhkTypeModel.findAll();
            return successResponse(res, 'BHK types retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, is_active } = req.validatedBody;
            const id = await BhkTypeModel.create({ name, is_active });
            return successResponse(res, 'BHK type created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await BhkTypeModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'BHK type not found', null, 404);
            return successResponse(res, 'BHK type details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, is_active } = req.validatedBody;
            await BhkTypeModel.update(id, { name, is_active });
            return successResponse(res, 'BHK type updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await BhkTypeModel.delete(req.body.id);
            return successResponse(res, 'BHK type deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
