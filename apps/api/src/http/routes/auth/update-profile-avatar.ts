import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { NotFoundError } from '@/http/routes/_errors/not-found-error'
import { prisma } from '@/lib/prisma'

export async function updateProfileAvatar(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/profile/avatar',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Update profile avatar.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            avatarUrl: z.url(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { avatarUrl } = request.body

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new NotFoundError('User not found.')
        }

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            avatarUrl,
          },
        })

        return reply.status(204).send()
      },
    )
}
