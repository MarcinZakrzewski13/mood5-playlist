# AI Plan – Mood5 Playlist MVP

## A. Auth + ochrona stron
- **Cel:** Supabase Auth (email+password), login page, callback, middleware
- **Pliki:**
  - `npm install @supabase/supabase-js`
  - `src/lib/supabase.ts` – client (server + browser)
  - `src/pages/auth/login.astro` – formularz login/register
  - `src/pages/auth/callback.astro` – obsługa auth callback
  - `src/middleware.ts` – redirect niezalogowanych z /generate, /history
  - `src/pages/api/auth/login.ts` – server-side login
  - `src/pages/api/auth/register.ts` – server-side register
  - `src/pages/api/auth/logout.ts` – server-side logout
  - `src/pages/index.astro` – redirect do /generate
  - `.env.example`
- **Kryterium:** niezalogowany → redirect na /auth/login; zalogowany → dostęp do /generate
- **Status:** ✅ Cookie-based auth z HttpOnly tokenami. Middleware chroni /generate, /history i /api/generate, /api/history. Build OK.

## B. DB schema + RLS
- **Cel:** Tabele requests + tracks w Supabase z RLS
- **Pliki:**
  - `supabase/migrations/001_create_tables.sql`
- **Kryterium:** SQL gotowy do uruchomienia w Supabase SQL Editor
- **Status:** ✅ Tabele z FK CASCADE, indexy, pełne RLS policies. Gotowe do uruchomienia.

## C. Endpoint generate (AI + walidacja + zapis)
- **Cel:** POST /api/generate → OpenRouter → walidacja → DB → response
- **Pliki:**
  - `src/pages/api/generate.ts`
  - `src/lib/openrouter.ts` – wywołanie AI (gpt-4o-mini via OpenRouter)
  - `src/lib/validate-playlist.ts` – walidacja JSON schema
- **Kryterium:** POST → 200 + 5 tracków w DB
- **Status:** ✅ Pełna walidacja (5 tracks, energy 1-5, tempo enum, vocal_style). Error handling dla AI/DB. Build OK.

## D. UI generate
- **Cel:** Strona /generate z textarea + button + wynik
- **Pliki:**
  - `src/pages/generate.astro`
  - `src/components/GenerateForm.tsx` – React component
  - `src/components/TrackList.tsx` – render 5 tracków
  - `src/components/NavBar.tsx` – nawigacja + logout
- **Kryterium:** przeglądarka → wpisz tekst → Generate → widzisz 5 tracków
- **Status:** ✅ Textarea + button + loading state + inference badges + track cards z linkami Spotify/YT. Build OK.

## E. History + delete
- **Cel:** Strona /history z listą requestów + delete
- **Pliki:**
  - `src/pages/api/history.ts` – GET (lista) + DELETE (request + cascade)
  - `src/pages/history.astro`
  - `src/components/HistoryList.tsx`
- **Kryterium:** przeglądarka → /history → widzisz requesty → delete działa
- **Status:** ✅ GET z joinami tracks, DELETE z cascade, UI z konfirmacją. Build OK.

## F. Test integracyjny
- **Cel:** Vitest testy walidacji
- **Pliki:**
  - `vitest.config.ts`
  - `tests/generate.test.ts`
  - `package.json` – dodany script `test`
- **Kryterium:** `npm test` → pass
- **Status:** ✅ 9 testów pass (walidacja 5 tracków, energy range, tempo enum, training scenario, nullable URLs, negative cases).

## G. GitHub Actions CI
- **Cel:** Pipeline build + test na push/PR
- **Pliki:**
  - `.github/workflows/ci.yml`
- **Kryterium:** push → CI zielone
- **Status:** ✅ checkout → node 22 → npm ci → lint → test → build. Placeholder env vars.
