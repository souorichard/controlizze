import { compare } from 'bcryptjs'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'
import { ForbiddenError } from '../../errors/forbidden-error.ts'

export const authenticateWithPassword: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Authenticate with email and password',
        body: z.object({
          email: z
            .email('Endereço de email inválido')
            .min(1, 'Email é obrigatório'),
          password: z
            .string()
            .min(1, 'Senha é obrigatória')
            .min(8, 'Senha deve ter pelo menos 6 caracteres'),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const [userFromEmail] = await db
        .select({
          id: schema.users.id,
          hashPassword: schema.users.passwordHash,
          emailVerifiedAt: schema.users.emailVerifiedAt,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1)

      if (!userFromEmail) {
        throw new BadRequestError('Usuário não encontrado')
      }

      if (!userFromEmail.emailVerifiedAt) {
        const hoursSinceCreation = dayjs().diff(
          dayjs(userFromEmail.createdAt),
          'hour',
        )

        if (hoursSinceCreation > 1) {
          throw new ForbiddenError('Verificação de email necessária')
        }
      }

      if (!userFromEmail.hashPassword) {
        throw new BadRequestError(
          'Usuário não possui senha cadastrada, por favor utilize outro método de autenticação',
        )
      }

      const isPassword = await compare(password, userFromEmail.hashPassword)

      if (!isPassword) {
        throw new BadRequestError('Credenciais inválidas')
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(200).send({ token })
    },
  )
}
