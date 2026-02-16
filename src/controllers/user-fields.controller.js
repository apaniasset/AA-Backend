import { successResponse } from '../utils/response.js';

export const index = async (req, res) => {
    return successResponse(res, 'User fields list');
};

export const update = async (req, res) => {
    return successResponse(res, 'Updated');
};
