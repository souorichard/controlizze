import dayjs from 'dayjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getCurrentOrganizationPlan } from '@/utils/get-current-organization-plan'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { NotFoundError } from '../_errors/not-found-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createTransation(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/transactions',
      {
        schema: {
          tags: ['Transaction'],
          summary: 'Create a new transaction.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            description: z.string(),
            category: z.string(),
            type: z.union([z.literal('EXPENSE'), z.literal('REVENUE')]),
            status: z.union([
              z.literal('PENDING'),
              z.literal('COMPLETED'),
              z.literal('CANCELLED'),
            ]),
            amount: z.number(),
          }),
          response: {
            201: z.object({
              transactionId: z.uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Transaction')) {
          throw new UnauthorizedError(
            `You're not allowed to create new transactions.`,
          )
        }

        const {
          description,
          category: categorySlug,
          type,
          status,
          amount,
        } = request.body

        const { subscription } = await getCurrentOrganizationPlan(
          organization.slug,
        )

        if (subscription.name === 'free') {
          const startOfMonth = dayjs().startOf('month').toDate()
          const endOfMonth = dayjs().endOf('month').toDate()

          const transactionsCount = await prisma.transaction.count({
            where: {
              organizationId: organization.id,
              ownerId: userId,
              createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
              },
            },
          })

          const limit = subscription.quota.transactions.available

          if (transactionsCount >= limit) {
            throw new BadRequestError(
              `Free plan transaction limit per month reached (${transactionsCount}/${limit}).`,
            )
          }
        }

        const category = await prisma.category.findUnique({
          where: {
            slug_type: {
              slug: categorySlug,
              type,
            },
          },
        })

        if (!category) {
          throw new NotFoundError('Category not found.')
        }

        const transaction = await prisma.transaction.create({
          data: {
            description,
            categoryId: category.id,
            type,
            status,
            amount,
            organizationId: organization.id,
            ownerId: userId,
          },
        })

        return reply.status(201).send({
          transactionId: transaction.id,
        })
      },
    )
}
