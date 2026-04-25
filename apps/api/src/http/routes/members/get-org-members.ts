import { roleSchema } from '@controlizze/rbac'
import { asc, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { members } from '../../../db/schema/members.ts'
import { users } from '../../../db/schema/users.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const getOrgMembers: FastifyPluginAsyncZod = async (app) => {
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
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'User')) {
        throw new UnauthorizedError(
          `You're not allowed to see organization members`,
        )
      }

      const membersWithRole = await db
        .select({
          id: members.id,
          name: users.name,
          email: users.email,
          role: members.role,
          avatarUrl: users.avatarUrl,
          userId: users.id,
        })
        .from(members)
        .innerJoin(users, eq(members.userId, users.id))
        .where(eq(members.orgId, org.id))
        .orderBy(asc(members.role))

      return {
        members: membersWithRole,
      }
    },
  )
}
