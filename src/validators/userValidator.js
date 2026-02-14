import Joi from 'joi';

/**
 * Base User Validations
 */
export const userSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email address',
        'any.required': 'Email is required'
    }),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
        'string.pattern.base': 'Phone number must be a valid numeric string (10-15 digits)',
        'any.required': 'Phone number is required'
    }),
    password: Joi.string().min(6).optional().messages({
        'string.min': 'Password must be at least 6 characters'
    }),
    role: Joi.string().valid('admin', 'merchant', 'affiliate', 'user').optional(),
    status_id: Joi.number().integer().optional(),

    // Profile Data (Conditional)
    company_name: Joi.string().trim().max(150).allow(null, ''),
    rera_number: Joi.string().trim().max(50).allow(null, ''),
    gst_number: Joi.string().trim().max(50).allow(null, ''),
    referral_code: Joi.string().trim().max(50).allow(null, '')
});

/**
 * Common validation runner
 */
export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if (error) {
        const details = error.details.map(err => ({
            field: err.path[0],
            message: err.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: details
        });
    }

    req.validatedBody = value; // Attach cleaned data
    next();
};
