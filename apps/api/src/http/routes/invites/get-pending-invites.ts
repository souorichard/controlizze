import { roleSchema } from '@controlizze/rbac'
import { and, desc, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { inviteStatusSchema } from '../../schemas.ts'

export const getPendingInvites: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Invite'],
        summary: 'Get all user pending invites',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            invites: z.array(
              z.object({
                id: z.uuid(),
                email: z.email(),
                role: roleSchema,
                status: inviteStatusSchema,
                expiresAt: z.date(),
                author: z
                  .object({
                    id: z.uuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.url().nullable(),
                  })
                  .nullable(),
                org: z.object({
                  name: z.string(),
                }),
                createdAt: z.date(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const [user] = await db
        .select({ id: schema.users.id, email: schema.users.email })
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1)

      if (!user) {
        throw new NotFoundError('Usuário não encontrado')
      }

      const invites = await db
        .select({
          id: schema.invites.id,
          email: schema.invites.email,
          role: schema.invites.role,
          status: schema.invites.status,
          expiresAt: schema.invites.expiresAt,
          author: {
            id: schema.users.id,
            name: schema.users.name,
            avatarUrl: schema.users.avatarUrl,
          },
          org: {
            name: schema.organizations.name,
          },
          createdAt: schema.invites.createdAt,
        })
        .from(schema.invites)
        .leftJoin(schema.users, eq(schema.invites.authorId, schema.users.id))
        .innerJoin(
          schema.organizations,
          eq(schema.invites.orgId, schema.organizations.id),
        )
        .where(
          and(
            eq(schema.invites.email, user.email),
            eq(schema.invites.status, 'PENDING'),
          ),
        )
        .orderBy(desc(schema.invites.createdAt))

      return {
        invites,
      }
    },
  )
}
