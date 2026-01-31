# Tech Stack – Mood5 Playlist (cert-minimum)

## Cel techniczny (1-dniowy mega-sprint)
Dowieźć certyfikowalne MVP:
- Auth (Supabase) + kontrola dostępu do ekranów i danych
- Create/Read/Delete dla domeny (requests + tracks)
- Generowanie playlisty (AI) z kontraktowym JSON
- 1 automatyczny test (integration lub E2E)
- CI (GitHub Actions) uruchamiany na push i PR
- Deploy: opcjonalnie na końcu na Vercel

## Frontend
- Framework: Astro
- UI: React (komponenty)
- Styling: TailwindCSS (minimalny)
- Strony (minimum):
  - `/auth/login` (i ewentualnie `/auth/callback`)
  - `/generate` (textarea + button + wynik 5 tracków)
  - `/history` (lista requestów + delete)

## Backend / Server
- Astro server-side endpoints (API routes) albo server actions (w zależności od repo)
- Node.js: >= 20 (dopasuj do repo / CI)
- Walidacja odpowiedzi AI:
  - parse JSON
  - schema check (tracks.length == 5, energy 1..5, tempo enum)
  - hard-fail na niezgodność (czytelny błąd dla usera)

## Baza danych i Auth
- Supabase:
  - Auth: email magic link lub email+password (wybierz najprostsze, które działa najszybciej)
  - DB: Postgres
- Tabele (zgodnie z PRD):
  - `requests`: id, user_id, user_input, inferred_emotion, inferred_energy, goal, created_at
  - `tracks`: id, request_id, artist, title, tempo, mood_tag, spotify_url, youtube_url, explanation
- Dostęp do danych:
  - Minimum: filtruj po `user_id` w zapytaniach
  - Preferowane (jeśli czas pozwoli): RLS w Supabase dla `requests` i `tracks`

## Integracja AI (Decision Engine)
- Provider: OpenAI lub OpenRouter (wykryj z repo / env)
- Prompt kontraktowy: `generate-playlist.prompt.md.txt`
- Wejście do prompta (JSON):
  - user_input: string
  - preferred_platforms: ["spotify","youtube_music"]
  - language_hint: "pl"
  - allow_instrumental: true
- Wyjście z prompta (JSON):
  - inference: emotion, goal, energy(1..5), constraints{avoid[],prefer[]}, vocal_style
  - tracks: 5 elementów, każdy z: artist,title,tempo,mood_tag,spotify_url|null,youtube_url|null,explanation

## Testy (cert-minimum)
- Wybierz najniższy próg tarcia:
  - Jeśli repo ma Playwright: 1 test E2E
  - Jeśli repo ma Vitest: 1 test integracyjny (mock AI + real DB lub mock DB)
- Minimalny scenariusz testu:
  - user input -> generate -> assert 5 wyników
  - assert: energy zgodne z opisem (przynajmniej “nie sprzeczne”)
  - assert: brak ballad przy treningu (na podstawie `tempo`/`energy`)

## CI/CD
- GitHub Actions:
  - checkout
  - setup node
  - install (wg lockfile: npm/pnpm/yarn)
  - lint (jeśli jest)
  - test
  - build
- Uruchamianie: push + pull_request

## Deploy (opcjonalnie, na końcu)
- Vercel
- Wymaga:
  - ustawienia ENV w Vercel
  - poprawnych redirect URL w Supabase Auth
  - Astro adapter (jeśli SSR potrzebny przez auth)

## Sekrety / konfiguracja
- Lokalnie: `.env` (nie commitować)
- W repo: `.env.example` z placeholderami
- Przykładowe zmienne (dostosuj do tego co faktycznie używa kod):
  - SUPABASE_URL=
  - SUPABASE_ANON_KEY=
  - SUPABASE_SERVICE_ROLE_KEY= (tylko jeśli konieczne; najlepiej unikać w web app)
  - OPENAI_API_KEY= lub OPENROUTER_API_KEY=
  - AI_MODEL= (np. "gpt-4o-mini" / "claude-3.5-sonnet" / itd.)

## Konwencje (fast + audytowalne)
- Zero scope creep (tylko PRD MVP).
- Każdy większy krok kończyć commitem z opisem.
- Najpierw end-to-end “happy path”, potem uszczelnienia.
