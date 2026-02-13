import bcrypt from 'bcryptjs';
import { UserModel } from '../../models/UserModel.js';

export class UserController {
    /**
     * List Users
     */
    static async index(req, res) {
        try {
            const data = await UserModel.findAll();
            return res.json({ success: true, message: 'Users retrieved', data });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Create User
     */
    static async store(req, res) {
        try {
            const { password, ...data } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = await UserModel.create({ ...data, password: hashedPassword });
            return res.json({ success: true, message: 'User created', data: { id } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Show User
     */
    static async show(req, res) {
        try {
            const user = await UserModel.findById(req.body.id);
            if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });
            return res.json({ success: true, message: 'User details', data: user });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Update User
     */
    static async update(req, res) {
        try {
            const { id, password, ...data } = req.body;
            if (password) data.password = await bcrypt.hash(password, 10);
            await UserModel.update(id, data);
            return res.json({ success: true, message: 'User updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Minimalist Delete (The "Direct" Way)
     */
    static async destroy(req, res) {
        try {
            await UserModel.delete(req.body.id);
            return res.json({ success: true, message: 'User deleted', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { id, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            await UserModel.updatePassword(id, hashedPassword);
            return res.json({ success: true, message: 'Password reset successful', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async updateStatus(req, res) {
        try {
            await UserModel.update(req.body.id, { status: req.body.status });
            return res.json({ success: true, message: 'Status updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async changePassword(req, res) {
        try {
            const { id, current_password, new_password } = req.body;
            const user = await UserModel.findById(id);
            const isMatch = await bcrypt.compare(current_password, user.password);
            if (!isMatch) return res.status(401).json({ success: false, code: 401, message: 'Wrong password' });

            const hashedPassword = await bcrypt.hash(new_password, 10);
            await UserModel.updatePassword(id, hashedPassword);
            return res.json({ success: true, message: 'Password changed', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message, data: null });
        }
    }
}
