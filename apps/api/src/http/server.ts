import { env } from '@controlizze/env'

import { buildApp } from './app'

const app = buildApp()

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server running!')
})
