import type { FastifyInstance } from 'fastify'
import supertest from 'supertest'

export async function authenticate(
  app: FastifyInstance,
  email = 'john@example.com',
  password = '12345678',
) {
  const { body } = await supertest(app.server)
    .post('/sessions')
    .send({ email, password })

  return body.token as string
}
