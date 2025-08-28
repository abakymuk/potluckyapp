import { z } from 'zod'

/** Утилита: безопасно приводим строку env в boolean */
export const toBool = (v: unknown, def = false) => {
  if (typeof v === 'boolean') return v
  if (typeof v !== 'string') return def
  const s = v.trim().toLowerCase()
  return s === 'true' || s === '1' || s === 'yes' || s === 'on'
}

/** PUBLIC env — доступно на клиенте (NEXT_PUBLIC_*) */
export const PublicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),

  // фичефлаги как строки → приводим к boolean с дефолтом false
  ONLINE_ORDERING_V1: z.string().optional().transform(v => toBool(v, false)),
  ORDER_QUEUE_V1: z.string().optional().transform(v => toBool(v, false)),
  AI_ADVISOR_V1: z.string().optional().transform(v => toBool(v, false)),
})

/** SERVER env — только на сервере/edge (не экспонируем в браузер) */
export const ServerEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
})
