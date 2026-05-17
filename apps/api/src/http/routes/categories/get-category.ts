import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { typeSchema } from '../../schemas.ts'

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
          categoryId: z.string(),
        }),
        response: {
          200: z.object({
            category: z.object({
              id: z.uuid(),
              name: z.string(),
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
      const { slug, categoryId } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

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
            eq(schema.categories.id, categoryId),
            eq(schema.categories.orgId, org.id),
          ),
        )
        .limit(1)

      if (!category) {
        throw new NotFoundError('Category not found')
      }

      return {
        category,
      }
    },
  )
}
