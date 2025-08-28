import { createClient } from '@supabase/supabase-js'
import { isEnabled, envPublic } from '@potlucky/config'

// Edge-совместимый Supabase client (только anon, RLS будет в T0.4)
const supabase = createClient(
  envPublic.NEXT_PUBLIC_SUPABASE_URL,
  envPublic.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
)

// TODO: Добавить drizzle интеграцию после настройки правильного адаптера
export const db = supabase
// Пример: export { organizations } from '../../../infra/db/schema' — не делаем (schema — для миграций/типов)
// На runtime будем работать через RPC/табличные запросы Drizzle Supabase adapter

export const feature = { ONLINE_ORDERING_V1: isEnabled('ONLINE_ORDERING_V1') }
