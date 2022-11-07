import { fastifyServer as fastify } from '../util/fastifyServer';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export = {
    async index(req:FastifyRequest, res:FastifyReply) {
        const requestBody = z.object({
            code: z.string(),
        });

        const { code } = requestBody.parse(req.params);

        const games = await prisma.game.findMany({
            orderBy: { date: 'desc' },
            include: {
                guesses: {
                    where: {
                        participant: {
                            userId: req.user.sub,
                            poolId: code,
                        }
                    }
                }
            }
        })

        return res.code(200).send({
            games: games.map(game => {
                return {
                    ...game,
                    guess: game.guesses.length > 0 ? game.guesses[0] : null,
                    guesses: undefined,
                }
            })
        })
    }
}