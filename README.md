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
- `pnpm contracts:build` – сборка контрактов и генерация OpenAPI

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

## CI/CD

### PR Preview Pipeline
- **Workflow:** `.github/workflows/ci-preview.yml`
- **Triggers:** Pull Request (opened, synchronize, reopened)
- **Actions:** checks → migrate (preview-DB) → Vercel preview → PR comment with URL
- **Concurrency:** отменяет предыдущие раннеры на том же PR

### Production Pipeline
- **Workflow:** `.github/workflows/release-prod.yml`
- **Triggers:** push в `main`
- **Actions:** checks → migrate (prod-DB) → Vercel production deploy
- **Environment:** production с required reviewers (опционально)

### Required Secrets (GitHub → Settings → Secrets and variables → Actions)

**Preview DB:**
```
SUPABASE_DB_URL_PREVIEW
```

**Production DB:**
```
SUPABASE_DB_URL_PROD
```

**Vercel:**
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

**Public Variables (если нужно для build):**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Миграции и окружения

- **Миграции:** всегда аддитивные (safe), обратимые — в отдельных PR
- **Окружения:** отдельные строки подключения для preview/prod
- **Запрещено:** пулять PR-миграции в prod
- **Concurrency:** отменяем старые раннеры на PR и main
- **Sourcemaps:** грузим в checks:build (Sentry токен в секрете)

### Ручное управление

**Деплой:**
```bash
# Production
npx vercel deploy --prod

# Preview
npx vercel deploy
```

**Откат:**
```bash
# Vercel
npx vercel rollback <deployment>

# Миграции (пока не автоматизируем)
# Держи SQL «down» отдельно
```

### Правила ветвления

1. **Feature ветки:** `feature/ticket-description`
2. **PR в develop:** для новых функций
3. **PR develop → main:** для релизов
4. **Одна фича = одна миграция**
5. **Миграции:** только аддитивные в PR, обратимые отдельно

## Contracts & Mocks

### Building Contracts
```bash
# Build contracts and generate OpenAPI documentation
pnpm contracts:build
```

This generates:
- `packages/contracts/dist/openapi.json` - OpenAPI v3.1 specification
- TypeScript types for Menu, Cart, and Price schemas
- Zod validation schemas

### Feature Flags
The following feature flags control API availability:
- `ONLINE_ORDERING_V1` - Controls menu, price, and cart validation APIs

When disabled, APIs return 404. When enabled, they return 501 (not implemented).

### MSW Development
MSW (Mock Service Worker) is configured for development:
- Mock handlers for `/api/menu`, `/api/price`, `/api/cart/validate`
- Validates requests/responses against Zod schemas
- Provides realistic mock data for development

To use MSW in development:
```bash
# Start development server with MSW
pnpm dev
```

The mock endpoints will be available at:
- `GET /api/menu` - Returns mock menu data
- `POST /api/price` - Calculates mock pricing
- `POST /api/cart/validate` - Validates cart structure

## Rules

- Contracts-first, mocks-first, feature flags.
- Один пакет = один артефакт (cjs+esm+d.ts).
- Все изменения через Pull Requests.
- Обязательные проверки: lint, typecheck, test, build.
- Автоматический деплой на Vercel.
- Ежедневные проверки безопасности.
