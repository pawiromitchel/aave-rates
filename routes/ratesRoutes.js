// routes/ratesRoutes.js
import { getRates, getRatesForSpecificChain, getRatesForSpecificSymbol } from '../controllers/ratesController.js';

export default async function ratesRoutes(fastify, options) {
    fastify.get('/rates', getRates);
    fastify.get('/rates/:symbol', getRatesForSpecificSymbol);

    // fastify.get('/rates/:chain', getRatesForSpecificChain);
}