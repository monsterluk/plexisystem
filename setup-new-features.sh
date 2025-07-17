#!/bin/bash

# Skrypt do wykonania nowych tabel w bazie danych Supabase

echo "🚀 Tworzenie nowych tabel w bazie danych..."

# Odczytaj zmienne środowiskowe
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Sprawdź czy mamy URL do bazy
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ Brak VITE_SUPABASE_URL w pliku .env"
    exit 1
fi

# Wyświetl informacje
echo "📊 Tworzenie tabel dla nowych funkcjonalności:"
echo "   - contracts (umowy)"
echo "   - order_status (statusy zamówień)"
echo "   - client_messages (wiadomości klientów)"
echo "   - notifications (powiadomienia)"
echo "   - email_templates (szablony email)"
echo "   - email_logs (logi email)"

# Informacja dla użytkownika
echo ""
echo "⚠️  UWAGA: Wykonaj plik SQL 'create-new-tables.sql' w Supabase SQL Editor"
echo ""
echo "1. Otwórz Supabase Dashboard"
echo "2. Przejdź do SQL Editor"
echo "3. Skopiuj zawartość pliku 'create-new-tables.sql'"
echo "4. Wklej i wykonaj zapytanie"
echo ""
echo "✅ Po wykonaniu będziesz mógł korzystać z:"
echo "   - Generowania umów PDF"
echo "   - Panelu klienta ze śledzeniem statusu"
echo "   - Systemu powiadomień"
echo "   - Rozbudowanego AI"
echo "   - Raportów i statystyk"

# Opcjonalnie: wyświetl zawartość pliku
echo ""
echo "📄 Podgląd pierwszych 20 linii pliku SQL:"
head -20 create-new-tables.sql
