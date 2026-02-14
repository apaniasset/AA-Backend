import { RoleModel } from '../models/RoleModel.js';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';

export class RoleController {
    static async index(req, res) {
        try {
            const data = await RoleModel.findAll();
            return successResponse(res, 'Roles retrieved', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async store(req, res) {
        try {
            const id = await RoleModel.create(req.validatedBody);
            return successResponse(res, 'Role created', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async show(req, res) {
        try {
            const data = await RoleModel.findById(req.body.id);
            if (!data) return errorResponse(res, 'Role not found', null, 404);
            return successResponse(res, 'Role details', data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async update(req, res) {
        try {
            const { id, ...data } = req.validatedBody;
            await RoleModel.update(id, data);
            return successResponse(res, 'Role updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async destroy(req, res) {
        try {
            await RoleModel.delete(req.body.id);
            return successResponse(res, 'Role deleted');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
