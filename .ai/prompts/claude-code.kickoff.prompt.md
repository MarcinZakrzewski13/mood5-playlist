Jesteś Claude Code pracującym w moim repo. Cel: w 1 dzień dowieźć cert-minimum MVP zgodne z PRD, bez scope creep.

Kontekst (masz to traktować jako źródło prawdy):
- `.ai/prd.md` (MVP zakres + wymagania certyfikacji)
- `.ai/ai-workflow.md` (jak pracujemy i jak raportujesz postęp)
- `.ai/tech-stack.md` (stack i założenia)
- `generate-playlist.prompt.md.txt` (kontraktowy prompt JSON)
- repozytorium zawiera przygotowany przez autorów kursu  10x Astro Starter - przeanalizuj scope tego starter i jeśli będzie do wykorzystania to użyjemy - przetnij to repo z zawartością `.ai/tech-stack.md`
- stosujemy zasadę KISS, to jest zadanie w którym moim zadaniem było przygotowanie wkładu w postaci plików a zadaniem LLM bedzie kodowanie.

Zasady pracy:
- Najpierw wykonaj analizę repo i napisz plan, potem automatycznie realizuj plan.
- Minimalizuj zmiany, wybieraj najkrótszą ścieżkę do “DONE”.
- Nie dodawaj feature’ów spoza PRD (brak OAuth do Spotify/YT, brak historii odsłuchań itd.).
- Każdy etap kończ działającym stanem (kompiluje się / test przechodzi). Częste commity.

Krok 1 — ANALIZA (obowiązkowe, zanim zaczniesz kodować)
1) Przeskanuj repo:
   - framework: Astro config, SSR/static, routing, middleware
   - czy jest React/Tailwind skonfigurowany
   - czy jest Supabase client i jak jest używany
   - czy jest już jakikolwiek auth flow
   - jakie są testy (Vitest/Playwright) i jak odpalić
   - jaki package manager i wersja node (lockfile, engines)
2) Wypisz ryzyka “1-dniowe” (np. SSR wymagane do auth, RLS, redirect URL).
3) Zdefiniuj minimalny “Definition of Done” (Auth + CRUD + Generate + 1 test + CI).
4) Zapisz wynik analizy do pliku `./AI_ANALYSIS.md`.

Krok 2 — PLAN (obowiązkowe, potem realizujesz)
1) Przygotuj plan wykonania w kolejności krytycznej, z krokami które da się odhaczyć.
2) Każdy krok planu musi mieć:
   - cel
   - zmieniane pliki
   - kryterium zakończenia (co sprawdzamy)
3) Zapisz plan do `./AI_PLAN.md`.

Krok 3 — REALIZACJA (jedziesz automatycznie według planu)
Priorytet kolejności:
A) Auth + ochrona stron (/generate, /history)
B) DB schema (requests + tracks) + (jeśli mało roboty) RLS
C) Endpoint “generate”: input -> AI -> walidacja -> zapis -> odpowiedź
D) UI generate: textarea + render 5 tracków
E) History: lista requestów + delete (cascade)
F) 1 test automatyczny (najniższy próg tarcia: użyj frameworka już obecnego w repo)
G) GitHub Actions CI: build + test (push + PR)
H) (opcjonalnie) Vercel deploy + env + Supabase redirect URL

Wymogi domenowe (twarde):
- Generate zawsze zwraca dokładnie 5 tracków (albo błąd).
- Waliduj JSON z `generate-playlist.prompt.md.txt`:
  - tracks.length == 5
  - energy 1..5
  - tempo slow|medium|fast
  - spotify_url/youtube_url mogą być null
- Dane w DB zawsze powiązane z user_id.
- Niezalogowany user nie może generować ani widzieć historii.

Krok 4 — RAPORTOWANIE POSTĘPU (minimalne, bez korpo-procesów)
Po każdym ukończonym kroku planu dopisz do `./AI_PLAN.md` status ✅ oraz krótką notkę:
- co zrobiono
- jak zweryfikowano (komenda / ekran / test)

Zakaz:
- Nie twórz JIRA/Trello, nie pisz rozbudowanych statusów.
- Nie dodawaj telemetry/PostHog, chyba że PRD tego wymaga (nie wymaga).

Start:
- Wykonaj Krok 1 (ANALIZA) i Krok 2 (PLAN), zapisz pliki, a następnie przejdź do realizacji od kroku A bez pytania o zgodę.
