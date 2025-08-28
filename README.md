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

### Feature flags (optional, default=false)

```
ONLINE_ORDERING_V1=false
ORDER_QUEUE_V1=false
AI_ADVISOR_V1=false
```

## Rules

- Contracts-first, mocks-first, feature flags.
- Один пакет = один артефакт (cjs+esm+d.ts).
- Все изменения через Pull Requests.
- Обязательные проверки: lint, typecheck, test, build.
