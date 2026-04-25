import { roleSchema } from '@controlizze/rbac'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { members } from '../../../db/schema/members.ts'
import { organizations } from '../../../db/schema/organizations.ts'
import { auth } from '../../middlewares/auth.ts'

export const getOrgs: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Organization'],
        summary: 'Get organizations where user is a member',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            orgs: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().nullable(),
                role: roleSchema,
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const orgs = await db
        .select({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          avatarUrl: organizations.avatarUrl,
          role: members.role,
        })
        .from(organizations)
        .innerJoin(members, eq(organizations.id, members.orgId))
        .where(eq(members.userId, userId))

      return { orgs }
    },
  )
}
