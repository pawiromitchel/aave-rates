// routes/ratesRoutes.js
import { getRates } from '../controllers/ratesController.js';

export default async function ratesRoutes(fastify, options) {
    fastify.get('/rates', getRates);
}
