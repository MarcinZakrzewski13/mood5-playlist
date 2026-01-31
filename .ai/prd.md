# PRD – Mood5 Playlist  
## MVP – light (certyfikacyjne)

---

## 1. Cel produktu

Mood5 Playlist to prosta aplikacja webowa, która generuje **krótką, świadomą playlistę (5 utworów)** na podstawie **opisu aktualnego stanu emocjonalnego i celu użytkownika**.

Produkt działa „tu i teraz” – bez historii odsłuchań, bez profili emocjonalnych i bez integracji OAuth z zewnętrznymi serwisami streamingowymi.

---

## 2. Problem użytkownika

Użytkownik:
- ma określony **stan emocjonalny lub cel** (np. trening, regeneracja, skupienie, motywacja),
- ale ręczne wyszukiwanie muzyki, która faktycznie pasuje do danej chwili, jest **czasochłonne i losowe**.

Istniejące platformy (Spotify, YouTube Music):
- opierają się głównie na historii odsłuchań,
- słabo rozumieją **intencję użytkownika w danym momencie**,
- nie wyjaśniają, **dlaczego** dany utwór został polecony.

Mood5 Playlist:
- interpretuje opis słowny użytkownika,
- podejmuje świadomą decyzję rekomendacyjną,
- wyjaśnia każdą rekomendację.

---

## 3. Zakres MVP (ściśle kontrolowany)

### 3.1 User flow (jeden, prosty)

1. Użytkownik loguje się do aplikacji.
2. Użytkownik wpisuje opis w textarea, np.:
   - „Jestem zmęczony, ale chcę iść pobiegać”
   - „Jestem wkurzony po pracy”
   - „Potrzebuję skupienia do kodowania”
3. Użytkownik klika przycisk **Generate**.
4. System:
   - interpretuje emocję i cel,
   - generuje **dokładnie 5 utworów**.
5. Użytkownik widzi wynik:
   - tytuł utworu,
   - wykonawcę,
   - link do Spotify i/lub YouTube Music,
   - jednozdaniowe uzasadnienie wyboru.

---

## 4. Logika biznesowa (kluczowa)

Aplikacja działa jako **decision engine**, a nie losowy generator.

Logika obejmuje:
- mapowanie emocji → poziom energii (1–5),
- mapowanie celu → tempo i gatunek,
- decyzję wokal vs instrumental,
- spójność całej playlisty.

Każdy utwór MUSI posiadać krótkie uzasadnienie:
> „Dlaczego ten utwór pasuje do tego stanu emocjonalnego i celu.”

---

## 5. Poza zakresem MVP (twardo)

Do MVP **NIE wchodzą**:
- automatyczne tworzenie playlist w Spotify / YouTube,
- OAuth do serwisów zewnętrznych,
- historia odsłuchań,
- algorytmy ML,
- aplikacja mobilna,
- profile emocjonalne użytkownika,
- personalizacja długoterminowa.

Każdy element spoza tej listy jest **OUT OF SCOPE**.

---

## 6. Architektura MVP

### Frontend
- Astro + React
- Jeden ekran:
  - textarea (input użytkownika),
  - przycisk „Generate”,
  - lista 5 wyników.

### Backend / logika
- Supabase:
  - przechowywanie danych,
  - autentykacja użytkownika.
- Integracja AI:
  - OpenRouter / OpenAI,
  - kontraktowy prompt decyzyjny.

---

## 7. Kontrola dostępu (wymóg certyfikacyjny)

Aplikacja posiada **mechanizm kontroli dostępu użytkownika**:
- logowanie użytkownika realizowane przez Supabase Auth,
- niezalogowany użytkownik nie może generować playlist ani przeglądać zapisanych wyników.

---

## 8. Zarządzanie danymi (CRUD)

Aplikacja umożliwia zarządzanie danymi w zakresie domeny:

**Create**
- zapis requestu użytkownika,
- zapis wygenerowanych utworów.

**Read**
- odczyt listy wygenerowanych playlist użytkownika.

**Delete**
- usunięcie requestu wraz z przypisanymi utworami.

**Update**
- brak w MVP (świadoma decyzja projektowa).

---

## 9. Model danych (minimalny)

### requests
- id
- user_id
- user_input (text)
- inferred_emotion
- inferred_energy
- goal
- created_at

### tracks
- id
- request_id
- artist
- title
- tempo (slow / medium / fast)
- mood_tag
- spotify_url
- youtube_url
- explanation

---

## 10. Testy (wymóg certyfikacyjny)

Projekt zawiera co najmniej jeden **automatyczny test integracyjny lub E2E**, weryfikujący działanie aplikacji z perspektywy użytkownika.

Test obejmuje:
- podanie opisu użytkownika,
- wygenerowanie playlisty,
- weryfikację:
  - liczby wyników = 5,
  - poziomu energii zgodnego z opisem,
  - braku utworów sprzecznych z celem (np. ballad przy treningu).

---

## 11. CI/CD (wymóg certyfikacyjny)

Repozytorium zawiera pipeline CI/CD oparty o **GitHub Actions**, który:
- buduje aplikację,
- uruchamia testy automatyczne.

Pipeline uruchamia się na push oraz pull request.

---

## 12. Artefakty projektowe (AI-first workflow)

Projekt wykorzystuje artefakty kontekstowe:
- `.ai/prd.md`
- `.ai/ai-workflow.md`
- `.ai/rules/general.md`
- `.ai/decision-log.md` (jeśli wymagane decyzje architektoniczne)

Artefakty są używane jako kontekst do pracy z AI.

---

## 13. Status dokumentu

- Nazwa projektu: Mood5 Playlist
- Typ: PRD – light (certyfikacyjne)
- Owner: Marcin
- Wersja: 1.1
