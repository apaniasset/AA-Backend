/**
 * Standardized API Response Utility
 * Inspired by the reference project to ensure consistency across the API.
 */
import Logger from './Logger.js';
export const successResponse = (res, message, data = null, statusCode = 200) => {
    const result = {
        success: true,
        message
    };
    if (data !== null) result.data = data;
    return res.status(statusCode).json(result);
};

export const successPaginatedResponse = (res, message, result, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data: result.data,
        pagination: result.pagination
    });
};

export const errorResponse = (res, message, error = null, statusCode = 400) => {
    // Log the error for internal tracking (using the custom Logger)
    if (error) {
        Logger.error(`${message}: ${error.stack || error.message || error}`);
    } else {
        Logger.error(`API Error: ${message}`);
    }

    const result = {
        success: false,
        message
    };
    if (error !== null) {
        // Only return error details in non-production or for validation errors
        result.error = error;
    }
    return res.status(statusCode).json(result);
};
