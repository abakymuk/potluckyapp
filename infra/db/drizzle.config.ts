import 'dotenv/config'
import type { Config } from 'drizzle-kit'

if (!process.env.SUPABASE_DB_URL) {
  throw new Error('SUPABASE_DB_URL is required for migrations')
}

export default {
  schema: './infra/db/schema.ts',
  out: './infra/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
  },
  strict: true,
  verbose: true,
} satisfies Config
