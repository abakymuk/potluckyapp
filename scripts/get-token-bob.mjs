import { createClient } from '@supabase/supabase-js'

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})

try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'bob@example.com',
    password: 'Passw0rd!',
  })

  if (error) {
    console.error('Auth error:', error.message)
    process.exit(1)
  }

  console.log(data.session.access_token)
} catch (err) {
  console.error('Error:', err.message)
  process.exit(1)
}
