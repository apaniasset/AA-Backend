import bcrypt from 'bcryptjs';
import { MerchantModel } from '../../models/MerchantModel.js';

export class MerchantController {
    /**
     * List Merchants
     */
    static async index(req, res) {
        try {
            const data = await MerchantModel.findAll();
            return res.json({ success: true, message: 'Merchants retrieved', data: data.map(({ password, ...m }) => m) });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Create Merchant
     */
    static async store(req, res) {
        try {
            const { password, ...data } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = await MerchantModel.create({ ...data, password: hashedPassword, status: 'pending' });
            return res.json({ success: true, message: 'Merchant created', data: { id } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Show Merchant
     */
    static async show(req, res) {
        try {
            const merchant = await MerchantModel.findById(req.body.id);
            if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found', data: null });
            return res.json({ success: true, message: 'Merchant details', data: merchant });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Update Merchant
     */
    static async update(req, res) {
        try {
            const { id, password, ...data } = req.body;
            if (password) data.password = await bcrypt.hash(password, 10);
            await MerchantModel.update(id, data);
            return res.json({ success: true, message: 'Merchant updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    /**
     * Delete Merchant (Direct 3-line Senior Way)
     */
    static async destroy(req, res) {
        try {
            await MerchantModel.delete(req.body.id);
            return res.json({ success: true, message: 'Merchant deleted', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }
}
