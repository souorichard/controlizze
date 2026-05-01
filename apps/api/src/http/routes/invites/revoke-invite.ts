import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const revokeInvite: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).delete(
    '/',
    {
      schema: {
        tags: ['Invite'],
        summary: 'Revoke invite',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          inviteId: z.uuid(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, inviteId } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('revoke', 'Invite')) {
        throw new UnauthorizedError(`You're not allowed to revoke invites`)
      }

      const [invite] = await db
        .select()
        .from(schema.invites)
        .where(
          and(
            eq(schema.invites.orgId, org.id),
            eq(schema.invites.id, inviteId),
          ),
        )
        .limit(1)

      if (!invite) {
        throw new NotFoundError('Invite not found')
      }

      await db.delete(schema.invites).where(eq(schema.invites.id, inviteId))

      return reply.status(204).send()
    },
  )
}
