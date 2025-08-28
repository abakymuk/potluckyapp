# Potlucky Monorepo (Edge/Serverless-first)

## Structure

- apps/ (пусто на этапе T0.0)
- packages/
  - ui/ – базовые UI-хелперы
  - config/ – фичефлаги и env-хелперы
  - contracts/ – схемы и контракты API (позже: zod + openapi)
  - types/ – общие типы
- infra/ – скрипты и CI/infra
- .github/ – GitHub Actions и шаблоны

## Commands

- `pnpm -w build|dev|lint|typecheck|test`
- `pnpm validate:packages`
- `pnpm format` – форматирование кода

## Development Workflow

### Начало работы

1. Клонируйте репозиторий
2. Установите зависимости: `pnpm install`
3. Переключитесь на ветку develop: `git checkout develop`

### Создание новой функции

1. Создайте новую ветку: `git checkout -b feature/your-feature-name`
2. Внесите изменения
3. Запустите проверки: `pnpm -w lint && pnpm -w typecheck && pnpm -w test`
4. Создайте Pull Request в ветку develop

### Релиз

1. Создайте Pull Request из develop в main
2. После ревью и прохождения CI, мержите в main
3. Создайте тег релиза

## Environment

### Required public env (build will fail if missing)

```
NEXT_PUBLIC_SUPABASE_URL=https://wnqzzplxfoutblsksvud.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducXp6cGx4Zm91dGJsc2tzdnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTI2OTUsImV4cCI6MjA3MTkyODY5NX0.xKBvnarYHs3qAV1ug5HVNBdfiERMOGv23gCZWYfvFtk
```

### Database env (for migrations and seeding)

```
SUPABASE_DB_URL=postgres://postgres:Gariba1ddi@db.wnqzzplxfoutblsksvud.supabase.co:6543/postgres?sslmode=require
```

### Feature flags (optional, default=false)

```
ONLINE_ORDERING_V1=false
ORDER_QUEUE_V1=false
AI_ADVISOR_V1=false
```

## Database

### Commands

- `pnpm drizzle:generate` - генерировать миграции
- `pnpm drizzle:push` - применить миграции к БД
- `pnpm db:seed` - заполнить БД тестовыми данными

### Schema

- `organizations` - организации
- `profiles` - профили пользователей
- `memberships` - членство в организациях

### RLS & Auth

- RLS включён на organizations/profiles/memberships.
- Функция `auth_profile_id()` (SECURITY DEFINER) — безопасно вычисляет профиль по JWT.
- Триггер `on_auth_user_created` создаёт профиль при регистрации.
- В рантайме используются только anon-ключи; все доступы контролируются RLS.
- Для сидов/тестов необходим `SUPABASE_SERVICE_ROLE`.

### Commands

- `pnpm drizzle:generate` - генерировать миграции
- `pnpm drizzle:push` - применить миграции к БД
- `pnpm db:seed` - заполнить БД тестовыми данными
- `pnpm db:rls` - применить RLS политики
- `pnpm test:rls` - запустить e2e-тесты RLS

## Rules

- Contracts-first, mocks-first, feature flags.
- Один пакет = один артефакт (cjs+esm+d.ts).
- Все изменения через Pull Requests.
- Обязательные проверки: lint, typecheck, test, build.
- Автоматический деплой на Vercel.
- Ежедневные проверки безопасности.
