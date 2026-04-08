import { env } from '@controlizze/env'
import { buildApp } from './app.ts'

const app = buildApp()

app.listen({ host: '0.0.0.0', port: env.SERVER_PORT }).then(() => {
  if (env.NODE_ENV !== 'production') {
    console.log(`🔥 HTTP server running on http://localhost:${env.SERVER_PORT}`)
    console.log(`📖 Docs available at http://localhost:${env.SERVER_PORT}/docs`)
  }
})
