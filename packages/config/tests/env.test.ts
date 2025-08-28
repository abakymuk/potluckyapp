import { describe, it, expect } from 'vitest'

// Важно: тестируем через свежий импорт (эмулируем разные env)
const freshImport = async (vars: Record<string, string | undefined>) => {
  // Очищаем env переменные
  for (const [k] of Object.entries(process.env)) {
    if (k.startsWith('NEXT_PUBLIC_') || ['ONLINE_ORDERING_V1','ORDER_QUEUE_V1','AI_ADVISOR_V1'].includes(k)) {
      delete process.env[k]
    }
  }
  Object.assign(process.env, vars)
  
  // Очищаем кеш модулей
  const moduleCache = require.cache
  Object.keys(moduleCache).forEach(key => {
    if (key.includes('packages/config/src')) {
      delete moduleCache[key]
    }
  })
  
  return await import('../src/public')
}

describe('config/public env', () => {
  it('fails without required NEXT_PUBLIC_*', async () => {
    await expect(
      freshImport({
        NEXT_PUBLIC_SUPABASE_URL: undefined,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
      })
    ).rejects.toThrow(/Public env validation failed/)
  })

  it('parses flags booleans', async () => {
    const mod = await freshImport({
      NEXT_PUBLIC_SUPABASE_URL: 'https://wnqzzplxfoutblsksvud.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducXp6cGx4Zm91dGJsc2tzdnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTI2OTUsImV4cCI6MjA3MTkyODY5NX0.xKBvnarYHs3qAV1ug5HVNBdfiERMOGv23gCZWYfvFtk',
      ONLINE_ORDERING_V1: 'true',
      ORDER_QUEUE_V1: '0',
      AI_ADVISOR_V1: 'yes'
    })
    expect(mod.flags.ONLINE_ORDERING_V1).toBe(true)
    expect(mod.flags.ORDER_QUEUE_V1).toBe(false)
    expect(mod.flags.AI_ADVISOR_V1).toBe(true)
    expect(mod.isEnabled('ONLINE_ORDERING_V1')).toBe(true)
  })
})
