import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id';
import { prisma } from '../lib/prisma';

export = {
    async count(req:FastifyRequest, res:FastifyReply) {
        const count = await prisma.pool.count()
        
        if (count == null) {
            return res.status(500).send({error: 'Data not found.'})
        }

        return res.status(200).send({ count })
    },
    
    async create(req:FastifyRequest, res:FastifyReply) {
        const requestBody = z.object({
            title: z.string(),
        });

        const { title } = requestBody.parse(req.body);

        if (title == '' || title == null) {
            return res.status(400).send({ error: 'Title out of acceptable.' })
        }

        const shortUniqueId = new ShortUniqueId({ length:6 })
        const generatedCode = String(shortUniqueId()).toUpperCase()

        try {
            await req.jwtVerify()

            await prisma.pool.create({
                data: {
                    title: title,
                    code: generatedCode,
                    ownerId: req.user.sub,

                    participants: {
                        create: {
                            userId: req.user.sub,
                        }
                    }
                }
            })
        } catch (error) {
            await prisma.pool.create({
                data: {
                    title: title,
                    code: generatedCode
                }
            })
        }        

        return res.status(200).send({ code: generatedCode })
    },

    async join(req:FastifyRequest, res:FastifyReply) {
        const requestParams = z.object({
            code: z.string(),
        });

        const { code } = requestParams.parse(req.params);

        if (code == '' || code == null) {
            return res.status(400).send({ error: 'Code out of acceptable.' })
        }

        const pool = await prisma.pool.findUnique({
            where: { code: code },
            include: {
                participants: {
                    where: {
                        userId: req.user.sub,
                    }
                }
            }
        })

        if (!pool) {
            return res.status(400).send({ error: 'Pool not found.' })
        }

        if (pool.participants.length > 0) {
            return res.status(400).send({ error: 'You already joined this pool.' })
        }

        if (!pool.ownerId) {
            await prisma.pool.update({
                where: { id: pool.id },
                data : {
                    ownerId: req.user.sub,
                }
            })
        }

        await prisma.participant.create({
            data: {
                poolId: pool.id,
                userId: req.user.sub,
            }
        })

        return res.status(201).send({ message: 'Success' })
    },
    
    async joined(req:FastifyRequest, res:FastifyReply) {
        const pools = await prisma.pool.findMany({
            where: {
                participants: {
                    some: {
                        userId: req.user.sub
                    }
                },
            },
            include: {
                _count: { select: { participants: true } },
                participants: {
                    select: {
                        id: true,
                        user: { select: { avatarUrl: true } }
                    }, take: 4,
                },
                owner: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
            }
        })

        return res.status(200).send({ pools })
    },
    
    async show(req:FastifyRequest, res:FastifyReply) {
        const requestParams = z.object({
            id: z.string(),
        });

        const { id } = requestParams.parse(req.params);

        const pool = await prisma.pool.findUnique({
            where: {
                id,
            },
            include: {
                _count: { select: { participants: true } },
                participants: {
                    select: {
                        id: true,
                        user: { select: { avatarUrl: true } }
                    }, take: 4,
                },
                owner: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
            }
        })

        return res.status(200).send({ pool })
    },
}