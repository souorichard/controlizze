import { env } from '@controlizze/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schema: './src/db/schema/**.ts',
  out: './src/db/migrations',
  casing: 'snake_case',
})
