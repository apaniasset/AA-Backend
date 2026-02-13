import bcrypt from 'bcryptjs';
import { AdminModel } from '../../models/AdminModel.js';

export class AdminController {
    /**
     * List Admins
     */
    static async index(req, res) {
        try {
            const data = await AdminModel.findAll();
            return res.json({ success: true, message: 'Admin list', data });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Create Admin
     */
    static async store(req, res) {
        try {
            const { password, ...data } = req.body;
            const hashed = await bcrypt.hash(password, 10);
            const id = await AdminModel.create({ ...data, password: hashed, role: data.role || 'staff', status: 'active' });
            return res.json({ success: true, message: 'Admin created', data: { id } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Show Admin
     */
    static async show(req, res) {
        try {
            const admin = await AdminModel.findById(req.body.id);
            if (!admin) return res.status(404).json({ success: false, message: 'Admin not found', data: null });
            const { password, ...data } = admin;
            return res.json({ success: true, message: 'Admin details', data });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Update Admin
     */
    static async update(req, res) {
        try {
            const { id, password, ...data } = req.body;
            if (password) data.password = await bcrypt.hash(password, 10);
            await AdminModel.update(id, data);
            return res.json({ success: true, message: 'Admin updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Delete Admin (Direct 3-line block)
     */
    static async destroy(req, res) {
        try {
            await AdminModel.delete(req.body.id);
            return res.json({ success: true, message: 'Admin deleted', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { id, password } = req.body;
            const hashed = await bcrypt.hash(password, 10);
            await AdminModel.updatePassword(id, hashed);
            return res.json({ success: true, message: 'Password reset successful', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async updateStatus(req, res) {
        try {
            await AdminModel.update(req.body.id, { status: req.body.status });
            return res.json({ success: true, message: 'Status updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async changePassword(req, res) {
        try {
            const { id, current_password, new_password } = req.body;
            const admin = await AdminModel.findById(id);
            const isMatch = await bcrypt.compare(current_password, admin.password);
            if (!isMatch) return res.status(401).json({ success: false, code: 401, message: 'Wrong current password' });

            const hashed = await bcrypt.hash(new_password, 10);
            await AdminModel.updatePassword(id, hashed);
            return res.json({ success: true, message: 'Password changed successfully', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }
}
