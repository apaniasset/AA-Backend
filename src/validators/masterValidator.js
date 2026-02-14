import Joi from 'joi';

export const masterSchema = Joi.object({
    id: Joi.number().integer().optional(),
    name: Joi.string().trim().min(2).max(100).required(),
    is_active: Joi.boolean().optional(),
    description: Joi.string().trim().max(255).allow(null, ''),
    // For packages
    price: Joi.number().precision(2).optional(),
    duration_days: Joi.number().integer().optional(),
    listing_limit: Joi.number().integer().optional(),
    featured_limit: Joi.number().integer().optional()
});
