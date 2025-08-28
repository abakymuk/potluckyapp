import { createSupabaseForRequest } from './supabase'

export async function getUserOrThrow(req: Request) {
  const supabase = createSupabaseForRequest(req)
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    const body = JSON.stringify({ error: 'unauthorized' })
    return { user: null, fail: new Response(body, { status: 401, headers: { 'content-type': 'application/json' } }) }
  }
  return { user: data.user, fail: null, supabase }
}
