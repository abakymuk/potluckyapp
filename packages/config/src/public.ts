import { PublicEnvSchema } from './schema'
import type { FeatureFlags } from './flags'

/**
 * Next.js встраивает process.env.* на этапе сборки.
 * В edge/runtime это тоже работает, но ПРИ УСЛОВИИ, что переменные помечены корректно.
 * Здесь валидируем public env лениво при первом обращении.
 */
let _envPublic: ReturnType<typeof PublicEnvSchema.parse> | null = null
let _flags: FeatureFlags | null = null

const getEnvPublic = () => {
  if (!_envPublic) {
    const parsed = PublicEnvSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ONLINE_ORDERING_V1: process.env.ONLINE_ORDERING_V1,
      ORDER_QUEUE_V1: process.env.ORDER_QUEUE_V1,
      AI_ADVISOR_V1: process.env.AI_ADVISOR_V1,
    })

    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
      throw new Error(
        `[config] Public env validation failed: ${issues}. ` +
        `Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.`,
      )
    }
    _envPublic = parsed.data
  }
  return _envPublic
}

const getFlags = (): FeatureFlags => {
  if (!_flags) {
    const env = getEnvPublic()
    _flags = {
      ONLINE_ORDERING_V1: !!env.ONLINE_ORDERING_V1,
      ORDER_QUEUE_V1: !!env.ORDER_QUEUE_V1,
      AI_ADVISOR_V1: !!env.AI_ADVISOR_V1,
    }
  }
  return _flags
}

export const envPublic = getEnvPublic()
export const flags = getFlags()

/** Простой флаг-чекер. Позже добавим стратегии per-tenant/user. */
export const isEnabled = (flag: keyof typeof flags) => !!flags[flag]
