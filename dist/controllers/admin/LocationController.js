import { LocationModel } from '../../models/LocationModel.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
export class LocationController {
    // --- Countries ---
    static async listCountries(req, res) {
        try {
            const data = await LocationModel.findAllCountries();
            return ApiResponse.success(res, 'Countries retrieved', data);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to retrieve countries', 500);
        }
    }
    static async addCountry(req, res) {
        try {
            if (!req.body.name)
                return ApiResponse.error(res, 'Name is required', 400);
            const id = await LocationModel.createCountry(req.body);
            return ApiResponse.success(res, 'Country added', { id }, 201);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to add country', 500);
        }
    }
    static async updateCountry(req, res) {
        try {
            const id = Number(req.params.id);
            const updated = await LocationModel.updateCountry(id, req.body);
            if (!updated)
                return ApiResponse.error(res, 'Country not found', 404);
            return ApiResponse.success(res, 'Country updated');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to update country', 500);
        }
    }
    static async deleteCountry(req, res) {
        try {
            const id = Number(req.params.id);
            const deleted = await LocationModel.deleteCountry(id);
            if (!deleted)
                return ApiResponse.error(res, 'Country not found', 404);
            return ApiResponse.success(res, 'Country deleted');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to delete country', 500);
        }
    }
    // --- States ---
    static async listStates(req, res) {
        try {
            const data = await LocationModel.findAllStates();
            return ApiResponse.success(res, 'States retrieved', data);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to retrieve states', 500);
        }
    }
    static async addState(req, res) {
        try {
            if (!req.body.state_name || !req.body.country_id)
                return ApiResponse.error(res, 'Name and Country ID are required', 400);
            const id = await LocationModel.createState(req.body);
            return ApiResponse.success(res, 'State added', { id }, 201);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to add state', 500);
        }
    }
    static async updateState(req, res) {
        try {
            const id = Number(req.params.id);
            const updated = await LocationModel.updateState(id, req.body);
            if (!updated)
                return ApiResponse.error(res, 'State not found', 404);
            return ApiResponse.success(res, 'State updated');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to update state', 500);
        }
    }
    static async deleteState(req, res) {
        try {
            const id = Number(req.params.id);
            const deleted = await LocationModel.deleteState(id);
            if (!deleted)
                return ApiResponse.error(res, 'State not found', 404);
            return ApiResponse.success(res, 'State deleted');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to delete state', 500);
        }
    }
    // --- Cities ---
    static async listCities(req, res) {
        try {
            const data = await LocationModel.findAllCities();
            return ApiResponse.success(res, 'Cities retrieved', data);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to retrieve cities', 500);
        }
    }
    static async addCity(req, res) {
        try {
            if (!req.body.city_name || !req.body.state_id)
                return ApiResponse.error(res, 'Name and State ID are required', 400);
            const id = await LocationModel.createCity(req.body);
            return ApiResponse.success(res, 'City added', { id }, 201);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to add city', 500);
        }
    }
    static async updateCity(req, res) {
        try {
            const id = Number(req.params.id);
            const updated = await LocationModel.updateCity(id, req.body);
            if (!updated)
                return ApiResponse.error(res, 'City not found', 404);
            return ApiResponse.success(res, 'City updated');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to update city', 500);
        }
    }
    static async deleteCity(req, res) {
        try {
            const id = Number(req.params.id);
            const deleted = await LocationModel.deleteCity(id);
            if (!deleted)
                return ApiResponse.error(res, 'City not found', 404);
            return ApiResponse.success(res, 'City deleted');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to delete city', 500);
        }
    }
    // --- Areas ---
    static async listAreas(req, res) {
        try {
            const data = await LocationModel.findAllAreas();
            return ApiResponse.success(res, 'Areas retrieved', data);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to retrieve areas', 500);
        }
    }
    static async addArea(req, res) {
        try {
            if (!req.body.area_name || !req.body.city_id)
                return ApiResponse.error(res, 'Name and City ID are required', 400);
            const id = await LocationModel.createArea(req.body);
            return ApiResponse.success(res, 'Area added', { id }, 201);
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to add area', 500);
        }
    }
    static async updateArea(req, res) {
        try {
            const id = Number(req.params.id);
            const updated = await LocationModel.updateArea(id, req.body);
            if (!updated)
                return ApiResponse.error(res, 'Area not found', 404);
            return ApiResponse.success(res, 'Area updated');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to update area', 500);
        }
    }
    static async deleteArea(req, res) {
        try {
            const id = Number(req.params.id);
            const deleted = await LocationModel.deleteArea(id);
            if (!deleted)
                return ApiResponse.error(res, 'Area not found', 404);
            return ApiResponse.success(res, 'Area deleted');
        }
        catch (error) {
            return ApiResponse.error(res, 'Failed to delete area', 500);
        }
    }
}
