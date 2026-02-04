/**
 * Standardized API Response Class
 * Similar to Laravel's response() helper
 */
export class ApiResponse {
    /**
     * Send a success response
     */
    static success(res, message = 'Success', data = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    /**
     * Send an error response
     */
    static error(res, message = 'Error', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }
}
