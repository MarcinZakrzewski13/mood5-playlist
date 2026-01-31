# AI Analysis – Mood5 Playlist

## 1. Stan repozytorium (10x Astro Starter)

### Framework & Config
- **Astro 5.13.7** – SSR enabled (`output: "server"`)
- **Adapter:** `@astrojs/node` (standalone, port 3000)
- **React 19** – skonfigurowany via `@astrojs/react`
- **Tailwind CSS v4** – via `@tailwindcss/vite`, kolory oklch w `global.css`
- **TypeScript** – strict, aliasy `@/*` → `./src/*`
- **ESLint 9** flat config + Prettier + Husky + lint-staged

### Co jest gotowe (użyteczne)
- SSR mode ✅ (potrzebne do auth/middleware)
- React integration ✅
- Tailwind ✅
- shadcn/ui button component + `cn()` utility ✅
- Lucide icons ✅
- ESLint + Prettier ✅

### Czego brakuje (do zbudowania)
- Supabase client (`@supabase/supabase-js` – brak w dependencies)
- Auth flow (login, callback, middleware)
- API endpoints (brak `src/pages/api/`)
- Strony `/generate`, `/history`, `/auth/login`
- DB schema (migrations)
- Testy (brak Vitest/Playwright)
- CI (brak `.github/workflows/`)
- `.env.example`

### Package manager & Node
- **npm** (package-lock.json)
- **Node 22.14.0** (wg README, brak `.nvmrc` w repo)

### Istniejące strony
- `src/pages/index.astro` – welcome page (do zastąpienia/przekierowania)

### Env vars (zdefiniowane w `src/env.d.ts`)
- `SUPABASE_URL`, `SUPABASE_KEY`, `OPENROUTER_API_KEY`

---

## 2. Ryzyka "1-dniowe"

| Ryzyko | Mitygacja |
|--------|-----------|
| SSR wymagane do auth cookies/middleware | ✅ Już skonfigurowane |
| Brak Supabase SDK | Instalacja `@supabase/supabase-js` |
| Brak testów w repo | Zainstalować Vitest (niski próg tarcia z Astro) |
| RLS wymaga service_role_key do migration | SQL migration plik, user uruchomi w Supabase Dashboard |
| OpenRouter API key potrzebny | `.env.example` z placeholderami |
| Redirect URL dla Supabase Auth | Dokumentacja w `.env.example` |

---

## 3. Definition of Done (cert-minimum)

- [ ] Auth: login (email+password), logout, middleware chroniące `/generate` i `/history`
- [ ] DB: tabele `requests` + `tracks` z RLS
- [ ] CRUD: Create (generate → save), Read (history), Delete (request + cascade tracks)
- [ ] Generate: textarea → AI → walidacja 5 tracków → zapis → wyświetlenie
- [ ] 1 test automatyczny (Vitest integration)
- [ ] CI: GitHub Actions (build + test na push/PR)
