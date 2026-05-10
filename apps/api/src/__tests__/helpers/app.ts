import { buildApp } from '../../http/app.ts'

export async function createTestApp() {
  const app = await buildApp()
  await app.ready()
  return app
}
