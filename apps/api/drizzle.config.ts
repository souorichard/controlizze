import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: DATABASE_URL is required and validated at runtime
    url: process.env.DATABASE_URL!,
  },
  schema: './src/db/schema/**.ts',
  out: './src/db/migrations',
  casing: 'snake_case',
})
