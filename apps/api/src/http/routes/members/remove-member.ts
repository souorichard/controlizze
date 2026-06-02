import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
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
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('delete', 'Member')) {
        throw new UnauthorizedError(
          `Você não tem permissão para remover membros desta organização`,
        )
      }

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
        throw new NotFoundError('Membro não encontrado')
      }

      await db
        .delete(schema.members)
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
