export class CommissionSettingsController {
    static async index(req, res) {
        return res.status(200).json({ success: true, code: 200, message: 'Commission settings list', data: null });
    }
    static async update(req, res) {
        return res.status(200).json({ success: true, code: 200, message: 'Updated', data: null });
    }
}
