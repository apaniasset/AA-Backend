import { PropertyTypeModel } from '../models/PropertyTypeModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class PropertyTypeController {
    static async index(req, res) {
        try {
            const data = await PropertyTypeModel.findAll();
            return successResponse(res, 'Property types retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, is_active } = req.validatedBody;
            const id = await PropertyTypeModel.create({ name, is_active });
            return successResponse(res, 'Property type created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await PropertyTypeModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Property type not found', null, 404);
            return successResponse(res, 'Property type details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, is_active } = req.validatedBody;
            await PropertyTypeModel.update(id, { name, is_active });
            return successResponse(res, 'Property type updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await PropertyTypeModel.delete(req.body.id);
            return successResponse(res, 'Property type deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
