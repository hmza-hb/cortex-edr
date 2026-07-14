# GitHub Actions Workflows

## Pipelines

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| **CI** | `ci.yml` | Push/PR to `main` | Lint, typecheck, production build |
| **Security** | `security.yml` | Push/PR + weekly Monday 06:00 UTC | npm audit, Gitleaks, CodeQL |
| **Deploy** | `deploy.yml` | CI success on `main` | Production deployment to Railway |

## CI Pipeline

```
lint ──────┐
           ├──▶ build ──▶ ci-gate
typecheck ─┘
```

- **Lint:** ESLint with Next.js config
- **Typecheck:** `tsc --noEmit` (strict mode)
- **Build:** `next build` with placeholder CI environment variables
- **Artifact:** `.next` build output retained for 7 days

## Deploy Pipeline

Triggered automatically when CI succeeds on a push to `main`.

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `NEXTAUTH_SECRET` | Production JWT signing secret (32+ chars) |
| `NEXTAUTH_URL` | Production app URL (e.g. `https://app.cortex-edr.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `RAILWAY_TOKEN` | Railway API token |
| `RAILWAY_PROJECT_ID` | Railway project identifier |
| `RAILWAY_SERVICE_ID` | Railway service identifier |

### GitHub Environment

Create a `production` environment in repository settings with required reviewers (optional) and the secrets above.

## Security Pipeline

- **Dependency Audit:** `npm audit --audit-level=critical`
- **Secret Scan:** Gitleaks on full git history
- **CodeQL:** JavaScript/TypeScript static analysis

## Dependabot

`.github/dependabot.yml` opens weekly PRs for npm and GitHub Actions dependency updates.

## Local Quality Gate

```bash
npm run ci
```

Equivalent to the CI pipeline checks run locally.
