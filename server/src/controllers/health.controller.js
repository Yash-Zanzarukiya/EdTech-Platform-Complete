import { StatusCodes } from 'http-status-codes';
import { handleResponse } from '../utils/index.js';

export const checkHealth = async (_, res) => {
    // sectionContent.toggleVideoToSectionContent();
    handleResponse(res, StatusCodes.OK, {}, 'Server is healthy...');
};
