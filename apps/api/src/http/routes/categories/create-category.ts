import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { typeSchema } from '../../schemas.ts'

export const createCategory: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).post(
    '/',
    {
      schema: {
        tags: ['Category'],
        summary: 'Create a new category',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          name: z.string(),
          color: z.string(),
          type: typeSchema,
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
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('create', 'Category')) {
        throw new UnauthorizedError(`You're not allowed to create categories`)
      }

      const { name, color, type } = request.body

      const [category] = await db
        .insert(schema.categories)
        .values({
          name,
          color,
          type,
          ownerId: userId,
          orgId: org.id,
        })
        .returning({
          id: schema.categories.id,
        })

      return reply.status(201).send({
        categoryId: category.id,
      })
    },
  )
}
