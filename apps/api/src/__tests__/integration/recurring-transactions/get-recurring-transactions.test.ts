import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeCategory,
  makeOrganization,
  makeRecurringTransaction,
  makeUser,
} from '../../helpers/factories.ts'

describe('GET /orgs/:slug/recurring-transactions', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get recurring transactions', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, { type: 'INCOME' })

    await makeRecurringTransaction(user.id, org.id, category.id, {
      title: 'Salary',
    })
    await makeRecurringTransaction(user.id, org.id, category.id, {
      title: 'Bonus',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/recurring-transactions`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.recurringTransactions).toHaveLength(2)
    expect(response.body.meta).toMatchObject({
      page: 1,
      perPage: 10,
      total: 2,
      totalPages: 1,
    })
  })

  it('should be able to filter by title', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, { type: 'INCOME' })

    await makeRecurringTransaction(user.id, org.id, category.id, {
      title: 'Salary',
    })
    await makeRecurringTransaction(user.id, org.id, category.id, {
      title: 'Rent',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/recurring-transactions?title=sal`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.recurringTransactions).toHaveLength(1)
    expect(response.body.recurringTransactions[0].title).toBe('Salary')
  })

  it('should be able to filter by type', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const incomeCategory = await makeCategory(user.id, org.id, {
      type: 'INCOME',
    })
    const expenseCategory = await makeCategory(user.id, org.id, {
      name: 'Rent',
      type: 'EXPENSE',
    })

    await makeRecurringTransaction(user.id, org.id, incomeCategory.id, {
      title: 'Salary',
      type: 'INCOME',
    })
    await makeRecurringTransaction(user.id, org.id, expenseCategory.id, {
      title: 'Rent',
      type: 'EXPENSE',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/recurring-transactions?type=INCOME`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.recurringTransactions).toHaveLength(1)
    expect(response.body.recurringTransactions[0].title).toBe('Salary')
  })

  it('should be able to filter by status', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, { type: 'INCOME' })

    await makeRecurringTransaction(user.id, org.id, category.id, {
      title: 'Salary',
      status: 'ACTIVE',
    })
    await makeRecurringTransaction(user.id, org.id, category.id, {
      title: 'Bonus',
      status: 'PAUSED',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/recurring-transactions?status=ACTIVE`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.recurringTransactions).toHaveLength(1)
    expect(response.body.recurringTransactions[0].title).toBe('Salary')
  })

  it('should be able to filter by frequency', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, { type: 'INCOME' })

    await makeRecurringTransaction(user.id, org.id, category.id, {
      title: 'Salary',
      frequency: 'MONTHLY',
    })
    await makeRecurringTransaction(user.id, org.id, category.id, {
      title: 'Bonus',
      frequency: 'YEARLY',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/recurring-transactions?frequency=MONTHLY`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.recurringTransactions).toHaveLength(1)
    expect(response.body.recurringTransactions[0].title).toBe('Salary')
  })

  it('should not be able to get recurring transactions without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/recurring-transactions`,
    )

    expect(response.status).toBe(401)
  })
})
