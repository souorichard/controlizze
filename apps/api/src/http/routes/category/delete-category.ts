import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { NotFoundError } from '../_errors/not-found-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function deleteCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/categories/:categoryId',
      {
        schema: {
          tags: ['Category'],
          summary: 'Delete a category',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            categoryId: z.uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, categoryId } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Category')) {
          throw new UnauthorizedError(`You're not allowed to delete a category`)
        }

        const category = await prisma.category.findUnique({
          where: {
            id: categoryId,
            organizationId: organization.id,
          },
        })

        if (!category) {
          throw new NotFoundError('Category not found')
        }

        await prisma.category.delete({
          where: {
            id: categoryId,
            organizationId: organization.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
