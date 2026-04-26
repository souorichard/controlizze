import { organizationSchema } from '@controlizze/rbac'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const updateOrgName: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).patch(
    '/',
    {
      schema: {
        tags: ['Organization'],
        summary: 'Update organization name',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          name: z.string().min(1, 'Name is required'),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { name } = request.body

      const authOrganization = organizationSchema.parse(org)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('update', authOrganization)) {
        throw new UnauthorizedError(
          `You're not allowed to update this organization`,
        )
      }

      await db
        .update(schema.organizations)
        .set({
          name,
        })
        .where(eq(schema.organizations.id, org.id))

      return reply.status(204).send()
    },
  )
}
