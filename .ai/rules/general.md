# General Rules – Mood5 Playlist

## Scope
- Only MVP features as defined in `.ai/prd.md`.
- No scope creep. No features outside PRD.

## Code
- TypeScript strict mode.
- Astro SSR with an adapter matching the target hosting (Vercel/Node).
- React islands: prefer `client:visible` / `client:idle`; use `client:load` only when needed.
- Tailwind CSS v4 for styling.

## Auth
- Supabase Auth (email + password).
- Cookie-based sessions (HttpOnly, SameSite=Lax).
- Middleware protects `/generate`, `/history` and their API counterparts.

## Data
- All data scoped to `user_id`.
- RLS enabled on `requests` and `tracks` tables.
- Delete cascades from `requests` to `tracks`.

## AI Integration
- OpenRouter API with `openai/gpt-4o-mini` model.
- Strict JSON contract: `inference` + `tracks` (exactly 5).
- Validation: energy 1-5, tempo slow/medium/fast, vocal_style instrumental/mixed/vocal.

## Testing
- Vitest for unit/integration tests.
- Includes at least one test validating key user flow + playlist schema/business rules.

## CI/CD
- GitHub Actions: lint, test, build on push and PR.
- Node pinned (prefer 20 LTS for compatibility).

## Secrets
- `.env` never committed.
- `.env.example` with placeholders in repo.
- Server-only keys (e.g. service role) must never be exposed to the client bundle.
