

T-CI — Simple & Solid CI/CD (PR Preview + Prod Deploy)

You are Codebase Guardian for a Next.js 15 + shadcn/ui (FE) monorepo on Vercel (edge).
Strict rules: contracts-first, mocks-first, feature flags, disciplined migrations, tests & telemetry.

Goal

Внедрить понятный CI/CD: на каждый PR — превью (с миграциями в preview-DB), на main — production-деплой (с миграциями в prod-DB), с комментариями в PR и минимальной телеметрией.

Scope

In: два Github Actions workflow’а (PR Preview, Prod), применение Drizzle-миграций к нужной БД, Vercel deploy, Sentry sourcemaps, concurrency, базовая документация.
Out: сложные канареечные релизы, blue/green, e2e-браузерные тесты, сложные approvals (добавим позже при необходимости).

AC (Gherkin)
	•	Given открыт PR, When workflow завершается, Then в PR есть комментарий вида “Vercel Preview: ”, а миграции применены к preview-DB.
	•	Given PR смёржен в main, When запускается релизный workflow, Then Drizzle-миграции применены к prod-DB и выполнен Vercel production deploy без ошибок.
	•	Given миграции падают на любом этапе, Then деплой не выполняется и статус красный.
	•	Given включены Sentry переменные, Then sourcemaps загружены и ошибки символизируются.
	•	Given новый пуш в тот же PR, Then предыдущий ран отменён (concurrency).


N/A

Contracts: zod#/OpenAPI# (or propose minimal)

N/A (инфраструктурная задача; контракты не меняем)

DoD
	•	UI w/ MSW mocks — N/A для этой задачи
	•	API route @edge + tests — N/A
	•	Integration — workflows применяют миграции и деплоят
	•	e2e happy path — ручная проверка превью/прода по URL
	•	Telemetry (Sentry) — загрузка sourcemaps включена
	•	Docs updated — README: как работают workflow’ы, список secrets/vars

WORKFLOW
	1.	If AC/Contracts missing → (не требуется).
	2.	FE Route Handlers @edge → behind feature flags (уже в кодовой базе).
	3.	Drizzle migrations: одна фича = одна миграция, PR → preview-DB, main → prod-DB.
	4.	Tests: unit + minimal e2e (как в существующих задачах) запускаются в CI.
	5.	Update PR body with links. Run lint/typecheck/test/build locally.

⸻

Steps

1) Secrets & Vars (GitHub → Settings → Secrets and variables → Actions)

Preview DB
	•	SUPABASE_DB_URL_PREVIEW

Production DB
	•	SUPABASE_DB_URL

Vercel
	•	VERCEL_TOKEN
	•	VERCEL_ORG_ID
	•	VERCEL_PROJECT_ID

Public Vars (если нужно для build)
	•	NEXT_PUBLIC_SUPABASE_URL (preview/prod можно подтягивать через vercel pull)

⸻

2) PR Preview Workflow — .github/workflows/ci-preview.yml
	•	Линт/тайпчек/тест/билд
	•	Drizzle generate/push → preview-DB
	•	Vercel preview deploy
	•	Комментарий в PR с URL

name: ci-preview
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: pr-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm i --frozen-lockfile
      - run: pnpm -w lint
      - run: pnpm -w typecheck
      - run: pnpm -w test
      - name: Build (web)
        run: pnpm --filter @potlucky/web build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ vars.NEXT_PUBLIC_SUPABASE_URL || '' }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }}
          NEXT_PUBLIC_SENTRY_DSN: ${{ secrets.SENTRY_DSN || '' }}
          SENTRY_DSN: ${{ secrets.SENTRY_DSN || '' }}
          VERCEL_ENV: preview

  migrate:
    needs: checks
    runs-on: ubuntu-latest
    env:
      SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL_PREVIEW }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm i --frozen-lockfile
      - run: pnpm drizzle:generate
      - run: pnpm drizzle:push

  deploy:
    needs: [checks, migrate]
    runs-on: ubuntu-latest
    env:
      VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4
      - run: pnpm i --frozen-lockfile
      - name: Pull Vercel env (preview)
        run: npx vercel pull --yes --environment=preview --token $VERCEL_TOKEN
      - name: Build with Vercel
        run: npx vercel build --token $VERCEL_TOKEN
      - name: Deploy preview
        id: deploy
        run: echo "url=$(npx vercel deploy --prebuilt --token $VERCEL_TOKEN)" >> $GITHUB_OUTPUT
      - name: Comment PR with URL
        uses: actions/github-script@v7
        with:
          script: |
            const url = '${{ steps.deploy.outputs.url }}'
            const body = `🚀 **Vercel Preview:** ${url}`
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body
            })
      - name: Job summary
        run: echo "Vercel Preview → ${{ steps.deploy.outputs.url }}" >> $GITHUB_STEP_SUMMARY


