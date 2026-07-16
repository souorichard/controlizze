// src/__tests__/integration/transactions/get-transactions.test.ts
import dayjs from 'dayjs'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeCategory,
  makeOrganization,
  makeTransaction,
  makeUser,
} from '../../helpers/factories.ts'

describe('GET /orgs/:slug/transactions', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get transactions', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await makeTransaction(user.id, org.id, { title: 'Groceries' })
    await makeTransaction(user.id, org.id, { title: 'Rent' })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/transactions`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toHaveLength(2)
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

    await makeTransaction(user.id, org.id, { title: 'Groceries' })
    await makeTransaction(user.id, org.id, { title: 'Rent' })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/transactions?title=gro`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toHaveLength(1)
    expect(response.body.transactions[0].title).toBe('Groceries')
  })

  it('should be able to filter by type', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await makeTransaction(user.id, org.id, { title: 'Salary', type: 'INCOME' })
    await makeTransaction(user.id, org.id, { title: 'Rent', type: 'EXPENSE' })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/transactions?type=INCOME`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toHaveLength(1)
    expect(response.body.transactions[0].title).toBe('Salary')
  })

  it('should be able to filter by status', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await makeTransaction(user.id, org.id, {
      title: 'Groceries',
      status: 'PAID',
    })
    await makeTransaction(user.id, org.id, { title: 'Rent', status: 'PENDING' })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/transactions?status=PAID`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toHaveLength(1)
    expect(response.body.transactions[0].title).toBe('Groceries')
  })

  it('should be able to filter by category', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id)

    await makeTransaction(user.id, org.id, {
      title: 'Groceries',
      categoryId: category.id,
    })
    await makeTransaction(user.id, org.id, { title: 'Rent' })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/transactions?categoryId=${category.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toHaveLength(1)
    expect(response.body.transactions[0].title).toBe('Groceries')
  })

  it('should be able to filter by date range', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await makeTransaction(user.id, org.id, {
      title: 'Current',
      transactionDate: dayjs().toDate(),
    })
    await makeTransaction(user.id, org.id, {
      title: 'Old',
      transactionDate: dayjs().subtract(2, 'month').toDate(),
    })

    const token = await authenticate(app)

    const startDate = dayjs().subtract(7, 'days').toISOString()
    const endDate = dayjs().add(1, 'day').toISOString()

    const response = await supertest(app.server)
      .get(
        `/orgs/${org.slug}/transactions?startDate=${startDate}&endDate=${endDate}`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toHaveLength(1)
    expect(response.body.transactions[0].title).toBe('Current')
  })

  it('should be able to paginate transactions', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    for (let i = 0; i < 15; i++) {
      await makeTransaction(user.id, org.id, { title: `Transaction ${i}` })
    }

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/transactions?page=2&perPage=10`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toHaveLength(5)
    expect(response.body.meta).toMatchObject({
      page: 2,
      perPage: 10,
      total: 15,
      totalPages: 2,
    })
  })

  it('should not be able to get transactions without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/transactions`,
    )

    expect(response.status).toBe(401)
  })
})
