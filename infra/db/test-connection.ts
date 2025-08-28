/* eslint-env node */
import { Client } from 'pg'

async function testConnection() {
  const dbUrl = process.env.SUPABASE_DB_URL
  
  if (!dbUrl) {
    console.log('❌ SUPABASE_DB_URL is not set')
    process.exit(1)
  }

  console.log('🔍 Testing database connection...')
  
  const client = new Client({
    connectionString: dbUrl,
    connectionTimeoutMillis: 5000,
  })

  try {
    await client.connect()
    const result = await client.query('SELECT NOW() as current_time')
    console.log('✅ Database connection successful!')
    console.log('📅 Current time:', result.rows[0].current_time)
    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed:', error instanceof Error ? error.message : error)
    await client.end()
    process.exit(1)
  }
}

testConnection()
