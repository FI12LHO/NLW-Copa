import { FastifyRequest } from "fastify";

export async function Authenticate(req: FastifyRequest) {
    await req.jwtVerify()
}