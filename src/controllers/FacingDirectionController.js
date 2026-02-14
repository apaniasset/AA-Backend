import { FacingDirectionModel } from '../models/FacingDirectionModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class FacingDirectionController {
    static async index(req, res) {
        try {
            const data = await FacingDirectionModel.findAll();
            return successResponse(res, 'Facing directions retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, is_active } = req.validatedBody;
            const id = await FacingDirectionModel.create({ name, is_active });
            return successResponse(res, 'Facing direction created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await FacingDirectionModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Facing direction not found', null, 404);
            return successResponse(res, 'Facing direction details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, is_active } = req.validatedBody;
            await FacingDirectionModel.update(id, { name, is_active });
            return successResponse(res, 'Facing direction updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await FacingDirectionModel.delete(req.body.id);
            return successResponse(res, 'Facing direction deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
