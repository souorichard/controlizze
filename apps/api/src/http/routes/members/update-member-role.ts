import { roleSchema } from '@controlizze/rbac'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const updateMemberRole: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).put(
    '/',
    {
      schema: {
        tags: ['Member'],
        summary: 'Update member role',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          memberId: z.uuid(),
        }),
        body: z.object({
          role: roleSchema,
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, memberId } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('update', 'Member')) {
        throw new UnauthorizedError(`You're not allowed to update this member`)
      }

      const { role } = request.body

      const [member] = await db
        .select({
          id: schema.members.id,
        })
        .from(schema.members)
        .where(
          and(
            eq(schema.members.id, memberId),
            eq(schema.members.orgId, org.id),
          ),
        )
        .limit(1)

      if (!member) {
        throw new NotFoundError('Member not found')
      }

      await db
        .update(schema.members)
        .set({
          role,
        })
        .where(
          and(
            eq(schema.members.id, member.id),
            eq(schema.members.orgId, org.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
