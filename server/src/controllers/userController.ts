import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma';

export = {
    async count(req:FastifyRequest, res:FastifyReply) {
        const count = await prisma.user.count()
        if (count == null) {
            return res.status(500).send({error: 'Data not found.'})
        }

        return res.status(200).send({ count })
    }
}