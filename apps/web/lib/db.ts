import { createClient } from '@supabase/supabase-js'

// Edge-совместимый Supabase client (только anon, RLS будет в T0.4)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
)

// TODO: Добавить drizzle интеграцию после настройки правильного адаптера
export const db = supabase
// Пример: export { organizations } from '../../../infra/db/schema' — не делаем (schema — для миграций/типов)
// На runtime будем работать через RPC/табличные запросы Drizzle Supabase adapter

export const feature = { 
  ONLINE_ORDERING_V1: process.env.ONLINE_ORDERING_V1 === 'true' 
}
