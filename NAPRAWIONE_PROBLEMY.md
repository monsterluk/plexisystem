# 🔧 Naprawione problemy w PlexiSystem

## ✅ 1. Podgląd wydruku PDF dokumentów WZ
- Dodano komponent `PDFPreviewModal` do wyświetlania podglądu PDF w modalnym oknie
- Naprawiono generowanie PDF z polskimi znakami
- Dodano przycisk "Podgląd wydruku" w formularzu tworzenia WZ
- PDF otwiera się w modalnym oknie zamiast nowej karty przeglądarki

## ✅ 2. Zapisywanie dokumentów WZ
- Naprawiono konfigurację Supabase (zmiana z `process.env.REACT_APP_` na `import.meta.env.VITE_`)
- Poprawiono formatowanie danych przed zapisem do bazy
- Utworzono plik SQL z tabelami dla dokumentów WZ i kontroli jakości
- Dodano skrypt `setup-quality-tables.sh` do łatwego utworzenia tabel

## ✅ 3. Zapisywanie ustawień automatyzacji
- Dodano zapisywanie ustawień powiadomień w localStorage
- Dodano zapisywanie reguł automatyzacji w localStorage
- Ustawienia są automatycznie ładowane przy starcie aplikacji
- Dodano komunikaty potwierdzające zapisanie

## 📝 Do zrobienia:

### 1. Uruchom tabele w Supabase:
```bash
./setup-quality-tables.sh
```
Lub ręcznie:
1. Otwórz panel Supabase
2. Przejdź do SQL Editor
3. Wklej zawartość pliku `create-quality-shipping-tables.sql`
4. Kliknij "Run"

### 2. Instalacja brakujących pakietów (jeśli potrzebne):
```bash
npm install
```

### 3. W przyszłości:
- Przenieść ustawienia z localStorage do Supabase
- Dodać edycję zapisanych dokumentów WZ
- Dodać wysyłanie dokumentów mailem
- Dodać więcej opcji eksportu (Excel, CSV)

## 🚀 Testowanie:

1. **Dokumenty WZ**:
   - Kliknij "Kontrola Jakości i Wysyłki" → "Nowy dokument WZ"
   - Wypełnij formularz
   - Kliknij "Podgląd wydruku" - powinien otworzyć się modal z PDF
   - Kliknij "Zapisz dokument" - dokument powinien zapisać się w bazie

2. **Ustawienia**:
   - Przejdź do "Automatyzacja"
   - Zmień ustawienia powiadomień → kliknij "Zapisz ustawienia"
   - Włącz/wyłącz reguły automatyzacji - stan powinien być zapamiętany
   - Odśwież stronę - ustawienia powinny zostać zachowane