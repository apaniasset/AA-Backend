import { ListingTypeModel } from '../models/ListingTypeModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class ListingTypeController {
    static async index(req, res) {
        try {
            const data = await ListingTypeModel.findAll();
            return successResponse(res, 'Listing types retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, is_active } = req.validatedBody;
            const id = await ListingTypeModel.create({ name, is_active });
            return successResponse(res, 'Listing type created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await ListingTypeModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Listing type not found', null, 404);
            return successResponse(res, 'Listing type details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, is_active } = req.validatedBody;
            await ListingTypeModel.update(id, { name, is_active });
            return successResponse(res, 'Listing type updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await ListingTypeModel.delete(req.body.id);
            return successResponse(res, 'Listing type deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
