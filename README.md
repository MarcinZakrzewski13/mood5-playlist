# Mood5 Playlist

Aplikacja webowa generująca 5-utworową playlistę dopasowaną do nastroju i celu użytkownika. Wpisujesz jak się czujesz, a AI dobiera muzykę i wyjaśnia dlaczego.

## Geneza projektu

Projekt powstał w ramach szkolenia **[10xDevs](https://10xdevs.pl/)** jako certyfikacyjne MVP. Bazuje na starterze [10x-astro-starter](https://github.com/przeprogramowani/10x-astro-starter) autorstwa zespołu przeprogramowani.

## AI-assisted development

Kod został wygenerowany z wykorzystaniem narzędzi AI:

- **Claude Code** (CLI) powered by **Claude Opus 4.5** (`claude-opus-4-5-20251101`) - główny agent kodujący, architektura, implementacja, testy, CI
- **OpenRouter** z modelem **OpenAI GPT-4o-mini** - silnik decyzyjny generujący playlisty (runtime)
- **ChatGPT 5.2** - konsultacje, planowanie, przygotowanie artefaktów projektowych (PRD, tech-stack, prompty)

## Tech Stack

- **Framework:** [Astro](https://astro.build/) v5 (SSR, `@astrojs/node`)
- **UI:** [React](https://react.dev/) v19
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Auth & DB:** [Supabase](https://supabase.com/) (email+password, Postgres, RLS)
- **AI:** [OpenRouter](https://openrouter.ai/) (GPT-4o-mini)
- **Testy:** [Vitest](https://vitest.dev/)
- **CI:** GitHub Actions

## Funkcjonalności

- Rejestracja i logowanie (email + hasło)
- Generowanie playlisty na podstawie opisu nastroju/celu
- AI interpretuje emocje, dobiera energy level, tempo i styl wokalny
- 5 tracków z linkami do Spotify/YouTube i uzasadnieniem wyboru
- Historia wygenerowanych playlist
- Usuwanie playlist (cascade)
- Kontrola dostępu (middleware, RLS)

## Uruchomienie lokalne

```bash
# 1. Zainstaluj zależności
npm install

# 2. Skopiuj i uzupełnij zmienne środowiskowe
cp .env.example .env
# Uzupełnij SUPABASE_URL, SUPABASE_KEY, OPENROUTER_API_KEY

# 3. Uruchom migrację w Supabase SQL Editor
# Plik: supabase/migrations/001_create_tables.sql

# 4. Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna na http://localhost:3000

## Struktura projektu

```
src/
├── components/       # React components (GenerateForm, TrackList, HistoryList, NavBar)
├── layouts/          # Astro layouts
├── lib/              # Logika biznesowa (openrouter, validate-playlist, supabase client)
├── middleware.ts      # Auth middleware (cookie-based, chroni protected routes)
├── pages/
│   ├── api/          # Server endpoints (auth/login, auth/register, auth/logout, generate, history)
│   ├── auth/         # Login page, callback
│   ├── generate.astro
│   ├── history.astro
│   └── index.astro
├── styles/           # Global CSS
tests/                # Vitest testy walidacji
supabase/migrations/  # SQL schema + RLS
.ai/                  # Artefakty projektowe (PRD, tech-stack, prompty, reguły)
.github/workflows/    # CI pipeline
```

## Skrypty

- `npm run dev` - serwer deweloperski
- `npm run build` - build produkcyjny
- `npm test` - testy (Vitest)
- `npm run lint` - linting (ESLint)

## Licencja

MIT
