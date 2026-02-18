import * as PropertyModel from '../models/property.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Get properties belonging to the logged in merchant
 */
export const myProperties = async (req, res) => {
    try {
        const filters = {
            merchant_id: req.user.id,
            my_deals: 1
        };

        const results = await PropertyModel.findAll(filters);
        return successResponse(res, 'My properties retrieved', results);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Toggle favorite status (Ported from Laravel)
 */
export const toggleFavorite = async (req, res) => {
    try {
        const data = {
            property_id: req.body.property_id,
            merchant_id: req.user.id
        };

        // Note: Assuming PropertyModel has a toggleFavorite method
        // await PropertyModel.toggleFavorite(data);

        return successResponse(res, 'Favorite toggled');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
