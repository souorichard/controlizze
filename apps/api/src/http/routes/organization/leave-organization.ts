import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { NotFoundError } from '../_errors/not-found-error'

export async function leaveOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/leave',
      {
        schema: {
          tags: ['Organization'],
          summary: 'Leave organization.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()

        const organization = await prisma.organization.findUnique({
          where: {
            slug,
          },
        })

        if (!organization) {
          throw new NotFoundError('Organization not found.')
        }

        if (organization.ownerId === userId) {
          throw new BadRequestError('You cannot leave your own organization.')
        }

        await prisma.member.delete({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId,
            },
          },
        })

        return reply.status(204).send()
      },
    )
}
