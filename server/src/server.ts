import { fastifyServer as fastify } from "./util/fastifyServer";
import Jwt from "@fastify/jwt";
import Cors from "@fastify/cors"

// Routes
import { poolRoutes } from "./routes/pool";
import { userRoutes } from "./routes/user";
import { guessRoutes } from "./routes/guess";
import { gameRoutes } from "./routes/game";
import { authRoutes } from "./routes/auth";

async function start() {
    await fastify.register(Cors, { origin: true })
    await fastify.register(Jwt, { secret: 'nlwcopa' })

    // Auth routes
    await fastify.register(authRoutes)
    // Pool routes
    await fastify.register(poolRoutes)
    // User routes
    await fastify.register(userRoutes)
    // Guess routes
    await fastify.register(guessRoutes)
    // Game routes
    await fastify.register(gameRoutes)

    await fastify.listen({port: 3333, host: '0.0.0.0'})
}

start()