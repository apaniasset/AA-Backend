import * as PropertyModel from '../models/property.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * List properties
 */
export const index = async (req, res) => {
    try {
        const data = await PropertyModel.findAll(req.query);
        return successResponse(res, 'Properties retrieved', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Show property details
 */
export const show = async (req, res) => {
    try {
        const id = req.body.id || req.params.id;
        const data = await PropertyModel.findById(id);

        if (!data) {
            return errorResponse(res, 'Property not found', null, 404);
        }

        return successResponse(res, 'Property details', data);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Create property
 */
export const store = async (req, res) => {
    try {
        const propertyId = await PropertyModel.generateUniqueId();

        const data = {
            title: req.body.title,
            description: req.body.description,
            type_id: req.body.type_id,
            price: req.body.price,
            address: req.body.address,
            area: req.body.area,
            beds: req.body.beds,
            baths: req.body.baths,
            city_id: req.body.city_id,
            state_id: req.body.state_id,
            property_id: propertyId,
            merchant_id: req.user.id,
            status: 'active'
        };

        const id = await PropertyModel.create(data);

        const responseData = {
            id: id,
            property_id: propertyId
        };

        return successResponse(res, 'Property created', responseData, 201);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Update property
 */
export const update = async (req, res) => {
    try {
        const id = req.body.id;
        const data = {};

        if (req.body.title) data.title = req.body.title;
        if (req.body.description) data.description = req.body.description;
        if (req.body.price) data.price = req.body.price;
        if (req.body.status) data.status = req.body.status;

        await PropertyModel.update(id, data);
        return successResponse(res, 'Property updated');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Delete property
 */
export const destroy = async (req, res) => {
    try {
        const id = req.body.id;
        await PropertyModel.remove(id);
        return successResponse(res, 'Property deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
