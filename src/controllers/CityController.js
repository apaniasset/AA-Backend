import { CityModel } from '../models/CityModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class CityController {
    static async index(req, res) {
        try {
            const data = await CityModel.findAll();
            return successResponse(res, 'Cities retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, state_id, is_active } = req.body;
            const id = await CityModel.create({ name, state_id, is_active });
            return successResponse(res, 'City created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await CityModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'City not found', null, 404);
            return successResponse(res, 'City details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, state_id, is_active } = req.body;
            await CityModel.update(id, { name, state_id, is_active });
            return successResponse(res, 'City updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await CityModel.delete(req.body.id);
            return successResponse(res, 'City deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
