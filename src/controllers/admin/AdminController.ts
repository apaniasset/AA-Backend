import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AdminModel } from '../../models/AdminModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class AdminController {
    /**
     * Add new admin
     */
    static async add(req: Request, res: Response) {
        try {
            const { name, email, password, phone, role } = req.body;

            if (!name || !email || !password) {
                return ApiResponse.error(res, 'Name, email and password are required', 400);
            }

            const adminByEmail = await AdminModel.findByEmailOrPhone(email);
            if (adminByEmail) {
                return ApiResponse.error(res, 'Email already in use', 400);
            }

            if (phone) {
                const adminByPhone = await AdminModel.findByEmailOrPhone(phone);
                if (adminByPhone) {
                    return ApiResponse.error(res, 'Phone already in use', 400);
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const adminId = await AdminModel.create({
                name,
                email,
                password: hashedPassword,
                phone,
                role: role || 'staff',
                status: 'active'
            });

            return ApiResponse.success(res, 'Admin created successfully', { id: adminId }, 201);
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to create admin', 500);
        }
    }

    /**
     * List all admins
     */
    static async list(req: Request, res: Response) {
        try {
            const admins = await AdminModel.findAll();
            return ApiResponse.success(res, 'Admins retrieved successfully', admins);
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to retrieve admins', 500);
        }
    }

    /**
     * Show single admin
     */
    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const admin = await AdminModel.findById(Number(id));

            if (!admin) {
                return ApiResponse.error(res, 'Admin not found', 404);
            }

            const { password, ...adminData } = admin;
            return ApiResponse.success(res, 'Admin retrieved successfully', adminData);
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to retrieve admin', 500);
        }
    }

    /**
     * Update admin
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }

            const updated = await AdminModel.update(Number(id), data);
            if (!updated) {
                return ApiResponse.error(res, 'Admin not found or no changes made', 404);
            }

            return ApiResponse.success(res, 'Admin updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to update admin', 500);
        }
    }

    /**
     * Delete admin
     */
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await AdminModel.delete(Number(id));

            if (!deleted) {
                return ApiResponse.error(res, 'Admin not found', 404);
            }

            return ApiResponse.success(res, 'Admin deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, 'Failed to delete admin', 500);
        }
    }
}
