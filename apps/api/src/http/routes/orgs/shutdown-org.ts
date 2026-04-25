import { organizationSchema } from '@controlizze/rbac'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { organizations } from '../../../db/schema/organizations.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { auth } from '../../middlewares/auth.ts'

export const shutdownOrg: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).delete(
    '/:slug',
    {
      schema: {
        tags: ['Organization'],
        summary: 'Shutdown organization',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
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

      const authOrganization = organizationSchema.parse(org)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('delete', authOrganization)) {
        throw new Error(`You're not allowed to shutdown this organization`)
      }

      await db.delete(organizations).where(eq(organizations.id, org.id))

      return reply.status(204).send()
    },
  )
}
