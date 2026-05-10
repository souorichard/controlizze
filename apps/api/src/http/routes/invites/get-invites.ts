import { roleSchema } from '@controlizze/rbac'
import { count, desc, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { inviteStatusSchema } from '../../schemas/index.ts'

export const getInvites: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Invite'],
        summary: 'Get all organization invites',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          perPage: z.coerce.number().min(1).max(50).default(10),
        }),
        response: {
          200: z.object({
            invites: z.array(
              z.object({
                id: z.uuid(),
                email: z.email(),
                role: roleSchema,
                status: inviteStatusSchema,
                expiresAt: z.date(),
                createdAt: z.date(),
                author: z
                  .object({
                    id: z.uuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.url().nullable(),
                  })
                  .nullable(),
              }),
            ),
            meta: z.object({
              page: z.number(),
              perPage: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const { page, perPage } = request.query

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'Invite')) {
        throw new UnauthorizedError(
          `You're not allowed to see organization invites`,
        )
      }

      const [{ total }] = await db
        .select({ total: count() })
        .from(schema.invites)
        .where(eq(schema.invites.orgId, org.id))

      const invites = await db
        .select({
          id: schema.invites.id,
          email: schema.invites.email,
          role: schema.invites.role,
          status: schema.invites.status,
          expiresAt: schema.invites.expiresAt,
          createdAt: schema.invites.createdAt,
          author: {
            id: schema.users.id,
            name: schema.users.name,
            avatarUrl: schema.users.avatarUrl,
          },
        })
        .from(schema.invites)
        .leftJoin(schema.users, eq(schema.invites.authorId, schema.users.id))
        .where(eq(schema.invites.orgId, org.id))
        .limit(perPage)
        .offset((page - 1) * perPage)
        .orderBy(desc(schema.invites.createdAt))

      return {
        invites,
        meta: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      }
    },
  )
}
