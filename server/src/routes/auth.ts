import { FastifyInstance } from 'fastify';
import authController from '../controllers/authController';
import { Authenticate } from '../plugins/authenticate';

export async function authRoutes(fastify:FastifyInstance) {
    fastify.post('/users', authController.auth)
    fastify.get('/me', { onRequest: [ Authenticate ] }, authController.me)
}