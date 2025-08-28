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

## Rules

- Contracts-first, mocks-first, feature flags.
- Один пакет = один артефакт (cjs+esm+d.ts).
- Все изменения через Pull Requests.
- Обязательные проверки: lint, typecheck, test, build.
