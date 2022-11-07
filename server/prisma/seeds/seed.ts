import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function population() {
    const user = await prisma.user.create({
        data: {
            googleId: '123456789123456789123',
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatarUrl: 'https://github.com/fi12lho.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool',
            code: 'ABC123',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'DE',
            date: '2023-12-01T15:30:00.146Z'
        }
    })

    await prisma.game.create({
        data: {
            firstTeamCountryCode: 'PT',
            secondTeamCountryCode: 'US',
            date: '2023-12-01T15:30:00.146Z',
            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,
                    participant:{
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })
}

population()