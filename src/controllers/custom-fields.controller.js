import { successResponse } from '../utils/response.js';

export const index = async (req, res) => {
    return successResponse(res, 'List');
};

export const store = async (req, res) => {
    return successResponse(res, 'Created', null, 201);
};

export const show = async (req, res) => {
    const data = {
        id: req.body.id
    };
    return successResponse(res, 'Show', data);
};

export const update = async (req, res) => {
    return successResponse(res, 'Updated');
};

export const destroy = async (req, res) => {
    return successResponse(res, 'Deleted');
};
