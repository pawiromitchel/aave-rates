// controllers/ratesController.js
import { CHAINS } from '../constants/chains.js';
import { getAllRatesfromDbBySymbol } from '../models/databaseModel.js';
import { fetchAllRates, fetchRatesForChain } from '../models/ratesModel.js';

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

export const getRatesForSpecificChain = async (request, reply) => {
    try {
        const { chain } = request.params;  // Get the chain from the URL parameter

        // Check if the chain is a valid enum value
        if (!Object.values(CHAINS).includes(chain)) {
            return reply.code(400).send({
                error: 'Invalid chain',
                details: `The chain '${chain}' is not supported.`,
            });
        }

        // Fetch rates for the specific chain using the enum value
        const rates = await fetchRatesForChain(chain);
        return reply.code(200).send(rates);
    } catch (error) {
        return reply.code(500).send({
            error: 'Failed to fetch rates',
            details: error.message,
        });
    }
};

export const getRatesForSpecificSymbol = async (request, reply) => {
    try {
        const { symbol } = request.params;  // Get the chain from the URL parameter

        // Fetch rates for the specific chain using the enum value
        const rates = await getAllRatesfromDbBySymbol(symbol);
        return reply.code(200).send(rates);
    } catch (error) {
        return reply.code(500).send({
            error: 'Failed to fetch rates',
            details: error.message,
        });
    }
};