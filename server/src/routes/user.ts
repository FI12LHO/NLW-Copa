import { FastifyInstance } from "fastify";
import userController from "../controllers/userController";

export async function userRoutes(fastify:FastifyInstance) {
    fastify.get('/users/count', userController.count)
}