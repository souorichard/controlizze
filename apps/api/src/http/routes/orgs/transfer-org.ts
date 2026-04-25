import { organizationSchema } from '@controlizze/rbac'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { members } from '../../../db/schema/members.ts'
import { organizations } from '../../../db/schema/organizations.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { auth } from '../../middlewares/auth.ts'

export const transferOrg: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).patch(
    '/:slug/owner',
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
        throw new Error(
          `You're not allowed to transfer ownership of this organization`,
        )
      }

      const [transferToMembership] = await db
        .select({ id: members.id })
        .from(members)
        .where(
          and(eq(members.orgId, organizations.id), eq(members.userId, userId)),
        )
        .limit(1)

      if (!transferToMembership) {
        throw new Error('Target user is not a member of this organization')
      }

      await db.transaction(async (tx) => {
        await tx
          .update(members)
          .set({
            role: 'OWNER',
          })
          .where(
            and(
              eq(members.orgId, org.id),
              eq(members.userId, transferToUserId),
            ),
          )

        await tx
          .update(members)
          .set({
            role: 'ADMIN',
          })
          .where(and(eq(members.orgId, org.id), eq(members.userId, userId)))

        await tx
          .update(organizations)
          .set({
            ownerId: transferToUserId,
          })
          .where(eq(organizations.id, org.id))
      })

      return reply.status(204).send()
    },
  )
}
