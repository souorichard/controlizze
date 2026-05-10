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
import { makeUser } from '../../helpers/factories.ts'

describe('POST /sessions/verify-email', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to verify email with valid token', async () => {
    const user = await makeUser()
    const code = randomBytes(32).toString('hex')

    await db.insert(schema.tokens).values({
      tokenHash: hashToken(code),
      type: 'EMAIL_VERIFICATION',
      userId: user.id,
      expiresAt: dayjs().add(24, 'hour').toDate(),
    })

    const response = await supertest(app.server).post(
      `/sessions/verify-email?code=${code}`,
    )

    expect(response.status).toBe(204)

    const [updated] = await db
      .select({ emailVerifiedAt: schema.users.emailVerifiedAt })
      .from(schema.users)
      .where(eq(schema.users.id, user.id))

    expect(updated.emailVerifiedAt).not.toBeNull()
  })

  it('should not be able to verify email with invalid token', async () => {
    const response = await supertest(app.server).post(
      '/sessions/verify-email?code=invalidtoken',
    )

    expect(response.status).toBe(400)
  })

  it('should not be able to verify email with expired token', async () => {
    const user = await makeUser()
    const code = randomBytes(32).toString('hex')

    await db.insert(schema.tokens).values({
      tokenHash: hashToken(code),
      type: 'EMAIL_VERIFICATION',
      userId: user.id,
      expiresAt: dayjs().subtract(1, 'hour').toDate(),
    })

    const response = await supertest(app.server).post(
      `/sessions/verify-email?code=${code}`,
    )

    expect(response.status).toBe(400)
  })
})
