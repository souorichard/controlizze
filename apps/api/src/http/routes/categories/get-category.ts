import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { categories } from '../../../db/schema/categories.ts'
import { users } from '../../../db/schema/users.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { typeSchema } from '../../schemas/index.ts'

export const getCategory: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Category'],
        summary: 'Get category details',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          categorySlug: z.string(),
        }),
        response: {
          200: z.object({
            category: z.object({
              id: z.uuid(),
              name: z.string(),
              slug: z.string(),
              color: z.string(),
              type: typeSchema,
              owner: z.object({
                id: z.uuid(),
                name: z.string().nullable(),
                avatarUrl: z.url().nullable(),
              }),
              createdAt: z.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug, categorySlug } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'Category')) {
        throw new UnauthorizedError(
          `You're not allowed to see organization category details`,
        )
      }

      const [category] = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
          type: categories.type,
          owner: {
            id: users.id,
            name: users.name,
            avatarUrl: users.avatarUrl,
          },
          createdAt: categories.createdAt,
        })
        .from(categories)
        .innerJoin(users, eq(categories.ownerId, users.id))
        .where(
          and(eq(categories.slug, categorySlug), eq(categories.orgId, org.id)),
        )
        .limit(1)

      return {
        category,
      }
    },
  )
}
