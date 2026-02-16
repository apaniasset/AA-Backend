import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

export const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return errorResponse(res, 'Authentication required', null, 401);
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (roles.length > 0 && !roles.includes(decoded.role)) {
                return errorResponse(res, 'Forbidden: Insufficient permissions', null, 403);
            }

            req.user = decoded;
            next();
        } catch (error) {
            return errorResponse(res, 'Invalid or expired token', null, 401);
        }
    };
};
