import 'dotenv/config'
import { describe, it, expect, beforeAll } from 'vitest'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

let supabaseAnon: SupabaseClient
let alice: SupabaseClient
let bob: SupabaseClient

async function signIn(email: string, password: string) {
  const c = createClient(URL, ANON, { auth: { persistSession: false } })
  const { data, error } = await c.auth.signInWithPassword({ email, password })
  if (error) throw error
  return createClient(URL, ANON, {
    global: { headers: { Authorization: `Bearer ${data.session!.access_token}` } },
    auth: { persistSession: false }
  })
}

describe('RLS policies', () => {
  beforeAll(async () => {
    supabaseAnon = createClient(URL, ANON, { auth: { persistSession: false } })
    alice = await signIn('alice@example.com', 'Passw0rd!')
    bob   = await signIn('bob@example.com',   'Passw0rd!')
  })

  it('anon cannot read profiles', async () => {
    const { data, error } = await supabaseAnon.from('profiles').select('*')
    // В Supabase для anon обычно ошибка по RLS: data=null, error=null + count=0 или error 401.
    expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
  })

  it('alice sees only her profile', async () => {
    const { data, error } = await alice.from('profiles').select('id, auth_user_id')
    expect(error).toBeNull()
    expect(Array.isArray(data)).toBe(true)
    expect(data!.length).toBe(1)
  })

  it('alice sees Acme org, bob does not', async () => {
    const a = await alice.from('organizations').select('id, name')
    expect(a.error).toBeNull()
    expect(a.data!.some(o => o.name === 'Acme')).toBe(true)

    const b = await bob.from('organizations').select('id, name')
    expect(b.error).toBeNull()
    expect(b.data!.some(o => o.name === 'Acme')).toBe(false)
  })

  it('memberships are visible only to the profile owner', async () => {
    const am = await alice.from('memberships').select('org_id, profile_id, role')
    const bm = await bob.from('memberships').select('org_id, profile_id, role')
    expect(am.error).toBeNull()
    expect(bm.error).toBeNull()
    expect((am.data ?? []).length).toBeGreaterThanOrEqual(1)
    expect((bm.data ?? []).length).toBe(0)
  })
})
