import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ratesRoutes from './routes/ratesRoutes.js';
import { fetchAndInsertRates } from './models/databaseModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Fastify app
const fastify = Fastify({ logger: true });

// Serve static files from "views/public"
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'views', 'public'),
    prefix: '/', // Serve static files at root
});

// Register routes
fastify.register(ratesRoutes);

// Route to serve main HTML file
fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

// Fetch and insert rates
// setInterval(fetchAndInsertRates, process.env.FETCH_INTERVAL * 60 * 1000);

// Start the server
const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT });
        console.log('Server is running at http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
