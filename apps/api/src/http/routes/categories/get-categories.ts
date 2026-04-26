import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { categories } from '../../../db/schema/categories.ts'
import { users } from '../../../db/schema/users.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { typeSchema } from '../../schemas/index.ts'

export const getCategories: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Category'],
        summary: 'Get organization categories',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          201: z.object({
            categories: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                color: z.string(),
                type: typeSchema,
                owner: z.object({
                  id: z.uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.url().nullable(),
                }),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'Category')) {
        throw new UnauthorizedError(
          `You're not allowed to see organization categories`,
        )
      }

      const allCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          color: categories.color,
          type: categories.type,
          owner: {
            id: users.id,
            name: users.name,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(categories)
        .innerJoin(users, eq(categories.ownerId, users.id))
        .where(eq(categories.orgId, org.id))

      return {
        categories: allCategories,
      }
    },
  )
}
