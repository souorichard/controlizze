// src/__tests__/integration/transactions/create-transaction.test.ts
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeCategory,
  makeMember,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('POST /orgs/:slug/transactions', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to create a transaction', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/transactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Groceries',
        type: 'EXPENSE',
        categoryId: category.id,
        amount: 150,
        status: 'PAID',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('transactionId')
  })

  it('should be able to create a transaction as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const category = await makeCategory(owner.id, org.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/transactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Groceries',
        type: 'EXPENSE',
        categoryId: category.id,
        amount: 150,
        status: 'PAID',
      })

    expect(response.status).toBe(201)
  })

  it('should not be able to create a transaction without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/transactions`)
      .send({
        title: 'Groceries',
        type: 'EXPENSE',
        categoryId: '00000000-0000-0000-0000-000000000000',
        amount: 150,
        status: 'PAID',
      })

    expect(response.status).toBe(401)
  })
})
