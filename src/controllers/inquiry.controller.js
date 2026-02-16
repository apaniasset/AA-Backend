import * as InquiryModel from '../models/inquiry.model.js';
import * as PropertyModel from '../models/property.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Store inquiry
 */
export const store = async (req, res) => {
    try {
        const property = await PropertyModel.findById(req.body.property_id);
        if (!property) {
            return errorResponse(res, 'Property not found', null, 404);
        }

        const data = {
            property_id: property.id,
            merchant_id: property.merchant_id,
            user_id: req.user ? req.user.id : null,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.comment,
            inquiry_type: 'general',
            status: 'pending'
        };

        const id = await InquiryModel.create(data);

        const responseData = {
            id: id
        };

        return successResponse(res, 'Your inquiry has been sent successfully!', responseData);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Log property view
 */
export const logView = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;

        // Port logic: Skip if logged in (per Laravel code)
        if (req.user) {
            return successResponse(res, 'Authenticated user, skipping view log');
        }

        const property = await PropertyModel.findById(propertyId);
        if (!property) {
            return errorResponse(res, 'Property not found', null, 404);
        }

        const data = {
            property_id: property.id,
            merchant_id: property.merchant_id,
            user_id: null
        };

        await InquiryModel.logView(data);

        return successResponse(res, 'View logged');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
