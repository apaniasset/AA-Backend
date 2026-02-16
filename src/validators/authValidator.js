import Joi from 'joi';

export const loginSchema = Joi.object({
    identifier: Joi.string().required().messages({
        'any.required': 'Email or phone is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

export const otpSchema = Joi.object({
    identifier: Joi.string().required(),
    otp: Joi.string().required().length(6)
});
