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

## Rules

- Contracts-first, mocks-first, feature flags.
- Один пакет = один артефакт (cjs+esm+d.ts).
- Все изменения через Pull Requests.
- Обязательные проверки: lint, typecheck, test, build.
