import { fastifyServer as fastify } from '../util/fastifyServer';
import { FastifyReply, FastifyRequest } from 'fastify'
import fetch from "node-fetch";
import { z } from 'zod';
import { prisma } from '../lib/prisma';


export = {
    async me(req:FastifyRequest, res:FastifyReply) {
        return res.status(200).send({ user:req.user })
    },

    async auth(req:FastifyRequest, res:FastifyReply) {
        const requestBody = z.object({
            access_token: z.string(),
        });

        const { access_token } = requestBody.parse(req.body);

        if (access_token == null) {
            return res.status(500).send({
                origin: 'Server',
                error: 'Data not found.'
            })
        }

        const userData = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`)
            .then(res => res.json())

        const userInfoShema = z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
            picture: z.string().url(),
        })

        const userInfo = userInfoShema.parse(userData)

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,
                }
            })
        }

        const token = fastify.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl
        },
        {
            sub: user.id,
            expiresIn: '7 days',
        })

        return res.status(200).send({ token })
    }
}