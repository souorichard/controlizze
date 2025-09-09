import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { NotFoundError } from '@/http/routes/_errors/not-found-error'
import { prisma } from '@/lib/prisma'

import { ForbiddenError } from '../_errors/forbidden-error'

export async function updateProfileEmail(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/profile/email',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Update profile email.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { email } = request.body

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new NotFoundError('User not found.')
        }

        if (!user.hashPassword) {
          throw new ForbiddenError(
            'Only users with password authentication can change e-mail.',
          )
        }

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            email,
          },
        })

        return reply.status(204).send()
      },
    )
}
