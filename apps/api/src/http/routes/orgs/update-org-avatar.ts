import { organizationSchema } from '@controlizze/rbac'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { organizations } from '../../../db/schema/organizations.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const updateOrgAvatar: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).patch(
    '/:slug/avatar',
    {
      schema: {
        tags: ['Organization'],
        summary: 'Update organization avatar',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          avatarUrl: z.url(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { avatarUrl } = request.body

      const authOrganization = organizationSchema.parse(org)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('update', authOrganization)) {
        throw new UnauthorizedError(
          `You're not allowed to update this organization`,
        )
      }

      await db
        .update(organizations)
        .set({
          avatarUrl,
        })
        .where(eq(organizations.id, org.id))

      return reply.status(204).send()
    },
  )
}
