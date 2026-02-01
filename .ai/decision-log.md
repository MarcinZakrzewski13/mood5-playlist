# Decision Log – Mood5 Playlist

Chronologiczny rejestr decyzji architektonicznych i technologicznych podjętych w trakcie budowy MVP.

---

## DEC-001: Wybór startera

**Kontekst:** Projekt realizowany jako certyfikacyjne MVP w ramach szkolenia 10xDevs.
**Decyzja:** Użycie [10x-astro-starter](https://github.com/przeprogramowani/10x-astro-starter) jako bazy (Astro 5 + React 19 + Tailwind v4 + TypeScript).
**Uzasadnienie:** Starter już zawierał skonfigurowany tooling (ESLint, Prettier, Husky, lint-staged), co eliminowało setup boilerplate.

---

## DEC-002: Auth — email + password przez Supabase

**Kontekst:** PRD wymaga kontroli dostępu. Opcje: magic link, OAuth, email+password.
**Decyzja:** Email + password z cookie-based sessions (HttpOnly, SameSite=Lax).
**Uzasadnienie:** Najprostsze do wdrożenia w 1-dniowym sprincie. Brak zależności od zewnętrznych providerów OAuth. Cookie-based flow działa z Astro SSR bez client-side tokenów.

---

## DEC-003: Schemat bazy danych — dwie tabele z RLS

**Kontekst:** PRD definiuje model: `requests` + `tracks`. Potrzebna izolacja danych per user.
**Decyzja:** Dwie tabele w Supabase Postgres z RLS (SELECT/INSERT/DELETE) per user_id. Delete cascade z requests na tracks.
**Uzasadnienie:** RLS zapewnia izolację na poziomie bazy — nawet błąd w kodzie nie ujawni cudzych danych. Cascade upraszcza logikę usuwania.

---

## DEC-004: AI provider — OpenRouter z modelem GPT-4o-mini

**Kontekst:** Potrzebny decision engine do generowania playlist. Opcje: bezpośrednio OpenAI, Anthropic, OpenRouter.
**Decyzja:** OpenRouter API z modelem `openai/gpt-4o-mini`.
**Uzasadnienie:** OpenRouter daje elastyczność zmiany modelu bez zmiany kodu. GPT-4o-mini oferuje dobry stosunek jakości do kosztu dla strukturalnego JSON output.

---

## DEC-005: Kontraktowy prompt z wymuszonym JSON

**Kontekst:** AI musi zwracać przewidywalną strukturę (inference + 5 tracków).
**Decyzja:** System prompt z precyzyjnym schematem JSON, `response_format: { type: "json_object" }`, walidacja po stronie serwera (fail fast jeśli nie 5 tracków).
**Uzasadnienie:** Eliminuje halucynacje strukturalne. Walidacja w `validate-playlist.ts` gwarantuje spójność przed zapisem do DB.

---

## DEC-006: Adapter Astro — @astrojs/node (standalone)

**Kontekst:** Astro wymaga adaptera do SSR. Opcje: `@astrojs/node`, `@astrojs/vercel`, `@astrojs/cloudflare`.
**Decyzja:** `@astrojs/node` w trybie standalone na czas developmentu.
**Uzasadnienie:** Uniwersalny adapter, działa lokalnie i w CI. Przed deploy na Vercel wymaga zamiany na `@astrojs/vercel`.
**Status:** Do zmiany przy deploy.

---

## DEC-007: Testy — Vitest z walidacją schematu playlisty

**Kontekst:** PRD wymaga min. 1 testu automatycznego. Starter nie miał Playwright.
**Decyzja:** Vitest (unit/integration). Testy pokrywają walidację JSON playlisty: 5 tracków, energy 1-5, tempo enum, wymagane pola.
**Uzasadnienie:** Najniższy próg tarcia — Vitest był już w devDependencies startera. Testowanie walidacji pokrywa krytyczną ścieżkę biznesową.

---

## DEC-008: CI — GitHub Actions (lint + test + build)

**Kontekst:** PRD wymaga pipeline CI/CD.
**Decyzja:** GitHub Actions: checkout → setup Node 22 → npm ci → lint → test → build. Placeholdery env dla build.
**Uzasadnienie:** Standardowy pipeline, zero konfiguracji zewnętrznych serwisów. Node 22 zgodny z lokalnym środowiskiem.

---

## DEC-009: Brak Update w CRUD

**Kontekst:** PRD definiuje Create/Read/Delete. Update nie jest w scope.
**Decyzja:** Świadome pominięcie operacji Update.
**Uzasadnienie:** Playlista jest immutable po wygenerowaniu. User może usunąć i wygenerować nową. Zmniejsza surface area kodu i testów.

---

## DEC-010: Narzędzia AI do budowy kodu

**Kontekst:** Projekt AI-first — cały kod generowany z pomocą AI.
**Decyzja:**
- **Claude Code (CLI)** z modelem **Claude Opus 4.5** — główny agent: architektura, implementacja, testy, CI, review, poprawki lint.
- **ChatGPT 5.2** — konsultacje, planowanie, przygotowanie artefaktów (.ai/prd.md, tech-stack, prompty).
- **OpenRouter + GPT-4o-mini** — runtime decision engine (generowanie playlist).

**Uzasadnienie:** Podział ról: ChatGPT do planowania i artefaktów, Claude Code do egzekucji kodu. OpenRouter w runtime ze względu na koszt i elastyczność.

---

## DEC-011: README dwujęzyczny (EN + PL)

**Kontekst:** Projekt po polsku, ale repo publiczne na GitHub.
**Decyzja:** README z pełną sekcją angielską na górze i polską poniżej.
**Uzasadnienie:** Zwiększa dostępność dla recenzentów i społeczności. Polska wersja zachowana dla kontekstu szkoleniowego.

---

## DEC-012: Lint i Prettier — wyłączenie prettier dla .astro w ESLint

**Kontekst:** CI padało na formatowaniu plików `.astro` — prettier plugin ESLint nie parsuje składni Astro.
**Decyzja:** Override w `eslint.config.js` wyłączający `prettier/prettier` dla `**/*.astro` i embedded script bloków.
**Uzasadnienie:** Pliki `.astro` są formatowane przez `prettier-plugin-astro` bezpośrednio, nie przez ESLint plugin.
