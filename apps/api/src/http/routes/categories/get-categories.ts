import { and, count, eq, ilike } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { users } from '../../../db/schema/users.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { typeSchema } from '../../schemas.ts'

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
        querystring: z.object({
          name: z
            .string()
            .min(3, 'Termo de busca deve ter pelo menos 3 caracteres')
            .optional(),
          type: typeSchema.optional(),
          page: z.coerce.number().min(1).default(1),
          perPage: z.coerce.number().min(1).max(50).default(10),
        }),
        response: {
          200: z.object({
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
            meta: z.object({
              page: z.number(),
              perPage: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const { name, type, page, perPage } = request.query

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'Category')) {
        throw new UnauthorizedError(
          'Você não tem permissão para visualizar categorias nesta organização',
        )
      }

      const filters = and(
        eq(schema.categories.orgId, org.id),
        name ? ilike(schema.categories.name, `%${name}%`) : undefined,
        type ? eq(schema.categories.type, type) : undefined,
      )

      const [{ total }] = await db
        .select({ total: count() })
        .from(schema.categories)
        .where(filters)

      const categories = await db
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
        .where(filters)
        .limit(perPage)
        .offset((page - 1) * perPage)

      return {
        categories,
        meta: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      }
    },
  )
}
