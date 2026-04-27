import { hash } from 'bcryptjs'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'

export const resetPassword: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Reset password',
        body: z.object({
          code: z.string(),
          password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must be at least 6 characters long'),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body

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
            eq(schema.tokens.type, 'PASSWORD_RECOVER'),
            eq(schema.tokens.expiresAt, new Date()),
          ),
        )
        .limit(1)

      if (!tokenFromCode) {
        throw new BadRequestError('Invalid or expired token')
      }

      const passwordHash = await hash(password, 8)

      await db.transaction(async (tx) => {
        await tx
          .update(schema.users)
          .set({
            passwordHash,
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
