import { and, eq, gt } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'

export const verifyEmail: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Verify email',
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

      const [tokenFromCode] = await db
        .select({
          id: schema.tokens.id,
          userId: schema.tokens.userId,
        })
        .from(schema.tokens)
        .where(
          and(
            eq(schema.tokens.tokenHash, codeHash),
            eq(schema.tokens.type, 'EMAIL_VERIFICATION'),
            gt(schema.tokens.expiresAt, new Date()),
          ),
        )
        .limit(1)

      if (!tokenFromCode) {
        throw new BadRequestError('Token inválido ou expirado')
      }

      await db.transaction(async (tx) => {
        await tx
          .update(schema.users)
          .set({
            emailVerifiedAt: new Date(),
          })
          .where(eq(schema.users.id, tokenFromCode.userId))

        await tx
          .delete(schema.tokens)
          .where(eq(schema.tokens.id, tokenFromCode.id))
      })

      return reply.status(204).send()
    },
  )
}
