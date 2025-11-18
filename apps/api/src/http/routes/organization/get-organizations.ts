import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['Organization'],
          summary: 'Get organizations where user is a member.',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.uuid(),
                  name: z.string(),
                  slug: z.string(),
                  plan: z.union([z.literal('FREE'), z.literal('PRO')]),
                  avatarUrl: z.url().nullable(),
                  role: z.union([
                    z.literal('ADMIN'),
                    z.literal('MEMBER'),
                    z.literal('BILLING'),
                  ]),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const organizations = await prisma.organization.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            domain: true,
            plan: true,
            avatarUrl: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
        })

        const organizationWithUserRole = organizations.map(
          ({ members, ...organization }) => {
            return {
              ...organization,
              role: members[0].role,
            }
          },
        )

        return {
          organizations: organizationWithUserRole,
        }
      },
    )
}
