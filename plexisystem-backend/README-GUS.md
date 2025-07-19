# API GUS - Instrukcja konfiguracji i testowania

## Dane dostępowe
- **Klucz API:** cc8f3d1743644ffc9b15
- **URL produkcyjny:** https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc
- **WSDL:** https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc?wsdl

## Instalacja

1. Zainstaluj wymagane pakiety:
```bash
cd plexisystem-backend
npm install
```

2. Upewnij się, że w package.json są wszystkie wymagane pakiety:
- soap
- xml2js
- axios
- express
- cors
- sqlite3
- uuid

## Testowanie

### 1. Test bezpośredniego połączenia z GUS
```bash
cd plexisystem-backend/tests
node test-gus.js
```

Ten test sprawdzi:
- Logowanie do API GUS
- Wyszukiwanie firmy po NIP
- Wylogowanie

### 2. Test przez backend API
Najpierw uruchom backend:
```bash
cd plexisystem-backend
npm run dev
```

Następnie w nowym terminalu:
```bash
cd plexisystem-backend/tests
bash test-backend-gus.sh
```

### 3. Test w przeglądarce
Gdy backend działa, możesz otworzyć w przeglądarce:
- http://localhost:3001/api/health - sprawdzenie statusu
- http://localhost:3001/api/gus/5252344078 - wyszukanie firmy po NIP

## Struktura kodu

### Backend (server.js)
- Endpoint `/api/gus/:nip` - obsługuje wyszukiwanie po NIP
- Używa `gusService.js` do komunikacji z API GUS
- W przypadku błędu zwraca dane testowe

### GUS Service (gusService.js)
- Implementuje protokół SOAP dla API GUS
- Zarządza sesją (automatyczne logowanie i odnawianie)
- Formatuje dane odpowiedzi

### Frontend (gusService.ts)
- Wywołuje backend przez proxy endpoint
- Obsługuje błędy i dane testowe

## Rozwiązywanie problemów

### Błąd "nieaktywny identyfikator sesji"
- Sesja wygasła - serwis automatycznie odnowi sesję

### Błąd połączenia
- Sprawdź czy backend działa: `npm run dev`
- Sprawdź logi w konsoli backendu

### Brak danych dla NIP
- API GUS może nie mieć danych dla niektórych NIP-ów
- Backend zwróci dane testowe jako fallback

## Przykładowe NIP-y do testów
- 5252344078 - PlexiSystem
- 5213870274 - Google Poland  
- 5882396272 - PlexiSystem S.C.
- 1234567890 - Firma testowa (tylko mock)

## Namespace XML
API GUS używa dwóch namespace:
- `http://CIS/BIR/PUBL/2014/07` - główne operacje
- `http://CIS/BIR/PUBL/2014/07/DataContract` - parametry wyszukiwania

## Uwagi
- API GUS wymaga SOAP 1.2
- Sesja wygasa po 60 minutach
- Maksymalny rozmiar odpowiedzi: 50MB
- Timeout połączenia: 30 sekund
