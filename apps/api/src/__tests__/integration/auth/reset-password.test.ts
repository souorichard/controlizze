import { randomBytes } from 'node:crypto'
import { compare } from 'bcryptjs'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'
import { createTestApp } from '../../helpers/app.ts'
import { cleanDatabase } from '../../helpers/db.ts'

describe('POST /sessions/forgot-password/reset', () => {
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
      type: 'PASSWORD_RECOVER',
      userId,
      expiresAt: dayjs().add(1, 'hour').toDate(),
    })
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to reset password with valid token', async () => {
    const response = await supertest(app.server)
      .post(`/sessions/forgot-password/reset?code=${validCode}`)
      .send({ password: 'newpassword123' })

    expect(response.status).toBe(204)

    const [user] = await db
      .select({ passwordHash: schema.users.passwordHash })
      .from(schema.users)
      .where(eq(schema.users.id, userId))

    expect(user.passwordHash).not.toBeNull()
    const passwordUpdated = await compare(
      'newpassword123',
      user.passwordHash as string,
    )

    expect(passwordUpdated).toBe(true)
  })

  it('should not be able to reset password with invalid token', async () => {
    const response = await supertest(app.server)
      .post('/sessions/forgot-password/reset?code=invalidtoken')
      .send({ password: 'newpassword123' })

    expect(response.status).toBe(400)
  })

  it('should not be able to reset password with expired token', async () => {
    await db.insert(schema.tokens).values({
      tokenHash: hashToken('expiredcode'),
      type: 'PASSWORD_RECOVER',
      userId,
      expiresAt: dayjs().subtract(1, 'hour').toDate(),
    })

    const response = await supertest(app.server)
      .post('/sessions/forgot-password/reset?code=expiredcode')
      .send({ password: 'newpassword123' })

    expect(response.status).toBe(400)
  })
})
