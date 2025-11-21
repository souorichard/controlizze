import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { NotFoundError } from '../_errors/not-found-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/categories/:categoryId',
      {
        schema: {
          tags: ['Category'],
          summary: 'Update a category',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            categoryId: z.uuid(),
          }),
          body: z.object({
            name: z.string(),
            color: z.string().optional().default('#71717b'),
            type: z.union([z.literal('EXPENSE'), z.literal('REVENUE')]),
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

        if (cannot('update', 'Category')) {
          throw new UnauthorizedError(`You're not allowed to update a category`)
        }

        const { name, color, type } = request.body

        const category = await prisma.category.findUnique({
          where: {
            id: categoryId,
            organizationId: organization.id,
          },
        })

        if (!category) {
          throw new NotFoundError('Category not found')
        }

        await prisma.category.update({
          where: {
            id: categoryId,
            organizationId: organization.id,
          },
          data: {
            name,
            slug: createSlug(name),
            color,
            type,
          },
        })

        return reply.status(204).send()
      },
    )
}
