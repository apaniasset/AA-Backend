export class CustomFieldsController {
    static async index(req, res) {
        return res.status(200).json({ success: true, code: 200, message: 'List', data: null });
    }
    static async store(req, res) {
        return res.status(201).json({ success: true, code: 201, message: 'Created', data: null });
    }
    static async show(req, res) {
        return res.status(200).json({ success: true, code: 200, message: 'Show', data: { id: req.body.id } });
    }
    static async update(req, res) {
        return res.status(200).json({ success: true, code: 200, message: 'Updated', data: null });
    }
    static async destroy(req, res) {
        return res.status(200).json({ success: true, code: 200, message: 'Deleted', data: null });
    }
}
