# CI/CD Setup Instructions

## Required GitHub Secrets

Navigate to your repository: **Settings → Secrets and variables → Actions**

### 1. Database Secrets

**Preview Database:**
```
SUPABASE_DB_URL_PREVIEW
```
Value: `postgresql://postgres:password@db.preview-project.supabase.co:5432/postgres`

**Production Database:**
```
SUPABASE_DB_URL_PROD
```
Value: `postgresql://postgres:password@db.production-project.supabase.co:5432/postgres`

### 2. Vercel Secrets

**Vercel Token:**
```
VERCEL_TOKEN
```
Get from: https://vercel.com/account/tokens

**Vercel Organization ID:**
```
VERCEL_ORG_ID
```
Get from: `npx vercel whoami` or Vercel dashboard

**Vercel Project ID:**
```
VERCEL_PROJECT_ID
```
Get from: `npx vercel project ls` or Vercel dashboard

### 3. Public Variables (if needed for build)

**Supabase URL:**
```
NEXT_PUBLIC_SUPABASE_URL
```
Value: `https://your-project.supabase.co`

**Supabase Anon Key:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Optional Sentry Secrets

**Sentry DSN:**
```
SENTRY_DSN
```

**Sentry Auth Token:**
```
SENTRY_AUTH_TOKEN
```

**Sentry Organization:**
```
SENTRY_ORG
```

**Sentry Project:**
```
SENTRY_PROJECT
```

## Workflow Behavior

### PR Preview Pipeline
- **Trigger:** Any PR (opened, updated, reopened)
- **Actions:**
  1. Run lint, typecheck, tests
  2. Build web app
  3. Apply migrations to preview database
  4. Deploy to Vercel preview
  5. Comment PR with preview URL
- **Concurrency:** Cancels previous runs on same PR

### Production Pipeline
- **Trigger:** Push to `main` branch
- **Actions:**
  1. Run lint, typecheck, tests
  2. Build web app with sourcemaps
  3. Apply migrations to production database
  4. Deploy to Vercel production
- **Environment:** Uses GitHub Environment for approvals (optional)

## Manual Commands

### Deploy
```bash
# Production
npx vercel deploy --prod

# Preview
npx vercel deploy
```

### Rollback
```bash
# Vercel rollback
npx vercel rollback <deployment-id>

# Database rollback (manual)
# Keep SQL "down" migrations separately
```

## Migration Rules

1. **One feature = one migration**
2. **Migrations are additive only** (safe)
3. **Reversible migrations** in separate PRs
4. **Preview DB** for PR testing
5. **Production DB** for main branch only
6. **Never push PR migrations to production**

## Troubleshooting

### Common Issues

1. **Vercel token expired:** Regenerate at https://vercel.com/account/tokens
2. **Database connection failed:** Check Supabase project status and credentials
3. **Build fails:** Check environment variables in Vercel dashboard
4. **Migration fails:** Ensure database is accessible and credentials are correct

### Debug Commands

```bash
# Check Vercel status
npx vercel whoami

# List projects
npx vercel project ls

# Test database connection
npx vercel env pull
```

## Security Notes

- ✅ All secrets stored in GitHub Actions Secrets
- ✅ No keys in repository
- ✅ Separate database environments
- ✅ Environment-specific variables
- ✅ Concurrency protection
- ✅ Required approvals (optional)
