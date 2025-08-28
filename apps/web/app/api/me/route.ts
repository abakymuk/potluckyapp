export const runtime = 'edge'

import { getUserOrThrow } from '../../../lib/auth'
import { createSupabaseForRequest } from '../../../lib/supabase'

export async function GET(req: Request) {
  const { user, fail } = await getUserOrThrow(req)
  if (!user) return fail!

  // RLS вернёт только собственные строки
  const supabase = createSupabaseForRequest(req)
  const [{ data: profile, error: pErr }, { data: memberships, error: mErr }] = await Promise.all([
    supabase.from('profiles').select('id, auth_user_id, full_name').maybeSingle(),
    supabase.from('memberships').select('org_id, role'),
  ])

  if (pErr || mErr) {
    return new Response(JSON.stringify({ error: pErr?.message || mErr?.message }), { status: 500 })
  }

  return new Response(
    JSON.stringify({
      user: { id: user.id, email: user.email },
      profile,
      memberships: memberships ?? [],
    }),
    { headers: { 'content-type': 'application/json' } }
  )
}
