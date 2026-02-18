import * as Country from '../models/country.model.js';
import * as State from '../models/state.model.js';
import * as City from '../models/city.model.js';
import * as Location from '../models/location.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

// --- Utils ---
const handleCRUD = async (res, action, message) => {
    try {
        const data = await action();
        return successResponse(res, message, data);
    } catch (e) {
        return errorResponse(res, e.message);
    }
};

// --- Countries ---
export const getCountries = (req, res) => handleCRUD(res, () => Country.getAll(), 'Countries fetched');
export const createCountry = (req, res) => handleCRUD(res, () => Country.create(req.body), 'Country created');
export const updateCountry = (req, res) => handleCRUD(res, () => Country.update(req.params.id, req.body), 'Country updated');
export const deleteCountry = (req, res) => handleCRUD(res, () => Country.destroy(req.params.id), 'Country deleted');

// --- States ---
export const getStates = (req, res) => handleCRUD(res, () => State.getAll(), 'States fetched');
export const getStatesByCountry = (req, res) => handleCRUD(res, () => State.getByCountryId(req.params.countryId), 'States fetched');
export const createState = (req, res) => handleCRUD(res, () => State.create(req.body), 'State created');
export const updateState = (req, res) => handleCRUD(res, () => State.update(req.params.id, req.body), 'State updated');
export const deleteState = (req, res) => handleCRUD(res, () => State.destroy(req.params.id), 'State deleted');

// --- Cities ---
export const getCities = (req, res) => handleCRUD(res, () => City.getAll(), 'Cities fetched');
export const getCitiesByState = (req, res) => handleCRUD(res, () => City.getByStateId(req.params.stateId), 'Cities fetched');
export const createCity = (req, res) => handleCRUD(res, () => City.create(req.body), 'City created');
export const updateCity = (req, res) => handleCRUD(res, () => City.update(req.params.id, req.body), 'City updated');
export const deleteCity = (req, res) => handleCRUD(res, () => City.destroy(req.params.id), 'City deleted');

// --- Locations ---
export const getLocations = (req, res) => handleCRUD(res, () => Location.getAll(), 'Locations fetched');
export const getLocationsByCity = (req, res) => handleCRUD(res, () => Location.getByCityId(req.params.cityId), 'Locations fetched');
export const createLocation = (req, res) => handleCRUD(res, () => Location.create(req.body), 'Location created');
export const updateLocation = (req, res) => handleCRUD(res, () => Location.update(req.params.id, req.body), 'Location updated');
export const deleteLocation = (req, res) => handleCRUD(res, () => Location.destroy(req.params.id), 'Location deleted');
