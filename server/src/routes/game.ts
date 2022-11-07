import { FastifyInstance } from "fastify";
import gameController from "../controllers/gameController";
import { Authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify:FastifyInstance) {
    fastify.get('/pools/:code/games', { onRequest: [ Authenticate ] }, gameController.index)
}