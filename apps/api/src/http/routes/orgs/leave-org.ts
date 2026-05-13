import { organizationSchema } from '@controlizze/rbac'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const leaveOrg: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).delete(
    '/',
    {
      schema: {
        tags: ['Organization'],
        summary: 'Leave organization',
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

      if (cannot('leave', authOrganization)) {
        throw new UnauthorizedError(
          `You're not allowed to leave this organization`,
        )
      }

      const [selectedOrg] = await db
        .select({
          id: schema.organizations.id,
          ownerId: schema.organizations.ownerId,
        })
        .from(schema.organizations)
        .where(eq(schema.organizations.slug, slug))
        .limit(1)

      if (!selectedOrg) {
        throw new NotFoundError('Organization not found')
      }

      if (selectedOrg.ownerId === userId) {
        throw new BadRequestError('You cannot leave your own organization')
      }

      await db
        .delete(schema.members)
        .where(
          and(
            eq(schema.members.orgId, org.id),
            eq(schema.members.userId, userId),
          ),
        )

      return reply.status(204).send()
    },
  )
}
