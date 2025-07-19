#!/bin/bash
set -e

# Kolory dla lepszej czytelności
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Konfiguracja tabel PlexiSystem - Kontrola Jakości i WZ ===${NC}"
echo ""

# Sprawdź czy istnieje plik .env
if [ ! -f .env ]; then
    echo -e "${RED}Błąd: Plik .env nie istnieje!${NC}"
    echo "Skopiuj .env.example do .env i uzupełnij dane dostępowe do Supabase."
    exit 1
fi

# Załaduj zmienne środowiskowe
source .env

# Sprawdź czy zmienne są ustawione
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}Błąd: Brak konfiguracji Supabase w pliku .env${NC}"
    echo "Ustaw VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY"
    exit 1
fi

echo -e "${GREEN}✓ Znaleziono konfigurację Supabase${NC}"
echo ""

# Instrukcje dla użytkownika
echo -e "${YELLOW}Instrukcja utworzenia tabel:${NC}"
echo ""
echo "1. Otwórz panel Supabase: ${VITE_SUPABASE_URL}"
echo "2. Przejdź do zakładki 'SQL Editor'"
echo "3. Skopiuj zawartość pliku 'create-quality-shipping-tables.sql'"
echo "4. Wklej do edytora SQL i kliknij 'Run'"
echo ""
echo -e "${GREEN}Tabele do utworzenia:${NC}"
echo "  - shipping_documents (dokumenty WZ)"
echo "  - shipping_document_items (pozycje dokumentów WZ)"
echo "  - quality_checks (kontrole jakości)"
echo "  - quality_measurements (pomiary)"
echo "  - quality_defects (defekty)"
echo ""

# Opcjonalnie otwórz przeglądarkę
read -p "Czy otworzyć panel Supabase w przeglądarce? (t/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Tt]$ ]]; then
    open "${VITE_SUPABASE_URL}"
fi

echo ""
echo -e "${GREEN}Po utworzeniu tabel uruchom ponownie aplikację.${NC}"