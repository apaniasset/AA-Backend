import { StatusModel } from '../models/StatusModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class StatusController {
    static async index(req, res) {
        try {
            const data = await StatusModel.findAll();
            return successResponse(res, 'Statuses retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const id = await StatusModel.create(req.validatedBody);
            return successResponse(res, 'Status created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await StatusModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Status not found', null, 404);
            return successResponse(res, 'Status details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, ...data } = req.validatedBody;
            await StatusModel.update(id, data);
            return successResponse(res, 'Status updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await StatusModel.delete(req.body.id);
            return successResponse(res, 'Status deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
