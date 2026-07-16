import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeOrganization,
  makeTransaction,
  makeUser,
} from '../../helpers/factories.ts'

describe('GET /orgs/:slug/transactions/:transactionId', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get a transaction details', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const transaction = await makeTransaction(user.id, org.id, {
      title: 'Groceries',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transaction).toBeDefined()
    expect(response.body.transaction.id).toBe(transaction.id)
    expect(response.body.transaction.title).toBe('Groceries')
  })
})
