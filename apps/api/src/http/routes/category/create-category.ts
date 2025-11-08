import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { ConflictError } from '../_errors/conflict-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/categories',
      {
        schema: {
          tags: ['Category'],
          summary: 'Create a new category.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            color: z.string().optional().default('#71717b'),
            type: z.union([z.literal('EXPENSE'), z.literal('REVENUE')]),
          }),
          response: {
            201: z.object({
              categoryId: z.uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Category')) {
          throw new UnauthorizedError(
            `You're not allowed to create new categories.`,
          )
        }

        const { name, color, type } = request.body

        const categoryWithSameName = await prisma.category.findUnique({
          where: {
            name,
            name_slug_type_organizationId: {
              name,
              slug: createSlug(name),
              type,
              organizationId: organization.id,
            },
          },
        })

        if (categoryWithSameName) {
          throw new ConflictError('Category with same data already exists.')
        }

        const category = await prisma.category.create({
          data: {
            name,
            slug: createSlug(name),
            color,
            type,
            organizationId: organization.id,
            ownerId: userId,
          },
        })

        return reply.status(201).send({
          categoryId: category.id,
        })
      },
    )
}
