import { StateModel } from '../models/StateModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class StateController {
    static async index(req, res) {
        try {
            const data = await StateModel.findAll();
            return successResponse(res, 'States retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const id = await StateModel.create(req.body);
            return successResponse(res, 'State created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await StateModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'State not found', null, 404);
            return successResponse(res, 'State details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, ...data } = req.body;
            await StateModel.update(id, data);
            return successResponse(res, 'State updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await StateModel.delete(req.body.id);
            return successResponse(res, 'State deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
