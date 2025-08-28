/* eslint-env node */
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './infra/db/schema.ts',
  out: './infra/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL || 'postgresql://postgres:password@localhost:5432/postgres',
  },
  verbose: true,
  strict: true,
})
