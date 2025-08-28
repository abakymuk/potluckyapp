import { describe, it, expect } from 'vitest'
import { GET } from '../app/api/healthz/route'

describe('healthz route', () => {
  it('returns edge ok json', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ ok: true, runtime: 'edge' })
    expect(res.headers.get('content-type')).toContain('application/json')
  })
})
