# AI Plan – Mood5 Playlist MVP

## A. Auth + ochrona stron
- **Cel:** Supabase Auth (email+password), login page, callback, middleware
- **Pliki:**
  - `npm install @supabase/supabase-js`
  - `src/lib/supabase.ts` – client (server + browser)
  - `src/pages/auth/login.astro` – formularz login/register
  - `src/pages/auth/callback.astro` – obsługa auth callback
  - `src/middleware.ts` – redirect niezalogowanych z /generate, /history
  - `src/pages/index.astro` – redirect do /generate lub /auth/login
  - `.env.example`
- **Kryterium:** niezalogowany → redirect na /auth/login; zalogowany → dostęp do /generate
- **Status:** ⬜

## B. DB schema + RLS
- **Cel:** Tabele requests + tracks w Supabase z RLS
- **Pliki:**
  - `supabase/migrations/001_create_tables.sql`
- **Kryterium:** SQL gotowy do uruchomienia w Supabase SQL Editor
- **Status:** ⬜

## C. Endpoint generate (AI + walidacja + zapis)
- **Cel:** POST /api/generate → OpenRouter → walidacja → DB → response
- **Pliki:**
  - `src/pages/api/generate.ts`
  - `src/lib/openrouter.ts` – wywołanie AI
  - `src/lib/validate-playlist.ts` – walidacja JSON schema
- **Kryterium:** curl POST → 200 + 5 tracków w DB
- **Status:** ⬜

## D. UI generate
- **Cel:** Strona /generate z textarea + button + wynik
- **Pliki:**
  - `src/pages/generate.astro`
  - `src/components/GenerateForm.tsx` – React component
  - `src/components/TrackList.tsx` – render 5 tracków
- **Kryterium:** przeglądarka → wpisz tekst → Generate → widzisz 5 tracków
- **Status:** ⬜

## E. History + delete
- **Cel:** Strona /history z listą requestów + delete
- **Pliki:**
  - `src/pages/api/history.ts` – GET (lista) + DELETE (request + cascade)
  - `src/pages/history.astro`
  - `src/components/HistoryList.tsx`
- **Kryterium:** przeglądarka → /history → widzisz requesty → delete działa
- **Status:** ⬜

## F. Test integracyjny
- **Cel:** 1 Vitest test z mockiem AI
- **Pliki:**
  - `npm install -D vitest`
  - `vitest.config.ts`
  - `tests/generate.test.ts`
- **Kryterium:** `npm test` → pass
- **Status:** ⬜

## G. GitHub Actions CI
- **Cel:** Pipeline build + test na push/PR
- **Pliki:**
  - `.github/workflows/ci.yml`
  - aktualizacja `package.json` scripts (test)
- **Kryterium:** push → CI zielone
- **Status:** ⬜
