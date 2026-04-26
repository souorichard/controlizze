import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
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
          id: schema.categories.id,
          name: schema.categories.name,
          color: schema.categories.color,
          type: schema.categories.type,
          owner: {
            id: users.id,
            name: users.name,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(schema.categories)
        .innerJoin(users, eq(schema.categories.ownerId, users.id))
        .where(eq(schema.categories.orgId, org.id))

      return {
        categories: allCategories,
      }
    },
  )
}
