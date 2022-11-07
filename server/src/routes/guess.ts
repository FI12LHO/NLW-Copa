import { FastifyInstance } from "fastify";
import guessController from "../controllers/guessController";
import { Authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify:FastifyInstance) {
    fastify.get('/guesses/count', guessController.count)
    fastify.post('/guesses/:poolId/:gameId', { onRequest: [ Authenticate ] }, guessController.create)
}