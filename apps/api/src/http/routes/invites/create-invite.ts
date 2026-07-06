import { randomBytes } from 'node:crypto'
import { roleSchema } from '@controlizze/rbac'
import dayjs from 'dayjs'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { emails } from '../../../services/emails/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { hashToken } from '../../../utils/hash-token.ts'
import { ConflictError } from '../../errors/conflict-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const createInvite: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).post(
    '/',
    {
      schema: {
        tags: ['Invite'],
        summary: 'Create a new invite',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          email: z.email('Invalid email address').min(1, 'Email is required'),
          role: roleSchema,
        }),
        response: {
          201: z.object({
            inviteId: z.uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('create', 'Invite')) {
        throw new UnauthorizedError(
          'You do not have permission to create invites',
        )
      }

      const { email, role } = request.body

      const [existingInvite] = await db
        .select()
        .from(schema.invites)
        .where(
          and(
            eq(schema.invites.orgId, org.id),
            eq(schema.invites.email, email),
            eq(schema.invites.status, 'PENDING'),
          ),
        )
        .limit(1)

      if (existingInvite) {
        throw new ConflictError('An invite has already been sent to this email')
      }

      const [existingMember] = await db
        .select()
        .from(schema.members)
        .innerJoin(schema.users, eq(schema.members.userId, schema.users.id))
        .where(
          and(eq(schema.members.orgId, org.id), eq(schema.users.email, email)),
        )
        .limit(1)

      if (existingMember) {
        throw new ConflictError(
          'The user is already a member of this organization',
        )
      }

      const code = randomBytes(32).toString('hex')
      const codeHash = hashToken(code)

      const expiresAt = dayjs(new Date()).add(7, 'days').toDate()

      const [invite] = await db
        .insert(schema.invites)
        .values({
          tokenHash: codeHash,
          email,
          role,
          expiresAt,
          authorId: userId,
          orgId: org.id,
        })
        .returning({
          id: schema.invites.id,
        })

      const [author] = await db
        .select({ name: schema.users.name })
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1)

      await emails.sendInviteEmail({
        to: email,
        code,
        orgName: org.name,
        authorName: author.name,
        role,
      })

      return reply.status(201).send({
        inviteId: invite.id,
      })
    },
  )
}
