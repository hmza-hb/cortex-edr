# Contributing to CortexEDR

Thank you for your interest in contributing. This document covers the workflow for code changes, quality gates, and security expectations.

## Getting Started

1. Fork the repository and clone locally
2. Install dependencies: `npm install`
3. Copy environment template: `cp .env.example .env.local`
4. Apply Supabase migrations (`supabase/migrations/001` through `009`)
5. Start dev server: `npm run dev`

## Development Workflow

1. Create a feature branch from `main`
2. Make focused changes with clear commit messages
3. Run quality checks locally before opening a PR:

```bash
npm run lint
npm run typecheck
npm run build
```

Or run all at once:

```bash
npm run ci
```

4. Open a pull request against `main` using the PR template

## Code Standards

- **TypeScript strict mode** — no `any` unless justified
- **Match existing patterns** — naming, file structure, import style
- **Minimal scope** — one concern per PR
- **No secrets in code** — use environment variables
- **Security-first** — validate inputs, sanitize outputs, respect RLS boundaries

## Project Structure Guide

| Path | Purpose |
|------|---------|
| `lib/agents/` | Scan pipeline, prompts, AI routing |
| `lib/chat/` | Chat orchestration engine |
| `lib/security/` | Rate limiting, validation, audit logging |
| `app/api/` | REST endpoints |
| `supabase/migrations/` | Versioned database schema |

See [ARCHITECTURE.md](ARCHITECTURE.md) for system design details.

## CI/CD

Every PR triggers:

| Workflow | Checks |
|----------|--------|
| **CI** | ESLint, TypeScript, production build |
| **Security** | npm audit (critical), Gitleaks, CodeQL |

Merges to `main` trigger the **Deploy** workflow (requires configured secrets).

## Security Reports

Do **not** open public GitHub issues for vulnerabilities. Follow [SECURITY.md](SECURITY.md).

## Questions

- Product docs: [cortex-edr.com/docs](https://www.cortex-edr.com/docs)
- Issues: use the bug report or feature request templates
