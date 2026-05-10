import { randomBytes } from 'node:crypto'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'
import { createTestApp } from '../../helpers/app.ts'
import { cleanDatabase } from '../../helpers/db.ts'

describe('POST /sessions/verify-email', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let userId: string
  let validCode: string

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()

    const [user] = await db
      .insert(schema.users)
      .values({
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: null,
      })
      .returning({ id: schema.users.id })

    userId = user.id
    validCode = randomBytes(32).toString('hex')
    const tokenHash = hashToken(validCode)

    await db.insert(schema.tokens).values({
      tokenHash,
      type: 'EMAIL_VERIFICATION',
      userId,
      expiresAt: dayjs().add(24, 'hour').toDate(),
    })
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to verify email with valid token', async () => {
    const response = await supertest(app.server).post(
      `/sessions/verify-email?code=${validCode}`,
    )

    expect(response.status).toBe(204)

    const [user] = await db
      .select({ emailVerifiedAt: schema.users.emailVerifiedAt })
      .from(schema.users)
      .where(eq(schema.users.id, userId))

    expect(user.emailVerifiedAt).not.toBeNull()
  })

  it('should not be able to verify email with invalid token', async () => {
    const response = await supertest(app.server).post(
      '/sessions/verify-email?code=invalidtoken',
    )

    expect(response.status).toBe(400)
  })

  it('should not be able to verify email with expired token', async () => {
    const expiredCode = randomBytes(32).toString('hex')

    await db.insert(schema.tokens).values({
      tokenHash: hashToken(expiredCode),
      type: 'EMAIL_VERIFICATION',
      userId,
      expiresAt: dayjs().subtract(1, 'hour').toDate(),
    })

    const response = await supertest(app.server).post(
      `/sessions/verify-email?code=${expiredCode}`,
    )

    expect(response.status).toBe(400)
  })
})
