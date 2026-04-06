import { env } from '@controlizze/env'
import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { healthCheck } from './routes/server/health-check.ts'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
  methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
})

app.register(healthCheck)

app.listen({ host: '0.0.0.0', port: env.SERVER_PORT }).then(() => {
  if (env.NODE_ENV !== 'production') {
    console.log(`🔥 HTTP server running on http://localhost:${env.SERVER_PORT}`)
    console.log(`📖 Docs available at http://localhost:${env.SERVER_PORT}/docs`)
  }
})
