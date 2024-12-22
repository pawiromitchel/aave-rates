// routes/ratesRoutes.js
import { getDbRates, getRates, getRatesForSpecificChain } from '../controllers/ratesController.js';

export default async function ratesRoutes(fastify, options) {
    fastify.get('/rates', getRates);
    fastify.get('/rates/db/:symbol', getDbRates);

    fastify.get('/rates/:chain', getRatesForSpecificChain);
}