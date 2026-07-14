# CortexEDR — System Architecture

Technical architecture reference for engineers reviewing or extending the platform.

## System Context

CortexEDR is a Next.js monolith that orchestrates multi-agent AI analysis of GitHub repositories. Users authenticate via NextAuth, submit repository URLs, and receive structured security reports with a post-scan conversational advisor.

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser   │────▶│  Next.js 15 App  │────▶│ Supabase (PG)   │
│  Dashboard  │◀────│  API + RSC       │◀────│ RLS + Realtime  │
└─────────────┘     └────────┬─────────┘     └─────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              ┌─────▼─────┐    ┌──────▼──────┐
              │ GitHub API │    │ AI Providers │
              └───────────┘    └─────────────┘
```

## Core Subsystems

### 1. Scan Pipeline (`lib/agents/pipeline.ts`)

Sequential 8-stage pipeline (Agent 0–7):

| Stage | Responsibility | Persistence |
|-------|----------------|-------------|
| 0 — Git Connect | GitHub API tree fetch, tier file limits | `agent_events` |
| 1 — Reconnaissance | Tech stack, architecture blueprint | `recon_data` (JSONB) |
| 2 — Security | Per-file vulnerability analysis | `issues` |
| 3 — Architecture | Design pattern review | `issues` |
| 4 — Code Quality | Complexity, duplication, error handling | `issues` |
| 5 — Technical Debt | TODOs, deprecated deps | `issues` |
| 6 — AI-Specific | LLM-generated code patterns | `issues` |
| 7 — Orchestrator | Executive synthesis, score (0–100) | `executive_report`, `scans.status` |

**Ingestion model:** GitHub REST API with selective per-step file download (no `git` binary). A `.cortex-tree` manifest preserves full virtual file list while only downloading pattern-matched files (up to 100 per step).

**Execution model:** Fire-and-forget from `POST /api/scan/start`. Pipeline runs in the API process background. Events stream to `agent_events` for live UI updates.

### 2. AI Router (`lib/agents/ai-router.ts`, `lib/agents/pipeline.ts`)

- Tier-mapped primary model selection
- Fallback chain: OpenAI → OpenRouter → Gemini → Groq → DeepSeek
- Retry with exponential backoff on 429, timeout, network errors
- Per-call logging via `AILogger` → `usage_logs` table

### 3. Chat Orchestration (`lib/chat/`)

Five-stage pipeline, zero LLM calls until prompt assembly:

```
Message → Intent Classifier (regex)
        → Context Retriever (intent-scoped Supabase queries)
        → Context Compressor (token budgets: 50–3000)
        → Memory Manager (10-msg sliding window + summary)
        → Prompt Builder → AI Router → Tool Loop → Sanitizer
```

**Tool loop:** `search_issues`, `get_file_content`, `get_architecture_summary`. Iteration budget varies by intent (2–7).

### 4. Data Layer (`supabase/migrations/`)

Nine versioned migrations. All user tables have Row-Level Security.

| Table | Purpose |
|-------|---------|
| `profiles` | Plan tier, scan quotas, Paddle subscription state |
| `scans` | Scan metadata, reports (JSONB), progress (`current_agent`) |
| `issues` | Findings with severity, CWE, file/line, fix prompts |
| `agent_events` | Real-time pipeline event stream |
| `chat_threads` / `chat_messages` | Conversational advisor |
| `usage_logs` | Per-call AI cost and token analytics |
| `payment_history` | Billing audit trail |

### 5. Authentication & Authorization

- **NextAuth.js** — JWT sessions (30-day), GitHub/Google OAuth, bcrypt credentials
- **Middleware** — protects `/dashboard/*`, `/chat/*`, `/api/scan/*`, `/api/chat/*`
- **Admin** — `requireAdmin` middleware for `/api/admin/*`
- **RLS** — Supabase policies scope all user data

### 6. Billing

- **Paddle** webhooks with signature verification (`paddle.webhooks.unmarshal`)
- Subscription events update `profiles.plan_tier` and `scans_remaining`
- **Inngest** cron for billing reminder emails (daily 09:00 UTC)

## API Surface

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /api/scan/start` | Session | Initiate scan |
| `GET /api/scan/status/[id]` | Session | Poll progress |
| `GET /api/scan/results/[id]` | Session | Fetch report |
| `GET /api/scans` | Session | Scan history |
| `POST /api/chat` | Session | Chat messages |
| `POST /api/webhooks/paddle` | Signature | Billing events |
| `POST /api/inngest` | Inngest | Background jobs |

## Real-Time Updates

`hooks/useSSEScan.ts` combines:
1. Initial Supabase query for scan state + historical events
2. 500ms polling fallback for new `agent_events`
3. Supabase Realtime subscription (enabled via migration 006)

## Security Architecture

| Control | Implementation |
|---------|----------------|
| Input validation | Zod schemas (`lib/security/inputValidation.ts`) |
| Rate limiting | In-memory sliding window (single-instance) |
| Audit logging | Structured JSON stdout with field redaction |
| Chat sanitization | Output filtering before persistence |
| Webhook verification | Paddle SDK signature validation |
| HTTP headers | HSTS, X-Frame-Options, CSP-adjacent headers in `next.config.mjs` |
| Secret scanning | Gitleaks in CI |
| Static analysis | CodeQL in CI |

## Known Architectural Trade-offs

| Decision | Rationale | Limitation |
|----------|-----------|------------|
| Monolith | Faster iteration, simpler deployment | Horizontal scaling requires sticky sessions for in-flight scans |
| Fire-and-forget pipeline | Immediate API response | No automatic retry on process crash |
| GitHub API ingestion | Serverless-compatible | Public repos only; rate-limited without token |
| In-memory rate limiting | Zero infrastructure dependency | Not distributed across instances |
| Regex intent classification | Zero LLM latency/cost for routing | May miss novel query phrasings |

## Deployment

| Environment | Trigger | Platform |
|-------------|---------|----------|
| CI | Push/PR to `main` | GitHub Actions |
| Security | Push/PR + weekly cron | GitHub Actions |
| Production | CI success on `main` | Railway (configurable) |

Required deployment secrets: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Supabase keys, AI provider keys, `RAILWAY_TOKEN`.

## Extension Points

- **New agent:** Add prompt in `lib/agents/prompts.ts`, stage function in `pipeline.ts`, update `runPipeline()` sequence
- **New chat intent:** Add patterns in `intent-classifier.ts`, context query in `context-retriever.ts`, budget in `context-compressor.ts`
- **New AI provider:** Add wrapper in `lib/ai/`, register in `ai-router.ts` fallback chain
- **New tier:** Extend `TierId` enum and `SYSTEM_CONFIG.tiers` in `lib/config/system.ts`
