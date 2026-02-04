import { ApiResponse } from '../utils/ApiResponse.js';
/**
 * Global Error Handling Middleware
 */
export const errorMiddleware = (err, req, res, next) => {
    console.error(' [Error Log]:', err.stack || err);
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    return ApiResponse.error(res, message, statusCode, process.env.NODE_ENV === 'local' ? err.stack : null);
};
