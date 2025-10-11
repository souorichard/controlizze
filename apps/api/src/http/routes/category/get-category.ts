import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { NotFoundError } from '../_errors/not-found-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/categories/:categoryId',
      {
        schema: {
          tags: ['Category'],
          summary: 'Get category details.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            categoryId: z.uuid(),
          }),
          response: {
            200: z.object({
              category: z.object({
                id: z.uuid(),
                name: z.string(),
                color: z.string(),
                type: z.union([z.literal('EXPENSE'), z.literal('REVENUE')]),
                createdAt: z.date(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug, categoryId } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Category')) {
          throw new UnauthorizedError(
            `You're not allowed to see organization category.`,
          )
        }

        const category = await prisma.category.findUnique({
          select: {
            id: true,
            name: true,
            color: true,
            type: true,
            createdAt: true,
          },
          where: {
            id: categoryId,
            organizationId: organization.id,
          },
        })

        if (!category) {
          throw new NotFoundError('Category not found.')
        }

        return {
          category,
        }
      },
    )
}
