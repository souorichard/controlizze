import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getCategories(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/categories',
      {
        schema: {
          tags: ['Category'],
          summary: 'Get all organization categories.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            page: z.coerce.number().default(1),
            perPage: z.coerce.number().default(10),
            name: z.string().optional(),
            type: z.string().optional(),
          }),
          response: {
            200: z.object({
              categories: z.array(
                z.object({
                  id: z.uuid(),
                  name: z.string(),
                  slug: z.string(),
                  color: z.string(),
                  type: z.union([z.literal('EXPENSE'), z.literal('REVENUE')]),
                  createdAt: z.date(),
                  owner: z.object({
                    id: z.uuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().nullable(),
                  }),
                }),
              ),
              totalCount: z.number(),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { page, perPage, name, type } = request.query

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Category')) {
          throw new UnauthorizedError(
            `You're not allowed to see organization categories.`,
          )
        }

        const [categories, totalCategories] = await Promise.all([
          prisma.category.findMany({
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
              type: true,
              createdAt: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            where: {
              organizationId: organization.id,
              name: {
                contains: name,
                mode: 'insensitive',
              },
              type: {
                equals: type as 'EXPENSE' | 'REVENUE',
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip: (page - 1) * perPage,
            take: perPage,
          }),

          prisma.category.count({
            where: {
              organizationId: organization.id,
              name: {
                contains: name,
                mode: 'insensitive',
              },
              type: {
                equals: type as 'EXPENSE' | 'REVENUE',
              },
            },
          }),
        ])

        return {
          categories,
          totalCount: totalCategories,
        }
      },
    )
}
