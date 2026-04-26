import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { categories } from '../../../db/schema/categories.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const deleteCategory: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).delete(
    '/',
    {
      schema: {
        tags: ['Category'],
        summary: 'Delete category',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          categorySlug: z.string(),
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

      if (cannot('delete', 'Category')) {
        throw new UnauthorizedError(
          `You're not allowed to delete organization categories`,
        )
      }

      await db
        .delete(categories)
        .where(
          and(eq(categories.slug, categorySlug), eq(categories.orgId, org.id)),
        )

      return reply.status(204).send()
    },
  )
}
