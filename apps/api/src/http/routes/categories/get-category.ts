import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
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
          id: schema.categories.id,
          name: schema.categories.name,
          slug: schema.categories.slug,
          color: schema.categories.color,
          type: schema.categories.type,
          owner: {
            id: schema.users.id,
            name: schema.users.name,
            avatarUrl: schema.users.avatarUrl,
          },
          createdAt: schema.categories.createdAt,
        })
        .from(schema.categories)
        .innerJoin(schema.users, eq(schema.categories.ownerId, schema.users.id))
        .where(
          and(
            eq(schema.categories.slug, categorySlug),
            eq(schema.categories.orgId, org.id),
          ),
        )
        .limit(1)

      return {
        category,
      }
    },
  )
}
