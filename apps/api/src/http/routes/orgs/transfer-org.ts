import { organizationSchema } from '@controlizze/rbac'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const transferOrg: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).patch(
    '/',
    {
      schema: {
        tags: ['Organization'],
        summary: 'Transfer organization owner',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          transferToUserId: z.uuid(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const { transferToUserId } = request.body

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const authOrganization = organizationSchema.parse(org)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('transfer_ownership', authOrganization)) {
        throw new UnauthorizedError(
          `You're not allowed to transfer ownership of this organization`,
        )
      }

      const [transferToMembership] = await db
        .select({ id: schema.members.id })
        .from(schema.members)
        .where(
          and(
            eq(schema.members.orgId, schema.organizations.id),
            eq(schema.members.userId, userId),
          ),
        )
        .limit(1)

      if (!transferToMembership) {
        throw new BadRequestError(
          'Target user is not a member of this organization',
        )
      }

      await db.transaction(async (tx) => {
        await tx
          .update(schema.members)
          .set({
            role: 'OWNER',
          })
          .where(
            and(
              eq(schema.members.orgId, org.id),
              eq(schema.members.userId, transferToUserId),
            ),
          )

        await tx
          .update(schema.members)
          .set({
            role: 'ADMIN',
          })
          .where(
            and(
              eq(schema.members.orgId, org.id),
              eq(schema.members.userId, userId),
            ),
          )

        await tx
          .update(schema.organizations)
          .set({
            ownerId: transferToUserId,
          })
          .where(eq(schema.organizations.id, org.id))
      })

      return reply.status(204).send()
    },
  )
}
