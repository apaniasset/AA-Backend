import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../utils/ApiResponse.js';
import { UserModel } from '../models/UserModel.js';

export class UserController {
    /**
     * Universal List (Handles filtering by role automatically)
     */
    static async index(req, res) {
        try {
            const role = req.baseUrl.split('/').pop();
            const data = await UserModel.findAll({ role });
            return successResponse(res, `${role} list retrieved`, data);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    /**
     * Universal Store (Creates user and profile if needed)
     */
    static async store(req, res) {
        try {
            const { password, role, ...data } = req.validatedBody;
            const targetRole = role || req.baseUrl.split('/').pop() || 'user';

            const hashedPassword = await bcrypt.hash(password, 10);

            const profileData = {
                company_name: data.company_name,
                rera_number: data.rera_number,
                gst_number: data.gst_number,
                referral_code: data.referral_code
            };

            const id = await UserModel.create({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: hashedPassword,
                status_id: data.status_id
            });
            await UserModel.assignRole(id, targetRole);

            if (targetRole === 'merchant') await UserModel.updateMerchantProfile(id, profileData);
            if (targetRole === 'affiliate') await UserModel.updateAffiliateProfile(id, profileData);

            return successResponse(res, 'User created successfully', { id }, 201);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    /**
     * Universal Show
     */
    static async show(req, res) {
        try {
            const user = await UserModel.findById(req.body.id);
            if (!user) return errorResponse(res, 'User not found', null, 404);

            const { password, ...safeUser } = user;
            return successResponse(res, 'User details', safeUser);
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    /**
     * Universal Update
     */
    static async update(req, res) {
        try {
            const { id, password, ...data } = req.validatedBody;
            const user = await UserModel.findById(id);
            if (!user) return errorResponse(res, 'User not found', null, 404);

            const userData = { ...data };
            if (password) userData.password = await bcrypt.hash(password, 10);

            const profileData = {
                company_name: data.company_name,
                rera_number: data.rera_number,
                gst_number: data.gst_number,
                referral_code: data.referral_code
            };

            await UserModel.update(id, userData);

            if (user.roles.includes('merchant')) await UserModel.updateMerchantProfile(id, profileData);
            if (user.roles.includes('affiliate')) await UserModel.updateAffiliateProfile(id, profileData);

            return successResponse(res, 'User updated successfully');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    /**
     * Universal Delete
     */
    static async destroy(req, res) {
        try {
            await UserModel.delete(req.body.id);
            return successResponse(res, 'User deleted successfully');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async changePassword(req, res) {
        try {
            const { id, current_password, new_password } = req.validatedBody;
            const user = await UserModel.findById(id);
            if (!user) return errorResponse(res, 'User not found', null, 404);

            const isMatch = await bcrypt.compare(current_password, user.password);
            if (!isMatch) return errorResponse(res, 'Wrong current password', null, 401);

            const hashedPassword = await bcrypt.hash(new_password, 10);
            await UserModel.updatePassword(id, hashedPassword);
            return successResponse(res, 'Password changed successfully');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }

    static async updateStatus(req, res) {
        try {
            await UserModel.update(req.body.id, { status_id: req.body.status_id });
            return successResponse(res, 'Status updated');
        } catch (e) {
            return errorResponse(res, e.message);
        }
    }
}
