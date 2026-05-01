import { and, eq, gt } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const rejectInvite: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).post(
    '/',
    {
      schema: {
        tags: ['Invite'],
        summary: 'Reject invite',
        security: [{ bearerAuth: [] }],
        params: z.object({
          inviteId: z.uuid(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { inviteId } = request.params

      const userId = await request.getCurrentUserId()

      const [invite] = await db
        .select()
        .from(schema.invites)
        .where(
          and(
            eq(schema.invites.id, inviteId),
            eq(schema.invites.status, 'PENDING'),
            gt(schema.invites.expiresAt, new Date()),
          ),
        )
        .limit(1)

      if (!invite) {
        throw new NotFoundError('Invite not found or expired')
      }

      const [user] = await db
        .select({
          id: schema.users.id,
          email: schema.users.email,
        })
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1)

      if (!user) {
        throw new NotFoundError('User not found')
      }

      if (invite.email !== user.email) {
        throw new BadRequestError('This invite belongs to another user')
      }

      await db
        .update(schema.invites)
        .set({
          status: 'REJECTED',
        })
        .where(eq(schema.invites.id, inviteId))

      return reply.status(204).send()
    },
  )
}
