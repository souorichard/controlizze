import { roleSchema } from '@controlizze/rbac'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../../middlewares/auth.ts'

export const getOrgMembership: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/:slug/membership',
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
              role: roleSchema,
              userId: z.uuid(),
              orgId: z.uuid(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const { membership } = await request.getUserMembership(slug)

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
