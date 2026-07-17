import { roleSchema } from '@controlizze/rbac'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../../middlewares/auth.ts'

export const getOrgMembership: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Organization'],
        summary: 'Get user membership on organization',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            membership: z.object({
              id: z.uuid(),
              role: roleSchema, // do not convert to lowercase
              userId: z.uuid(),
              orgId: z.uuid(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { membership } = await request.getUserMembership(slug, userId)

      return {
        membership: {
          id: membership.id,
          role: membership.role,
          userId: membership.userId,
          orgId: membership.orgId,
        },
      }
    },
  )
}
