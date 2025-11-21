import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { NotFoundError } from '../_errors/not-found-error'

export async function deleteProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/profile',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Delete profile',
          security: [{ bearerAuth: [] }],
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new NotFoundError('User not found')
        }

        await prisma.user.delete({
          where: {
            id: userId,
          },
        })

        return reply.status(204).send()
      },
    )
}
