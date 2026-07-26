import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createAvatar } from '../../../utils/create-avatar.ts'
import { generateSlugWithSuffix } from '../../../utils/create-slug.ts'
import { auth } from '../../middlewares/auth.ts'

export const createOrg: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).post(
    '/',
    {
      schema: {
        tags: ['Organization'],
        summary: 'Create a new organization',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string().min(1, 'Name is required'),
          description: z.string().optional(),
        }),
        response: {
          201: z.object({
            orgId: z.uuid(),
            orgSlug: z.string(),
          }),
        },
      },
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '5 minutes',
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)

      const { name, description } = request.body

      const org = await db.transaction(async (tx) => {
        const [createdOrg] = await tx
          .insert(schema.organizations)
          .values({
            name,
            slug: generateSlugWithSuffix(name),
            description,
            avatarUrl: createAvatar(name, 'glass'),
            ownerId: userId,
          })
          .returning()

        await tx.insert(schema.members).values({
          userId,
          orgId: createdOrg.id,
          role: 'OWNER',
        })

        return createdOrg
      })

      return reply.status(201).send({
        orgId: org.id,
        orgSlug: org.slug,
      })
    },
  )
}
