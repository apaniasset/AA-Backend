import { LocationModel } from '../../models/LocationModel.js';

export class LocationController {
    // --- Countries ---
    static async listCountries(req, res) {
        try {
            const data = await LocationModel.findAllCountries();
            return res.json({ success: true, message: 'Countries retrieved', data });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async addCountry(req, res) {
        try {
            const id = await LocationModel.createCountry(req.body);
            return res.json({ success: true, message: 'Country added', data: { id } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async updateCountry(req, res) {
        try {
            const { id, ...data } = req.body;
            await LocationModel.updateCountry(id, data);
            return res.json({ success: true, message: 'Country updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async deleteCountry(req, res) {
        try {
            await LocationModel.deleteCountry(req.body.id);
            return res.json({ success: true, message: 'Country deleted', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    // --- States ---
    static async listStates(req, res) {
        try {
            const data = await LocationModel.findAllStates();
            return res.json({ success: true, message: 'States retrieved', data });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async addState(req, res) {
        try {
            const id = await LocationModel.createState(req.body);
            return res.json({ success: true, message: 'State added', data: { id } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async updateState(req, res) {
        try {
            const { id, ...data } = req.body;
            await LocationModel.updateState(id, data);
            return res.json({ success: true, message: 'State updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async deleteState(req, res) {
        try {
            await LocationModel.deleteState(req.body.id);
            return res.json({ success: true, message: 'State deleted', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    // --- Cities ---
    static async listCities(req, res) {
        try {
            const data = await LocationModel.findAllCities();
            return res.json({ success: true, message: 'Cities retrieved', data });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async addCity(req, res) {
        try {
            const id = await LocationModel.createCity(req.body);
            return res.json({ success: true, message: 'City added', data: { id } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async updateCity(req, res) {
        try {
            const { id, ...data } = req.body;
            await LocationModel.updateCity(id, data);
            return res.json({ success: true, message: 'City updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async deleteCity(req, res) {
        try {
            await LocationModel.deleteCity(req.body.id);
            return res.json({ success: true, message: 'City deleted', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    // --- Areas ---
    static async listAreas(req, res) {
        try {
            const data = await LocationModel.findAllAreas();
            return res.json({ success: true, message: 'Areas retrieved', data });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async addArea(req, res) {
        try {
            const id = await LocationModel.createArea(req.body);
            return res.json({ success: true, message: 'Area added', data: { id } });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async updateArea(req, res) {
        try {
            const { id, ...data } = req.body;
            await LocationModel.updateArea(id, data);
            return res.json({ success: true, message: 'Area updated', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    static async deleteArea(req, res) {
        try {
            await LocationModel.deleteArea(req.body.id);
            return res.json({ success: true, message: 'Area deleted', data: null });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }
}