⸻

3) Production Workflow — .github/workflows/release-prod.yml
	•	Триггер: push в main (или релизный тег)
	•	Линт/тайпчек/тест/билд
	•	Drizzle generate/push → prod-DB
	•	Vercel production deploy
	•	(Опция) GitHub Environments с required reviewers для шага deploy

name: release-prod
on:
  push:
    branches: [ main ]
  # альтернативно:
  # tags:
  #   - 'v*.*.*'

permissions:
  contents: read

concurrency:
  group: release-main
  cancel-in-progress: true

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm i --frozen-lockfile
      - run: pnpm -w lint
      - run: pnpm -w typecheck
      - run: pnpm -w test
      - name: Build (web) + sourcemaps
        env:
          VERCEL_ENV: production
          NEXT_PUBLIC_SUPABASE_URL: ${{ vars.NEXT_PUBLIC_SUPABASE_URL || '' }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }}
        run: pnpm --filter @potlucky/web build

  migrate:
    needs: checks
    runs-on: ubuntu-latest
    env:
      SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL_PROD }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm i --frozen-lockfile
      - run: pnpm drizzle:generate
      - run: pnpm drizzle:push

  deploy:
    needs: [checks, migrate]
    runs-on: ubuntu-latest
    environment:
      name: production
      url: ${{ steps.deploy.outputs.url }}
    env:
      VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4
      - run: pnpm i --frozen-lockfile
      - name: Pull Vercel env (prod)
        run: npx vercel pull --yes --environment=production --token $VERCEL_TOKEN
      - name: Build with Vercel
        run: npx vercel build --prod --token $VERCEL_TOKEN
      - name: Deploy production
        id: deploy
        run: echo "url=$(npx vercel deploy --prebuilt --prod --token $VERCEL_TOKEN)" >> $GITHUB_OUTPUT
      - name: Summary
        run: echo "Vercel Production → ${{ steps.deploy.outputs.url }}" >> $GITHUB_STEP_SUMMARY


⸻

4) Мини-правила «без сложностей, но правильно»
	•	Миграции: всегда «аддитивные» (safe), обратимые — в отдельных PR. Одна фича = одна миграция.
	•	Окружения: отдельные строки подключения для preview/prod. Запрещено пулять PR-миграции в prod.
	•	Concurrency: отменяем старые раннеры на PR и main.
	•	Sourcemaps: грузим в checks:build (Sentry токен в секрете).
	•	Доступы: secrets только через GitHub Actions Secrets. Никаких ключей в репо.
	•	Мониторинг релизов: Sentry релиз метится автоматически withSentryConfig (или добавь SENTRY_RELEASE).
	•	Rollback: Vercel — vercel rollback <deployment>; миграции — держи SQL «down» отдельно (пока не автоматизируем).

⸻

5) Docs (README)

Добавь раздел CI/CD:
	•	Как работает PR Preview и Production.
	•	Какие secrets нужны (список из шага 1).
	•	Как вручную задеплоить/откатить (vercel deploy --prod, vercel rollback).
	•	Правила миграций и ветвления.

⸻

Рекомендованный коммит

ci(cicd): add simple CI/CD — PR preview (migrations+deploy) and main production deploy with sourcemaps
