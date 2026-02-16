import Logger from '../utils/Logger.js';

/**
 * Global Error Handling Middleware
 */
export const errorMiddleware = (err, req, res, next) => {
    // Professional Logging
    Logger.error(`${err.message}\nStack: ${err.stack}`);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
        stack: process.env.NODE_ENV === 'local' ? err.stack : null
    });
};
