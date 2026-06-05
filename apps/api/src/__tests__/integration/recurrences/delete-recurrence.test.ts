import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeCategory,
  makeMember,
  makeOrganization,
  makeRecurrence,
  makeUser,
} from '../../helpers/factories.ts'

describe('DELETE /orgs/:slug/recurrences/:recurrenceId', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to delete a recurrence as OWNER', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, { type: 'INCOME' })
    const recurrence = await makeRecurrence(user.id, org.id, category.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/recurrences/${recurrence.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should be able to delete own recurrence as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const category = await makeCategory(owner.id, org.id, { type: 'INCOME' })

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const recurrence = await makeRecurrence(member.id, org.id, category.id)

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/recurrences/${recurrence.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should not be able to delete another member recurrence as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const category = await makeCategory(owner.id, org.id, { type: 'INCOME' })

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const recurrence = await makeRecurrence(owner.id, org.id, category.id)

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/recurrences/${recurrence.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })

  it('should not be able to delete a non existing recurrence', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(
        `/orgs/${org.slug}/recurrences/00000000-0000-0000-0000-000000000000`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it('should not be able to delete a recurrence without authentication', async () => {
    const response = await supertest(app.server).delete(
      '/orgs/any-slug/recurrences/00000000-0000-0000-0000-000000000000',
    )

    expect(response.status).toBe(401)
  })
})
