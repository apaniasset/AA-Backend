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
        const property_id = await PropertyModel.generateUniqueId();
        const merchantId = req.user.id;

        // Validation (simplified version of Laravel rules)
        if (!req.body.title || !req.body.address || !req.body.listing_type) {
            return errorResponse(res, 'Required fields missing: title, address, listing_type', null, 400);
        }

        if (req.body.construction_status === 'Under Construction') {
            if (!req.body.rera_number || !req.body.possession_date) {
                return errorResponse(res, 'RERA Number and Possession Date are required for under construction properties', null, 400);
            }
        }

        const data = {
            merchant_id: merchantId,
            property_id: property_id,
            property_id_custom: req.body.property_id_custom || null,
            title: req.body.title,
            description: req.body.description || null,
            listing_type: req.body.listing_type,
            property_main_type: req.body.property_type || null,
            property_segment: req.body.property_segment || null,

            // Address
            address_line1: req.body.address,
            city: req.body.city || null,
            city_id: req.body.city_id || null,
            locality_id: req.body.neighborhood || null,
            pincode: req.body.zip_code || null,
            location: req.body.location || null,
            area: req.body.area_name || null,
            nearby_area: Array.isArray(req.body.nearby_areas) ? req.body.nearby_areas.join(',') : '',

            // Pricing
            sale_price: req.body.sale_price || null,
            rent_price: req.body.rent_price || null,
            security_deposit: req.body.security_deposit || null,
            maintenance: req.body.maintenance || null,
            price_negotiable: req.body.price_negotiable ? 1 : 0,
            maintenance_included: req.body.maintenance_included ? 1 : 0,

            // Config
            bedrooms: req.body.bedrooms || null,
            bathrooms: req.body.bathrooms || null,
            balconies: req.body.balconies || null,
            floor_no: req.body.floor_number || null,
            floors_total: req.body.total_floors || null,
            furnishing_status: req.body.furnishing_status || null,
            facing: req.body.facing || null,
            age_of_property: req.body.property_age || null,
            property_age: req.body.property_age || null,
            possession_status: req.body.construction_status || null,
            status: 'active',

            // Under Construction
            rera_number: req.body.rera_number || null,
            construction_start_date: req.body.construction_start_date || null,
            possession_date: req.body.possession_date || null,
            no_brokerage: req.body.no_brokerage ? 1 : 0,

            // Area
            carpet_area: req.body.carpet_area || null,
            built_up_area: req.body.area || null,
            land_area: req.body.land_area || null,
            plot_length: req.body.plot_length || null,
            plot_breadth: req.body.plot_breadth || null,
            corner_plot: req.body.corner_plot || 0,
            fencing_done: req.body.fencing_done || 0,

            // PG
            pg_type: req.body.pg_type || null,
            total_beds: req.body.total_beds || null,
            available_beds: req.body.available_beds || null,
            room_type: req.body.room_type || null,
            preferred_tenants: req.body.preferred_tenants || null,
            food_facility: req.body.food_facility ? 1 : 0,

            // Commercial
            cabins: req.body.cabins || null,
            workstations: req.body.workstations || null,
            washrooms_private: req.body.washrooms_private || null,
            washrooms_shared: req.body.washrooms_shared || null,
            loading_dock: req.body.loading_dock ? 1 : 0,

            // Media
            video_url: req.body.video_url || null,
            amenities: Array.isArray(req.body.amenity) ? req.body.amenity.join(',') : ''
        };

        const id = await PropertyModel.create(data);

        // Handle Images if files are present (assuming multer/middleware)
        if (req.files) {
            // Placeholder for image storage logic if needed
        }

        return successResponse(res, 'Property successfully listed', { id, property_id }, 201);
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
