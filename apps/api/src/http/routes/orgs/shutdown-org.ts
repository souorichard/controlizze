import { organizationSchema } from '@controlizze/rbac'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const shutdownOrg: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).delete(
    '/',
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
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const authOrganization = organizationSchema.parse(org)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('delete', authOrganization)) {
        throw new UnauthorizedError(
          `You're not allowed to shutdown this organization`,
        )
      }

      await db
        .delete(schema.organizations)
        .where(eq(schema.organizations.id, org.id))

      return reply.status(204).send()
    },
  )
}
