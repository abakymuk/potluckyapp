// Проверяем наличие необходимых переменных окружения для тестов
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `Missing required environment variable: ${envVar}. ` +
      'Please ensure all required environment variables are set in CI or local development.'
    )
  }
}

// Устанавливаем глобальные переменные для тестов
global.process = process
