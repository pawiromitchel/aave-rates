// controllers/ratesController.js
import { fetchAllRates } from '../models/ratesModel.js';

export const getRates = async (request, reply) => {
    try {
        const rates = await fetchAllRates();
        return reply.code(200).send(rates);
    } catch (error) {
        return reply.code(500).send({
            error: 'Failed to fetch rates',
            details: error.message,
        });
    }
};
