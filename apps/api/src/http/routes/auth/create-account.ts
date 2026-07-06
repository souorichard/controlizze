import { randomBytes } from 'node:crypto'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { emails } from '../../../services/emails/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'
import { ConflictError } from '../../errors/conflict-error.ts'

export const createAccount: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string().min(1, 'Name is required'),
          email: z.email('Invalid email address').min(1, 'Email is required'),
          password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must be at least 8 characters'),
        }),
        response: {
          201: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const [userWithSameEmail] = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1)

      if (userWithSameEmail) {
        throw new ConflictError('A user with this email already exists')
      }

      const passwordHash = await hash(password, 8)

      const code = randomBytes(32).toString('hex')
      const codeHash = hashToken(code)

      await db.transaction(async (tx) => {
        const [user] = await tx
          .insert(schema.users)
          .values({
            name,
            email,
            passwordHash,
          })
          .returning()

        await tx.insert(schema.tokens).values({
          tokenHash: codeHash,
          type: 'EMAIL_VERIFICATION',
          userId: user.id,
          expiresAt: dayjs().add(1, 'hour').toDate(),
        })
      })

      await emails.sendVerifyEmailEmail({
        to: email,
        code,
        userName: name,
      })

      return reply.status(201).send()
    },
  )
}
