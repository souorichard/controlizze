import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createSlug } from '../../../utils/create-slug.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { typeSchema } from '../../schemas/index.ts'

export const updateCategory: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).put(
    '/',
    {
      schema: {
        tags: ['Category'],
        summary: 'Update category details',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          categorySlug: z.uuid(),
        }),
        body: z.object({
          name: z.string(),
          color: z.string(),
          type: typeSchema,
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, categorySlug } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('update', 'Category')) {
        throw new UnauthorizedError(
          `You're not allowed to update organization categories`,
        )
      }

      const { name, color, type } = request.body

      const category = await db
        .select({
          id: schema.categories.id,
        })
        .from(schema.categories)
        .where(
          and(
            eq(schema.categories.slug, categorySlug),
            eq(schema.categories.orgId, org.id),
          ),
        )

      if (!category) {
        throw new NotFoundError('Category not found')
      }

      await db
        .update(schema.categories)
        .set({
          name,
          slug: createSlug(name),
          color,
          type,
        })
        .where(
          and(
            eq(schema.categories.slug, categorySlug),
            eq(schema.categories.orgId, org.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
