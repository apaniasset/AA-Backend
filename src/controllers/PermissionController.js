import { PermissionModel } from '../models/PermissionModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class PermissionController {
    static async index(req, res) {
        try {
            const data = await PermissionModel.findAll();
            return successResponse(res, 'Permissions retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const { name, is_active } = req.validatedBody;
            const id = await PermissionModel.create({ name, is_active });
            return successResponse(res, 'Permission created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await PermissionModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Permission not found', null, 404);
            return successResponse(res, 'Permission details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, name, is_active } = req.validatedBody;
            await PermissionModel.update(id, { name, is_active });
            return successResponse(res, 'Permission updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await PermissionModel.delete(req.body.id);
            return successResponse(res, 'Permission deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
