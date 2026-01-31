# AI Workflow – 10xDevs (Claude Code–first)

## 1. Cel dokumentu
Ten dokument definiuje **operacyjny workflow współpracy z AI**, oparty o **Claude Code jako główny interfejs pracy**.

Workflow ma zapewnić:
- przewidywalność zmian,
- kontrolę jakości,
- pełną audytowalność decyzji,
- minimalizację halucynacji AI.

Dokument jest częścią kontekstu projektowego i podlega wersjonowaniu.

---

## 2. Główne narzędzie: Claude Code

### 2.1 Rola Claude Code
Claude Code jest:
- **głównym agentem roboczym**,
- interfejsem do pracy wieloplikowej,
- narzędziem do planowania, implementacji i review,
- zawsze do pracy z agentami należy używać modelu Opus 4.5



IDE (Cursor / JetBrains) pełni **rolę pomocniczą**:
- podgląd,
- szybkie poprawki,
- lokalna nawigacja.

Decyzje architektoniczne i zmiany systemowe **zawsze przechodzą przez Claude Code**.

---

## 3. Modele AI – świadomy podział ról

### 3.1 Model „Koder” (default)
**Zastosowanie:**
- implementacja kodu,
- refaktoryzacja,
- testy,
- poprawki CI.

**Domyślny model:**
- Claude Sonnet 4.5

**Zasady użycia:**
- krótkie iteracje,
- praca na istniejącym kodzie,
- brak zgadywania API.

---

### 3.2 Model „Architekt” (na żądanie)
**Zastosowanie:**
- PRD,
- decyzje techniczne (ADR),
- analiza ryzyk,
- debugging złożonych problemów.

**Model:**
- Claude Opus (jeśli dostępny)
- alternatywa: Gemini 2.5 Pro

**Zasady:**
- uruchamiany tylko świadomie,
- pełny kontekst,
- wynik = decyzje, nie kod.

---

## 4. Struktura kontekstu dla AI

.ai/
├── ai-workflow.md ← ten dokument
├── prd.md ← wymagania produktu
├── tech-stack.md ← decyzje technologiczne
├── decision-log.md ← decyzje architektoniczne
├── raid-log.md ← ryzyka i założenia
├── rules/
│ ├── general.md
│ ├── frontend.md
│ └── backend.md
└── prompts/
├── plan.md
├── implement.md
└── review.md


Claude Code **ma obowiązek**:
- czytać pliki z `.ai/`,
- nie łamać zapisanych reguł,
- eskalować niejasności zamiast zgadywać.

---

## 5. Reguły współpracy z AI (twarde)

1. AI **nie podejmuje decyzji biznesowych**
2. AI **nie rozszerza zakresu MVP**
3. AI **nie wprowadza nowych technologii bez zgody**
4. Jeśli czegoś nie wie → **pyta**
5. Jeśli kontekst jest sprzeczny → **eskaluje**

---

## 6. Workflow pracy (Claude Code–first)

### 6.1 Standardowy flow zadania
1. Definicja zadania (Issue / Task)
2. Check PRD + scope
3. `Claude Code → plan`
4. Review planu (ja = owner)
5. `Claude Code → implement`
6. Testy
7. `Claude Code → review`
8. Commit (Conventional Commits)
9. CI/CD

---

### 6.2 Zasada „plan → code → verify”
Claude Code **zawsze**:
- najpierw planuje,
- potem implementuje,
- na końcu weryfikuje.

Brak planu = brak kodu.

---

## 7. Kontrola jakości (DoD – skrót)

Zmiana jest „DONE”, jeśli:
- kod działa,
- testy przechodzą,
- nie ma TODO bez ownera,
- zmiana jest opisana (commit / decision-log),
- brak side-effectów poza zakresem.

---

## 8. Bezpieczeństwo i prywatność

- brak sekretów w repo,
- `.env` poza repo,
- brak wrażliwych danych w promptach,
- komunikacja Claude Code przez API (bez treningu).

---

## 9. Zarządzanie kosztami AI

Zasady:
- Sonnet domyślnie,
- Opus tylko do decyzji,
- krótkie iteracje,
- brak „promptowej eseistyki”.

---

## 10. Status dokumentu
- Owner: Marcin
- Workflow: Claude Code–first
- Wersja: 1.1
- Dokument żywy – aktualizowany iteracyjnie
