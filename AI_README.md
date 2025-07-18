# Integracja AI w PlexiSystem

## Dostępne API AI

System PlexiSystem obsługuje integrację z następującymi dostawcami AI:

### 1. Claude AI (Anthropic) - REKOMENDOWANE
- **Zalety**: Najlepsza jakość odpowiedzi, świetne rozumienie kontekstu biznesowego
- **Model**: Claude 3 Opus lub Sonnet
- **Koszt**: ~$15/milion tokenów (Opus), ~$3/milion tokenów (Sonnet)
- **Klucz API**: https://console.anthropic.com/

### 2. OpenAI GPT
- **Zalety**: Popularny, dobra dokumentacja, szybkie odpowiedzi
- **Model**: GPT-4 Turbo lub GPT-3.5 Turbo
- **Koszt**: ~$10/milion tokenów (GPT-4), ~$0.50/milion tokenów (GPT-3.5)
- **Klucz API**: https://platform.openai.com/api-keys

### 3. Google Gemini
- **Zalety**: Darmowy limit, dobra integracja z Google
- **Model**: Gemini Pro
- **Koszt**: Darmowe do 60 zapytań/minutę
- **Klucz API**: https://makersuite.google.com/app/apikey

### 4. Perplexity AI
- **Zalety**: Dostęp do internetu, aktualne dane rynkowe
- **Model**: pplx-70b-online
- **Koszt**: ~$5/milion tokenów
- **Klucz API**: https://www.perplexity.ai/settings/api

## Konfiguracja

1. **Skopiuj plik konfiguracyjny**:
   ```bash
   cp .env.ai.example .env
   ```

2. **Uzupełnij klucze API** w pliku `.env`:
   ```env
   VITE_CLAUDE_API_KEY=your-claude-api-key
   VITE_OPENAI_API_KEY=your-openai-api-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   VITE_PERPLEXITY_API_KEY=your-perplexity-api-key
   ```

3. **Wybierz aktywnego dostawcę** w pliku `src/config/aiConfig.ts`:
   ```typescript
   export const ACTIVE_AI_PROVIDER = AI_PROVIDERS.claude; // lub openai, gemini, perplexity
   ```

## Funkcje AI w systemie

### 1. Analiza cen produktów
- Sugeruje optymalne ceny na podstawie danych rynkowych
- Analizuje konkurencję i historię sprzedaży
- Przewiduje wpływ zmian cen na sprzedaż

### 2. Przewidywanie konwersji ofert
- Ocenia prawdopodobieństwo zaakceptowania oferty
- Wskazuje czynniki wpływające na decyzję
- Sugeruje działania zwiększające szanse

### 3. Generator opisów produktów
- Tworzy profesjonalne opisy marketingowe
- Dostosowuje ton do grupy docelowej
- Generuje słowa kluczowe SEO

### 4. Optymalizator nestingu
- Inteligentne rozmieszczenie detali na arkuszu
- Minimalizacja odpadów materiału
- Sugestie cięcia i kolejności produkcji

### 5. Business Insights
- Analiza trendów sprzedażowych
- Rekomendacje biznesowe
- Identyfikacja okazji rynkowych

## Koszty i limity

### Szacowane miesięczne koszty (przy 1000 zapytań/miesiąc):
- **Claude AI Opus**: ~$15-30
- **Claude AI Sonnet**: ~$3-6
- **GPT-4 Turbo**: ~$10-20
- **GPT-3.5 Turbo**: ~$0.50-1
- **Gemini Pro**: Darmowe (limit 60/min)
- **Perplexity**: ~$5-10

### Rekomendacje:
- **Dla małych firm**: Gemini Pro (darmowy) lub GPT-3.5 Turbo
- **Dla średnich firm**: Claude Sonnet lub Perplexity
- **Dla dużych firm**: Claude Opus lub GPT-4 Turbo

## Bezpieczeństwo

1. **Nigdy nie commituj kluczy API** do repozytorium
2. Używaj zmiennych środowiskowych
3. Ogranicz uprawnienia kluczy API
4. Monitoruj użycie i koszty

## Rozwiązywanie problemów

### Błąd: "AI API Error"
- Sprawdź czy klucz API jest poprawny
- Sprawdź limity API (rate limiting)
- Sprawdź saldo konta

### Błąd: "Failed to parse AI response"
- AI może zwracać niepoprawny format
- Sprawdź logi konsoli
- System automatycznie użyje danych fallback

## Wsparcie

W razie problemów z integracją AI:
1. Sprawdź dokumentację dostawcy API
2. Zobacz logi w konsoli przeglądarki
3. Skontaktuj się z supportem dostawcy AI
