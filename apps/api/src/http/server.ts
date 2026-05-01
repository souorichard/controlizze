import { env } from '../env.ts'
import { registerJobs } from '../jobs/index.ts'
import { buildApp } from './app.ts'

const app = buildApp()

app.listen({ host: '0.0.0.0', port: env.SERVER_PORT }).then(() => {
  if (env.NODE_ENV !== 'production') {
    console.log(`🔥 HTTP server running on ${env.API_URL}`)
    console.log(`📖 Docs available at ${env.API_URL}/docs`)
  }
})

registerJobs()
