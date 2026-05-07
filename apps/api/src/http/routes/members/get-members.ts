import { roleSchema } from '@controlizze/rbac'
import { asc, count, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const getMembers: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Member'],
        summary: 'Get all organization members',
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
            members: z.array(
              z.object({
                id: z.uuid(),
                name: z.string().nullable(),
                email: z.string(),
                role: roleSchema,
                avatarUrl: z.url().nullable(),
                userId: z.uuid(),
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
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'User')) {
        throw new UnauthorizedError(
          `You're not allowed to see organization members`,
        )
      }

      const [{ total }] = await db
        .select({ total: count() })
        .from(schema.members)
        .where(eq(schema.members.orgId, org.id))

      const membersWithRole = await db
        .select({
          id: schema.members.id,
          name: schema.users.name,
          email: schema.users.email,
          role: schema.members.role,
          avatarUrl: schema.users.avatarUrl,
          userId: schema.users.id,
        })
        .from(schema.members)
        .innerJoin(schema.users, eq(schema.members.userId, schema.users.id))
        .where(eq(schema.members.orgId, org.id))
        .limit(perPage)
        .offset((page - 1) * perPage)
        .orderBy(asc(schema.members.role))

      return {
        members: membersWithRole,
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
