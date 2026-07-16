import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'

describe('GET /health', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should return OK when database is available', async () => {
    const response = await supertest(app.server).get('/health')

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('OK')
    expect(response.body.database).toBe('OK')
  })
})
