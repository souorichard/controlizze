import { and, eq, gt } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'
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
        querystring: z.object({
          code: z.string(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.query

      const codeHash = hashToken(code)

      const userId = await request.getCurrentUserId()

      const [invite] = await db
        .select()
        .from(schema.invites)
        .where(
          and(
            eq(schema.invites.tokenHash, codeHash),
            eq(schema.invites.status, 'PENDING'),
            gt(schema.invites.expiresAt, new Date()),
          ),
        )
        .limit(1)

      if (!invite) {
        throw new BadRequestError('Convite inválido ou expirado')
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
        throw new NotFoundError('Usuário não encontrado')
      }

      if (invite.email !== user.email) {
        throw new BadRequestError('Este convite pertence a outro usuário')
      }

      await db
        .update(schema.invites)
        .set({
          status: 'REJECTED',
        })
        .where(eq(schema.invites.id, invite.id))

      return reply.status(204).send()
    },
  )
}
