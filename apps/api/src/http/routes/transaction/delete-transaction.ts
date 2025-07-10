import { transactionSchema } from '@controlizze/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { NotFoundError } from '../_errors/not-found-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function deleteTransation(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/transactions/:transactionId',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Create a new transaction.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            transactionId: z.uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, transactionId } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const transaction = await prisma.transacion.findUnique({
          where: {
            id: transactionId,
            organizationId: organization.id,
          },
        })

        if (!transaction) {
          throw new NotFoundError(`Transaction not found.`)
        }

        const authTransaction = transactionSchema.parse(transaction)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authTransaction)) {
          throw new UnauthorizedError(
            `You're not allowed to delete this transaction.`,
          )
        }

        await prisma.transacion.delete({
          where: {
            id: transactionId,
          },
        })

        return reply.status(204).send()
      },
    )
}
