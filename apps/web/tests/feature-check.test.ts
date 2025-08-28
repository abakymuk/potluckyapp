import { describe, it, expect, beforeAll } from 'vitest'

// Импортируем через require, чтобы подменить env до evaluate модуля
const loadRoute = async () => {
  // Настроим required public env
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon_key_1234567890'
  // Сброс кеша config
  const cfgPath = require.resolve('@potlucky/config/dist/index.cjs')
  delete require.cache[cfgPath]
  return await import('../app/api/feature-check/route')
}

describe('feature-check route', () => {
  it('returns 404 when flag is off', async () => {
    process.env.ONLINE_ORDERING_V1 = 'false'
    const { GET } = await loadRoute()
    const res = await GET()
    expect(res.status).toBe(404)
  })

  it('returns 200 json when flag is on', async () => {
    process.env.ONLINE_ORDERING_V1 = 'true'
    const { GET } = await loadRoute()
    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ feature: 'ONLINE_ORDERING_V1', enabled: true })
  })
})
