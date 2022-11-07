import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export = {
    async count(req:FastifyRequest, res:FastifyReply) {
        const count = await prisma.guess.count()

        if (count == null) {
            return res.status(500).send({error: 'Data not found.'})
        }

        return res.status(200).send({ count })
    },

    async create(req:FastifyRequest, res:FastifyReply) {
        const requestParams = z.object({
            poolId: z.string(),
            gameId: z.string()
        })
        
        const requestBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number()
        })

        const { poolId, gameId } = requestParams.parse(req.params)
        const { firstTeamPoints, secondTeamPoints } = requestBody.parse(req.body)
        
        const participant = await prisma.participant.findUnique({
            where: {
                userId_poolId: {
                    userId: req.user.sub,
                    poolId,
                }
            }
        })

        if (!participant) {
            return res.status(400).send({
                error: "You're not allowed to create a guess inside this pool.",
                userId: req.user.sub,    
            })
        }

        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId: gameId
                }
            }
        })

        if (guess) {
            return res.status(400).send({
                error: "You already sent a guess to game on this pool."                
            })
        }

        const game = await prisma.game.findUnique({
            where: { id: gameId }
        })

        if (!game) {
            return res.status(400).send({ error: "Game not found." })
        }

        if (game.date < new Date()) {
            return res.status(400).send({ error: "You cannot send guesses after the game." })
        }

        await prisma.guess.create({
            data: {
                participantId: participant.id,
                gameId: gameId,
                firstTeamPoints,
                secondTeamPoints
            }
        })

        return res.status(201).send()
    }
}