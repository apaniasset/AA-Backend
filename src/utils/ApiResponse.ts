import { Response } from 'express';

/**
 * Standardized API Response Class
 * Similar to Laravel's response() helper
 */
export class ApiResponse {
    /**
     * Send a success response
     */
    static success(res: Response, message: string = 'Success', data: any = null, statusCode: number = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    /**
     * Send an error response
     */
    static error(res: Response, message: string = 'Error', statusCode: number = 500, errors: any = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }
}
