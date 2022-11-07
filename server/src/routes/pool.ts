import { FastifyInstance } from "fastify";
import poolController from "../controllers/poolController";
import { Authenticate } from "../plugins/authenticate";

export async function poolRoutes(fastify:FastifyInstance) {
    fastify.post('/pools', poolController.create)
    fastify.get('/pools', { onRequest: [ Authenticate ] }, poolController.joined)
    fastify.get('/pools/:id', { onRequest: [ Authenticate ] }, poolController.show)
    fastify.get('/pools/:code/join', { onRequest: [ Authenticate ] }, poolController.join)
    fastify.get('/pools/count', poolController.count)
}