import { roleSchema } from '@controlizze/rbac'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
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
      await request.verifyEmailVerification(userId)

      const orgs = await db
        .select({
          id: schema.organizations.id,
          name: schema.organizations.name,
          slug: schema.organizations.slug,
          avatarUrl: schema.organizations.avatarUrl,
          role: schema.members.role,
        })
        .from(schema.organizations)
        .innerJoin(
          schema.members,
          eq(schema.organizations.id, schema.members.orgId),
        )
        .where(eq(schema.members.userId, userId))

      return { orgs }
    },
  )
}
