import * as PropertyModel from '../models/property.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * List properties
 */
export const index = async (req, res) => {
    try {
        const filters = { ...req.query };

        if (filters.my_deals && req.user) {
            if (req.user.role === 'user') filters.user_id = req.user.id;
            else if (req.user.role === 'merchant') filters.merchant_id = req.user.id;
            else if (req.user.role === 'admin') filters.admin_id = req.user.id;
        }

        const data = await PropertyModel.findAll(filters);
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
        const loggedId = req.user.id;
        const role = req.user.role;

        // No strict validation for user - just allow posting

        const data = {
            property_id: property_id,
            property_id_custom: req.body.property_id_custom || null,
            title: req.body.title || 'Untitled Property',
            description: req.body.description || null,
            listing_type: req.body.listing_type || 'Sale',
            property_main_type: req.body.property_type || null,
            property_segment: req.body.property_segment || null,

            // Address
            address_line1: req.body.address || '',
            pincode: req.body.zip_code || null,
            location: req.body.location || null,
            area: req.body.area_name || null,
            nearby_area: Array.isArray(req.body.nearby_areas) ? req.body.nearby_areas.join(',') : (req.body.nearby_area || ''),

            // Location IDs (Master Tables)
            city_id: req.body.city_id || null,
            state_id: req.body.state_id || null,
            country_id: req.body.country_id || null,
            locality_id: req.body.neighborhood || req.body.locality_id || null,

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
            status: (role === 'admin') ? 'active' : 'pending', // Admins can auto-approve
            merchant_id: 0, // Default to 0 if not a merchant to satisfy DB NOT NULL

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

        // Populate correct ID column based on role
        if (role === 'user') data.user_id = loggedId;
        else if (role === 'merchant') data.merchant_id = loggedId;
        else if (role === 'admin') data.admin_id = loggedId;

        const id = await PropertyModel.create(data);

        return successResponse(res, `Property successfully listed. Status: ${data.status}`, { id, property_id }, 201);
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};

/**
 * Update property
 */
export const update = async (req, res) => {
    try {
        const id = req.body.id || req.params.id;
        const property = await PropertyModel.findById(id);

        if (!property) return errorResponse(res, 'Property not found', null, 404);

        // Permission check: Admin or Owner
        const isOwner = (req.user.role === 'user' && property.user_id === req.user.id) ||
            (req.user.role === 'merchant' && property.merchant_id === req.user.id);

        if (req.user.role !== 'admin' && !isOwner) {
            return errorResponse(res, 'Unauthorized to edit this property', null, 403);
        }

        const data = {};
        if (req.body.title) data.title = req.body.title;
        if (req.body.description) data.description = req.body.description;
        if (req.body.sale_price) data.sale_price = req.body.sale_price;
        if (req.body.rent_price) data.rent_price = req.body.rent_price;
        if (req.body.address) data.address_line1 = req.body.address;

        // Location IDs
        if (req.body.city_id) data.city_id = req.body.city_id;
        if (req.body.state_id) data.state_id = req.body.state_id;
        if (req.body.country_id) data.country_id = req.body.country_id;
        if (req.body.locality_id || req.body.neighborhood) {
            data.locality_id = req.body.locality_id || req.body.neighborhood;
        }

        // Only Admin can update status
        if (req.body.status && req.user.role === 'admin') {
            data.status = req.body.status;
        }

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
        const id = req.body.id || req.params.id;
        const property = await PropertyModel.findById(id);

        if (!property) return errorResponse(res, 'Property not found', null, 404);

        // Permission check: Admin or Owner
        const isOwner = (req.user.role === 'user' && property.user_id === req.user.id) ||
            (req.user.role === 'merchant' && property.merchant_id === req.user.id);

        if (req.user.role !== 'admin' && !isOwner) {
            return errorResponse(res, 'Unauthorized to delete this property', null, 403);
        }

        await PropertyModel.remove(id);
        return successResponse(res, 'Property deleted');
    } catch (e) {
        return errorResponse(res, e.message, null, 500);
    }
};
