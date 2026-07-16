import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../../middlewares/auth.ts'

export const getOrg: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Organization'],
        summary: 'Get organization details',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            org: z.object({
              id: z.uuid(),
              name: z.string(),
              slug: z.string(),
              ownerId: z.uuid(),
              avatarUrl: z.url().nullable(),
              createdAt: z.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org } = await request.getUserMembership(slug, userId)

      return { org }
    },
  )
}
