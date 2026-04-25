import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { db } from '../../db/index.ts'
import { members } from '../../db/schema/members.ts'
import { organizations } from '../../db/schema/organizations.ts'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        throw new Error('Invalid auth token')
      }
    }

    request.getUserMembership = async (slug: string) => {
      const userId = await request.getCurrentUserId()

      const [member] = await db
        .select({
          organization: organizations,
          membership: members,
        })
        .from(members)
        .innerJoin(organizations, eq(members.orgId, organizations.id))
        .where(and(eq(members.userId, userId), eq(organizations.slug, slug)))
        .limit(1)

      if (!member) {
        throw new Error(`You're not a member of this organization`)
      }

      return {
        org: member.organization,
        membership: member.membership,
      }
    }
  })
})
