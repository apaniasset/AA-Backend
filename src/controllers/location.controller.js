import * as LocationModel from '../models/location.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

// --- Countries ---
export const listCountries = async (req, res) => {
    try {
        const data = await LocationModel.findAllCountries();
        return successResponse(res, 'Countries retrieved', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const addCountry = async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            code: req.body.code,
            status: req.body.status
        };

        const id = await LocationModel.createCountry(data);
        return successResponse(res, 'Country added', { id: id });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const updateCountry = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {};
        if (req.body.name) data.name = req.body.name;
        if (req.body.code) data.code = req.body.code;
        if (req.body.status) data.status = req.body.status;

        await LocationModel.updateCountry(id, data);
        return successResponse(res, 'Country updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const deleteCountry = async (req, res) => {
    try {
        const id = req.body.id;
        await LocationModel.deleteCountry(id);
        return successResponse(res, 'Country deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

// --- States ---
export const listStates = async (req, res) => {
    try {
        const data = await LocationModel.findAllStates();
        return successResponse(res, 'States retrieved', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const addState = async (req, res) => {
    try {
        const data = {
            country_id: req.body.country_id,
            name: req.body.name,
            status: req.body.status
        };

        const id = await LocationModel.createState(data);
        return successResponse(res, 'State added', { id: id });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const updateState = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {};
        if (req.body.country_id) data.country_id = req.body.country_id;
        if (req.body.name) data.name = req.body.name;
        if (req.body.status) data.status = req.body.status;

        await LocationModel.updateState(id, data);
        return successResponse(res, 'State updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const deleteState = async (req, res) => {
    try {
        const id = req.body.id;
        await LocationModel.deleteState(id);
        return successResponse(res, 'State deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

// --- Cities ---
export const listCities = async (req, res) => {
    try {
        const data = await LocationModel.findAllCities();
        return successResponse(res, 'Cities retrieved', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const addCity = async (req, res) => {
    try {
        const data = {
            state_id: req.body.state_id,
            city_name: req.body.city_name,
            status: req.body.status
        };

        const id = await LocationModel.createCity(data);
        return successResponse(res, 'City added', { id: id });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const updateCity = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {};
        if (req.body.state_id) data.state_id = req.body.state_id;
        if (req.body.city_name) data.city_name = req.body.city_name;
        if (req.body.status) data.status = req.body.status;

        await LocationModel.updateCity(id, data);
        return successResponse(res, 'City updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const deleteCity = async (req, res) => {
    try {
        const id = req.body.id;
        await LocationModel.deleteCity(id);
        return successResponse(res, 'City deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

// --- Areas ---
export const listAreas = async (req, res) => {
    try {
        const data = await LocationModel.findAllAreas();
        return successResponse(res, 'Areas retrieved', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const addArea = async (req, res) => {
    try {
        const data = {
            city_id: req.body.city_id,
            area_name: req.body.area_name,
            status: req.body.status
        };

        const id = await LocationModel.createArea(data);
        return successResponse(res, 'Area added', { id: id });
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const updateArea = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {};
        if (req.body.city_id) data.city_id = req.body.city_id;
        if (req.body.area_name) data.area_name = req.body.area_name;
        if (req.body.status) data.status = req.body.status;

        await LocationModel.updateArea(id, data);
        return successResponse(res, 'Area updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

export const deleteArea = async (req, res) => {
    try {
        const id = req.body.id;
        await LocationModel.deleteArea(id);
        return successResponse(res, 'Area deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
