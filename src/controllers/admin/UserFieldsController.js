export class UserFieldsController {
    static async index(req, res) {
        return res.status(200).json({ success: true, code: 200, message: 'User fields list', data: null });
    }
    static async update(req, res) {
        return res.status(200).json({ success: true, code: 200, message: 'Updated', data: null });
    }
}
