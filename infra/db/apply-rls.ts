import { readFileSync } from 'node:fs'
import { Client } from 'pg'

// В CI среде переменные окружения передаются напрямую
// В локальной разработке можно использовать dotenv
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv/config')
  } catch {
    // dotenv не установлен или .env файл отсутствует - это нормально для CI
  }
}

const url = process.env.SUPABASE_DB_URL
if (!url) throw new Error('SUPABASE_DB_URL is required')

async function main() {
  const sql = readFileSync('./infra/db/rls.sql', 'utf8')
  const client = new Client({ connectionString: url })
  await client.connect()
  await client.query(sql)
  await client.end()
  console.log('RLS applied')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
