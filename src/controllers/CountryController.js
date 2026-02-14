import { CountryModel } from '../models/CountryModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class CountryController {
    static async index(req, res) {
        try {
            const data = await CountryModel.findAll();
            return successResponse(res, 'Countries retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, short_name, is_active } = req.body;
            const id = await CountryModel.create({ name, short_name, is_active });
            return successResponse(res, 'Country created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await CountryModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Country not found', null, 404);
            return successResponse(res, 'Country details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, short_name, is_active } = req.body;
            await CountryModel.update(id, { name, short_name, is_active });
            return successResponse(res, 'Country updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await CountryModel.delete(req.body.id);
            return successResponse(res, 'Country deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
