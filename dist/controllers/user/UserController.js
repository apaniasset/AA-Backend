import bcrypt from 'bcryptjs';
import { UserModel } from '../../models/UserModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
export class UserController {
    /**
     * Add new user
     */
    static async add(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return ApiResponse.error(res, 'Required fields missing', 400);
            }
            const existingUser = await UserModel.findByEmailOrMobile(email);
            if (existingUser) {
                return ApiResponse.error(res, 'Email already exists', 400);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await UserModel.create({
                ...req.body,
                password: hashedPassword,
                role: req.body.role || 'user'
            });
            return ApiResponse.success(res, 'User created successfully', { id: userId }, 201);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to create user', 500);
        }
    }
    /**
     * List all users
     */
    static async list(req, res) {
        try {
            const users = await UserModel.findAll();
            return ApiResponse.success(res, 'Users retrieved successfully', users);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to retrieve users', 500);
        }
    }
    /**
     * Show single user
     */
    static async show(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findById(Number(id));
            if (!user) {
                return ApiResponse.error(res, 'User not found', 404);
            }
            const { password, ...userData } = user;
            return ApiResponse.success(res, 'User retrieved successfully', userData);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to retrieve user', 500);
        }
    }
    /**
     * Update user
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }
            const updated = await UserModel.update(Number(id), data);
            if (!updated) {
                return ApiResponse.error(res, 'User not found or no changes made', 404);
            }
            return ApiResponse.success(res, 'User updated successfully');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to update user', 500);
        }
    }
    /**
     * Delete user
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await UserModel.delete(Number(id));
            if (!deleted) {
                return ApiResponse.error(res, 'User not found', 404);
            }
            return ApiResponse.success(res, 'User deleted successfully');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to delete user', 500);
        }
    }
}
