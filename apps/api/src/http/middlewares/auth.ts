import dayjs from 'dayjs'
import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { db } from '../../db/index.ts'
import { schema } from '../../db/schema/index.ts'
import { ForbiddenError } from '../errors/forbidden-error.ts'
import { UnauthorizedError } from '../errors/unauthorized-error.ts'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        throw new UnauthorizedError('Invalid or expired token')
      }
    }

    request.verifyEmailVerification = async (userId: string) => {
      const [user] = await db
        .select({
          emailVerifiedAt: schema.users.emailVerifiedAt,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1)

      if (!user) {
        throw new UnauthorizedError('User not found')
      }

      if (!user.emailVerifiedAt) {
        const hoursSinceCreation = dayjs().diff(dayjs(user.createdAt), 'hour')

        if (hoursSinceCreation > 24) {
          throw new ForbiddenError('Email verification required')
        }
      }
    }

    request.getUserMembership = async (slug: string, userId: string) => {
      const [member] = await db
        .select({
          org: schema.organizations,
          membership: schema.members,
        })
        .from(schema.members)
        .innerJoin(
          schema.organizations,
          eq(schema.members.orgId, schema.organizations.id),
        )
        .innerJoin(
          schema.users,
          eq(schema.organizations.ownerId, schema.users.id),
        )
        .where(
          and(
            eq(schema.members.userId, userId),
            eq(schema.organizations.slug, slug),
          ),
        )
        .limit(1)

      if (!member) {
        throw new UnauthorizedError(`You are not a member of this organization`)
      }

      return {
        org: member.org,
        membership: member.membership,
      }
    }
  })
})
