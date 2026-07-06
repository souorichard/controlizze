import { roleSchema } from '@controlizze/rbac'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { inviteStatusSchema } from '../../schemas.ts'

export const getInvite: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      schema: {
        tags: ['Invite'],
        summary: 'Get invite details',
        querystring: z.object({
          code: z.string(),
        }),
        response: {
          200: z.object({
            invite: z.object({
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
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.query

      const tokenHash = hashToken(code)

      const [invite] = await db
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
        .where(eq(schema.invites.tokenHash, tokenHash))
        .limit(1)

      if (!invite) {
        throw new NotFoundError('Invite not found')
      }

      return {
        invite,
      }
    },
  )
}
