import 'dotenv/config'
import { Client } from 'pg'

const url = process.env.SUPABASE_DB_URL
if (!url) throw new Error('SUPABASE_DB_URL is required')

const client = new Client({ connectionString: url })

async function main() {
  await client.connect()

  // идемпотентные вставки
  const org = await client.query(
    `insert into organizations (name) values ($1)
     on conflict do nothing returning id`, ['Acme']
  )
  const orgId = org.rows[0]?.id ?? (await client.query(
    `select id from organizations where name=$1 limit 1`, ['Acme']
  )).rows[0].id

  // Тестовый профиль (не путать с реальным Supabase auth)
  const resProfile = await client.query(
    `insert into profiles (auth_user_id, full_name)
     values ($1, $2) on conflict (auth_user_id) do nothing returning id`,
    ['00000000-0000-0000-0000-000000000001', 'Test User']
  )
  const profileId = resProfile.rows[0]?.id ?? (await client.query(
    `select id from profiles where auth_user_id=$1 limit 1`,
    ['00000000-0000-0000-0000-000000000001']
  )).rows[0].id

  await client.query(
    `insert into memberships (org_id, profile_id, role)
     values ($1, $2, $3)
     on conflict (org_id, profile_id) do nothing`,
    [orgId, profileId, 'owner']
  )

  console.log('Seed complete:', { orgId, profileId })
  await client.end()
}

main().catch(async (e) => {
  console.error(e)
  await client.end().catch(() => {})
  process.exit(1)
})
