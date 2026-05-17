// src/__tests__/integration/transactions/delete-transaction.test.ts
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeCategory,
  makeMember,
  makeOrganization,
  makeTransaction,
  makeUser,
} from '../../helpers/factories.ts'

describe('DELETE /orgs/:slug/transactions/:transactionId', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to delete a transaction as OWNER', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, { type: 'EXPENSE' })
    const transaction = await makeTransaction(user.id, org.id, {
      categoryId: category.id,
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should be able to delete own transaction as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const category = await makeCategory(owner.id, org.id, { type: 'EXPENSE' })

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const transaction = await makeTransaction(member.id, org.id, {
      categoryId: category.id,
    })

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should not be able to delete another member transaction as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const category = await makeCategory(owner.id, org.id, { type: 'EXPENSE' })

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const transaction = await makeTransaction(owner.id, org.id, {
      categoryId: category.id,
    })

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })

  it('should not be able to delete a non existing transaction', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(
        `/orgs/${org.slug}/transactions/00000000-0000-0000-0000-000000000000`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it('should not be able to delete a transaction without authentication', async () => {
    const response = await supertest(app.server).delete(
      '/orgs/any-slug/transactions/00000000-0000-0000-0000-000000000000',
    )

    expect(response.status).toBe(401)
  })
})
