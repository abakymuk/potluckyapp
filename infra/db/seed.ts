import 'dotenv/config'
import { Client } from 'pg'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_DB_URL
if (!url) throw new Error('SUPABASE_DB_URL is required')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!
if (!SUPABASE_URL || !SERVICE_ROLE) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE are required to seed users')
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } })
const client = new Client({ connectionString: url })

async function ensureUser(email: string, password: string, fullName: string) {
  const { data: existing } = await admin.auth.admin.listUsers()
  const found = existing.users?.find(u => u.email === email)
  if (!found) {
    const { data, error } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name: fullName }
    })
    if (error) throw error
    return data.user!.id
  }
  return found.id
}

async function main() {
  await client.connect()

  // пользователи
  const aliceId = await ensureUser('alice@example.com', 'Passw0rd!', 'Alice')
  const bobId   = await ensureUser('bob@example.com',   'Passw0rd!', 'Bob')

  // организация
  const orgRes = await client.query(
    `insert into organizations (name)
     values ('Acme') on conflict do nothing returning id`
  )
  const orgId = orgRes.rows[0]?.id ?? (await client.query(
    `select id from organizations where name='Acme' limit 1`
  )).rows[0].id

  // дождёмся автопрофилей из триггера и получим их id
  const qProfile = async (auth_user_id: string) =>
    (await client.query(`select id from profiles where auth_user_id=$1 limit 1`, [auth_user_id])).rows[0]?.id

  // простая ретрия
  const waitProfile = async (uid: string) => {
    for (let i=0;i<10;i++){
      const pid = await qProfile(uid)
      if (pid) return pid
      await new Promise(r => setTimeout(r, 300))
    }
    throw new Error('profile not created by trigger')
  }
  const aliceProfileId = await waitProfile(aliceId)
  const bobProfileId   = await waitProfile(bobId)

  // membership: Alice -> Acme (owner)
  await client.query(
    `insert into memberships (org_id, profile_id, role)
     values ($1, $2, 'owner')
     on conflict (org_id, profile_id) do nothing`,
    [orgId, aliceProfileId]
  )

  console.log('Seed complete:', { orgId, aliceProfileId, bobProfileId })
  await client.end()
}

main().catch(async (e) => {
  console.error(e)
  await client.end().catch(() => {})
  process.exit(1)
})
