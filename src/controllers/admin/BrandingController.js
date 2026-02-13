export class BrandingController {
    static async index(req, res) {
        return res.json({ success: true, message: 'Branding list', data: null });
    }
    static async update(req, res) {
        return res.json({ success: true, message: 'Updated', data: null });
    }
}
