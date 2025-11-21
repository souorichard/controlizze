import { env } from '@controlizze/env'

import { buildApp } from './app'

const app = buildApp()

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`🚀 Server is running at:   ${env.NEXT_PUBLIC_API_URL}`)
  console.log(`📖 API Docs is running at: ${env.NEXT_PUBLIC_API_URL}/docs`)
})
