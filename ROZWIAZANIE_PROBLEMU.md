# 🚨 ROZWIĄZANIE PROBLEMÓW - PlexiSystem

## Problem: "your-project.supabase.co" - błędna konfiguracja

### ✅ Co zostało naprawione:

1. **Naprawiono importy Supabase**
   - Usunięto zduplikowany plik `src/config/supabase.ts`
   - Wszystkie komponenty używają teraz `@/lib/supabaseClient`
   - Dodano lepsze debugowanie konfiguracji

2. **Poprawiono generowanie PDF**
   - Usunięto zduplikowane deklaracje typów
   - Typy jsPDF są teraz w jednym miejscu: `src/types/jspdf-autotable.d.ts`

### 🔧 Co musisz zrobić TERAZ:

1. **Zrestartuj aplikację**
   ```bash
   # Zatrzymaj aplikację (Ctrl+C)
   # Uruchom ponownie
   npm run dev
   ```

2. **Sprawdź konsolę przeglądarki**
   - Powinieneś zobaczyć komunikat z konfiguracją Supabase
   - Upewnij się, że URL to `https://lsyclgolxakaxqtxwmgk.supabase.co`
   - NIE `https://your-project.supabase.co`

3. **Jeśli nadal widzisz "your-project.supabase.co":**
   
   a) Wyczyść cache przeglądarki:
      - Chrome: Ctrl+Shift+Delete → Wyczyść dane
      - Lub otwórz w trybie incognito
   
   b) Sprawdź plik .env:
      ```bash
      cat .env | grep SUPABASE
      ```
      Powinno pokazać:
      ```
      VITE_SUPABASE_URL=https://lsyclgolxakaxqtxwmgk.supabase.co
      VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      ```

4. **Utwórz tabele w Supabase (jeśli jeszcze nie utworzone):**
   ```bash
   ./setup-quality-tables.sh
   ```

### 📝 Testowanie po restarcie:

1. **Otwórz konsolę przeglądarki (F12)**
2. **Odśwież stronę (F5)**
3. **Sprawdź czy widzisz:**
   ```
   🔍 Supabase konfiguracja:
   URL: https://lsyclgolxakaxqtxwmgk.supabase.co
   Key: eyJhbGciOiJIUzI1NiI...
   ```

4. **Jeśli TAK - testuj funkcje:**
   - Kontrola Jakości → Nowy dokument WZ
   - Podgląd PDF powinien działać
   - Zapisywanie dokumentów powinno działać
   - Ustawienia powinny się zapisywać

### ⚠️ Jeśli problem nadal występuje:

Może być problem z cache Vite. Spróbuj:

```bash
# Zatrzymaj aplikację
# Usuń cache
rm -rf node_modules/.vite
rm -rf dist

# Zainstaluj ponownie zależności
npm install

# Uruchom aplikację
npm run dev
```

### 🆘 Ostatnia deska ratunku:

Jeśli nic nie pomaga, utwórz nowy plik `.env.local`:

```bash
cp .env .env.local
```

I uruchom aplikację ponownie. Vite czasem ma problemy z odczytem `.env` ale zawsze czyta `.env.local`.

---

**WAŻNE:** Problem z "your-project.supabase.co" oznacza, że aplikacja nie widzi zmiennych środowiskowych. Po restarcie powinno działać!