# PlexiSystem - System Ofertowania

System do zarządzania ofertami dla firmy produkującej wyroby z plexi i tworzyw sztucznych.

## 🚀 Szybki start

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/your-repo/plexisystem.git
cd plexisystem
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Skopiuj plik środowiskowy**
```bash
cp .env.example .env
```

4. **Uruchom aplikację**
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:5173

## 📁 Struktura projektu

```
src/
├── api/               # Komunikacja z API
├── components/        # Komponenty React
│   ├── client/       # Komponenty klienta
│   ├── offer/        # Komponenty oferty
│   ├── quotation/    # Komponenty wyceny
│   └── ui/           # Komponenty UI
├── constants/        # Stałe (materiały, opcje)
├── context/          # React Context
├── hooks/            # Custom hooks
├── pages/            # Strony aplikacji
├── types/            # Typy TypeScript
└── utils/            # Funkcje pomocnicze
```

## 🛠️ Technologie

- **React 18** - Framework UI
- **TypeScript** - Typowanie statyczne
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Stylowanie
- **Lucide React** - Ikony

## 📋 Funkcjonalności

- ✅ Kalkulator produktów z plexi
- ✅ Zarządzanie ofertami
- ✅ Generowanie PDF
- ✅ Linki do akceptacji online
- ✅ Integracja z GUS API
- ✅ System powiadomień
- ✅ Tryby widoku (handlowiec/klient)

## 🔧 Skrypty

```bash
npm run dev      # Uruchom serwer deweloperski
npm run build    # Zbuduj produkcyjną wersję
npm run preview  # Podgląd wersji produkcyjnej
npm run lint     # Sprawdź kod ESLint
```

## 🏗️ Budowanie dla produkcji

```bash
npm run build
```

Pliki produkcyjne znajdą się w katalogu `dist/`.

## 🔐 Zmienne środowiskowe

Skopiuj `.env.example` do `.env` i uzupełnij wartości:

- `VITE_API_URL` - URL do API backendu
- `VITE_GUS_API_URL` - URL do API GUS
- Pozostałe zmienne w pliku `.env.example`

## 📝 Konwencje kodu

- Komponenty React - PascalCase
- Funkcje i zmienne - camelCase
- Stałe - UPPER_SNAKE_CASE
- Typy TypeScript - PascalCase z prefiksem `I` dla interfejsów

## 🤝 Współpraca

1. Stwórz branch z nową funkcjonalnością
2. Commituj zmiany
3. Stwórz Pull Request

## 📄 Licencja

Własnościowa - PlexiSystem Sp. z o.o.