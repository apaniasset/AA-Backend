import bcrypt from 'bcryptjs';
import * as UserModel from '../models/user.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * List Users
 */
export const index = async (req, res) => {
    try {
        const data = await UserModel.findAll();

        // Clean data explicitly
        const responseList = [];
        for (let i = 0; i < data.length; i++) {
            const u = data[i];
            const item = {
                id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                status: u.status,
                created_at: u.created_at
            };
            responseList.push(item);
        }

        return successResponse(res, 'Users retrieved', responseList);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Create User
 */
export const store = async (req, res) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword
        };

        const id = await UserModel.create(data);

        const responseData = {
            id: id
        };

        return successResponse(res, 'User created', responseData);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Show User
 */
export const show = async (req, res) => {
    try {
        const id = req.body.id;
        const user = await UserModel.findById(id);

        if (!user) {
            return errorResponse(res, 'User not found', null, 404);
        }

        const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            created_at: user.created_at
        };

        return successResponse(res, 'User details', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Update User
 */
export const update = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {};

        if (req.body.name) data.name = req.body.name;
        if (req.body.email) data.email = req.body.email;
        if (req.body.phone) data.phone = req.body.phone;
        if (req.body.status) data.status = req.body.status;

        if (req.body.password) {
            data.password = await bcrypt.hash(req.body.password, 10);
        }

        await UserModel.update(id, data);
        return successResponse(res, 'User updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Delete User
 */
export const destroy = async (req, res) => {
    try {
        const id = req.body.id;
        await UserModel.remove(id);
        return successResponse(res, 'User deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const id = req.body.id;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updatePassword(id, hashedPassword);
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

        await UserModel.update(id, data);
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

        const user = await UserModel.findById(id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return errorResponse(res, 'Wrong password', null, 401);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.updatePassword(id, hashedPassword);

        return successResponse(res, 'Password changed');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
