import bcrypt from 'bcryptjs';
import * as AdminModel from '../models/admin.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * List Admins
 */
export const index = async (req, res) => {
    try {
        const data = await AdminModel.findAll();
        return successResponse(res, 'Admin list', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Create Admin
 */
export const store = async (req, res) => {
    try {
        const password = req.body.password;
        const hashed = await bcrypt.hash(password, 10);

        const data = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashed,
            role: req.body.role || 'staff',
            status: 'active'
        };

        const id = await AdminModel.create(data);
        return successResponse(res, 'Admin created', { id: id });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Show Admin
 */
export const show = async (req, res) => {
    try {
        const admin = await AdminModel.findById(req.body.id);
        if (!admin) {
            return errorResponse(res, 'Admin not found', null, 404);
        }

        const data = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
            status: admin.status,
            last_login: admin.last_login,
            created_at: admin.created_at
        };

        return successResponse(res, 'Admin details', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Update Admin
 */
export const update = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {};

        if (req.body.name) data.name = req.body.name;
        if (req.body.email) data.email = req.body.email;
        if (req.body.phone) data.phone = req.body.phone;
        if (req.body.role) data.role = req.body.role;
        if (req.body.status) data.status = req.body.status;

        if (req.body.password) {
            data.password = await bcrypt.hash(req.body.password, 10);
        }

        await AdminModel.update(id, data);
        return successResponse(res, 'Admin updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Delete Admin
 */
export const destroy = async (req, res) => {
    try {
        const id = req.body.id;
        await AdminModel.remove(id);
        return successResponse(res, 'Admin deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const id = req.body.id;
        const password = req.body.password;
        const hashed = await bcrypt.hash(password, 10);

        await AdminModel.updatePassword(id, hashed);
        return successResponse(res, 'Password reset successful');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const updateStatus = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {
            status: req.body.status
        };

        await AdminModel.update(id, data);
        return successResponse(res, 'Status updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const changePassword = async (req, res) => {
    try {
        const id = req.body.id;
        const currentPassword = req.body.current_password;
        const newPassword = req.body.new_password;

        const admin = await AdminModel.findById(id);
        const isMatch = await bcrypt.compare(currentPassword, admin.password);

        if (!isMatch) {
            return errorResponse(res, 'Wrong current password', null, 401);
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await AdminModel.updatePassword(id, hashed);

        return successResponse(res, 'Password changed successfully');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
