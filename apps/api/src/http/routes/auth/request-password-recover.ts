import { randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'

export const requestPasswordRecover: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Request password recover',
        body: z.object({
          email: z.email('Invalid email address').min(1, 'Email is required'),
        }),
        response: {
          201: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const [userFromEmail] = await db
        .select({
          id: schema.users.id,
        })
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1)

      if (!userFromEmail) {
        return reply.status(201).send()
      }

      const code = randomBytes(32).toString('hex')
      const codeHash = hashToken(code)

      const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 min

      await db.insert(schema.tokens).values({
        tokenHash: codeHash,
        type: 'PASSWORD_RECOVER',
        userId: userFromEmail.id,
        expiresAt,
      })

      // todo: send email with code
      // await sendRecoverPasswordEmail(user, code)

      return reply.status(201).send()
    },
  )
}
