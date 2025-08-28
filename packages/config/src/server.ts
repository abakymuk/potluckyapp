import { ServerEnvSchema } from './schema'

const parsed = ServerEnvSchema.safeParse({
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
  SENTRY_DSN: process.env.SENTRY_DSN,
})

// server vars опциональны на T0.2 — валидируем, но не падаем
export const envServer = parsed.success ? parsed.data : {}
