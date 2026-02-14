import { SubLocalityModel } from '../models/SubLocalityModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class SubLocalityController {
    static async index(req, res) {
        try {
            const data = await SubLocalityModel.findAll();
            return successResponse(res, 'Sub-localities retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, locality_id, is_active } = req.body;
            const id = await SubLocalityModel.create({ name, locality_id, is_active });
            return successResponse(res, 'Sub-locality created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await SubLocalityModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Sub-locality not found', null, 404);
            return successResponse(res, 'Sub-locality details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, locality_id, is_active } = req.body;
            await SubLocalityModel.update(id, { name, locality_id, is_active });
            return successResponse(res, 'Sub-locality updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await SubLocalityModel.delete(req.body.id);
            return successResponse(res, 'Sub-locality deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
