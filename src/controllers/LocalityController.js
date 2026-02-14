import { LocalityModel } from '../models/LocalityModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class LocalityController {
    static async index(req, res) {
        try {
            const data = await LocalityModel.findAll();
            return successResponse(res, 'Localities retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const id = await LocalityModel.create(req.body);
            return successResponse(res, 'Locality created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await LocalityModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Locality not found', null, 404);
            return successResponse(res, 'Locality details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, ...data } = req.body;
            await LocalityModel.update(id, data);
            return successResponse(res, 'Locality updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await LocalityModel.delete(req.body.id);
            return successResponse(res, 'Locality deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
