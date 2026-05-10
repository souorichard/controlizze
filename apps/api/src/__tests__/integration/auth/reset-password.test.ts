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
import { makeUser } from '../../helpers/factories.ts'

describe('POST /sessions/forgot-password/reset', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to reset password with valid token', async () => {
    const user = await makeUser()
    const code = randomBytes(32).toString('hex')

    await db.insert(schema.tokens).values({
      tokenHash: hashToken(code),
      type: 'PASSWORD_RECOVER',
      userId: user.id,
      expiresAt: dayjs().add(1, 'hour').toDate(),
    })

    const response = await supertest(app.server)
      .post(`/sessions/forgot-password/reset?code=${code}`)
      .send({ password: 'newpassword123' })

    expect(response.status).toBe(204)

    const [updated] = await db
      .select({ passwordHash: schema.users.passwordHash })
      .from(schema.users)
      .where(eq(schema.users.id, user.id))

    expect(updated.passwordHash).not.toBeNull()
    const passwordUpdated = await compare(
      'newpassword123',
      updated.passwordHash as string,
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
    const user = await makeUser()
    const code = randomBytes(32).toString('hex')

    await db.insert(schema.tokens).values({
      tokenHash: hashToken(code),
      type: 'PASSWORD_RECOVER',
      userId: user.id,
      expiresAt: dayjs().subtract(1, 'hour').toDate(),
    })

    const response = await supertest(app.server)
      .post(`/sessions/forgot-password/reset?code=${code}`)
      .send({ password: 'newpassword123' })

    expect(response.status).toBe(400)
  })
})
