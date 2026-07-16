import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeOrganization, makeUser } from '../../helpers/factories.ts'

describe('GET /orgs/:slug/metrics/savings-rate', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get savings rate and transactions count', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.transactions).values([
      {
        title: 'Salary',
        type: 'INCOME',
        amount: 500000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Rent',
        type: 'EXPENSE',
        amount: 200000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/savings-rate`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    // rate = ((500000 - 200000) / 500000) * 100 = 60
    expect(response.body.rate).toBe(60)
    expect(response.body.transactionsCount).toBe(2)
  })
})
