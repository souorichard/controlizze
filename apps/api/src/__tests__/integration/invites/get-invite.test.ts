import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeInvite,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('GET /invites', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get invite details', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const { code } = await makeInvite(org.id, owner.id, 'invited@example.com')

    const response = await supertest(app.server).get(`/invites?code=${code}`)

    expect(response.status).toBe(200)
    expect(response.body.invite).toMatchObject({
      email: 'invited@example.com',
      role: 'MEMBER',
      status: 'PENDING',
      org: { name: org.name },
      author: { name: owner.name },
    })
  })

  it('should not be able to get invite with invalid code', async () => {
    const response = await supertest(app.server).get(
      '/invites?code=invalidcode',
    )

    expect(response.status).toBe(404)
  })
})
