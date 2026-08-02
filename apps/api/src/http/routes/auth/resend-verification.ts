// resend-verification.ts
import { randomBytes } from 'node:crypto'
import dayjs from 'dayjs'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { emails } from '../../../services/emails/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'

export const resendVerification: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Resend email verification',
        body: z.object({
          email: z.email('Invalid email address'),
        }),
        response: {
          201: z.void(),
        },
      },
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '5 minutes',
          errorResponseBuilder: (_, context) => ({
            message: `Too many requests, please try again in ${Math.ceil(context.ttl / 1000)} seconds`,
          }),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const [user] = await db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          emailVerifiedAt: schema.users.emailVerifiedAt,
        })
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1)

      if (!user || user.emailVerifiedAt) {
        return reply.status(201).send()
      }

      await db
        .delete(schema.tokens)
        .where(
          and(
            eq(schema.tokens.userId, user.id),
            eq(schema.tokens.type, 'EMAIL_VERIFICATION'),
          ),
        )

      const code = randomBytes(32).toString('hex')
      const codeHash = hashToken(code)

      await db.insert(schema.tokens).values({
        tokenHash: codeHash,
        type: 'EMAIL_VERIFICATION',
        userId: user.id,
        expiresAt: dayjs().add(1, 'hour').toDate(),
      })

      await emails.sendVerifyEmailEmail({
        to: email,
        code,
        userName: user.name,
      })

      return reply.status(201).send()
    },
  )
}
