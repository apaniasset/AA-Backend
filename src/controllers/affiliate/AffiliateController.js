import bcrypt from 'bcryptjs';
import { AffiliateModel } from '../../models/AffiliateModel.js';

export class AffiliateController {
    /**
     * List Affiliates
     */
    static async index(req, res) {
        try {
            const data = await AffiliateModel.findAll();
            return res.json({ success: true, message: 'Affiliate list retrieved', data: data.map(({ password, ...a }) => a) });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Create Affiliate
     */
    static async store(req, res) {
        try {
            const { password, ...data } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = await AffiliateModel.create({ ...data, password: hashedPassword, status: 'pending' });
            return res.json({ success: true, message: 'Affiliate created', data: { id } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Show Affiliate
     */
    static async show(req, res) {
        try {
            const affiliate = await AffiliateModel.findById(req.body.id);
            if (!affiliate) return res.status(404).json({ success: false, message: 'Affiliate not found', data: null });
            return res.json({ success: true, message: 'Affiliate details', data: affiliate });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Update Affiliate
     */
    static async update(req, res) {
        try {
            const { id, password, ...data } = req.body;
            if (password) data.password = await bcrypt.hash(password, 10);
            await AffiliateModel.update(id, data);
            return res.json({ success: true, message: 'Affiliate updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Delete Affiliate (Direct 3-line block)
     */
    static async destroy(req, res) {
        try {
            await AffiliateModel.delete(req.body.id);
            return res.json({ success: true, message: 'Affiliate deleted', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }
}
