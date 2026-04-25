import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { members } from '../../../db/schema/members.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const removeMember: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).delete(
    '/',
    {
      schema: {
        tags: ['Member'],
        summary: 'Remove member from organization',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          memberId: z.uuid(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, memberId } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('delete', 'User')) {
        throw new UnauthorizedError(
          `You're not allowed to remove members from organization`,
        )
      }

      const [member] = await db
        .select({
          id: members.id,
        })
        .from(members)
        .where(and(eq(members.id, memberId), eq(members.orgId, org.id)))
        .limit(1)

      if (!member) {
        throw new NotFoundError('Member not found')
      }

      await db
        .delete(members)
        .where(and(eq(members.id, member.id), eq(members.orgId, org.id)))

      return reply.status(204).send()
    },
  )
}
