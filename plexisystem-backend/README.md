# PlexiSystem Backend

Backend API dla systemu PlexiSystem - obsługa emaili, bazy danych i więcej.

## Funkcje

- ✉️ Wysyłanie emaili (SMTP)
- 📊 API dla ofert (w przygotowaniu)
- 🏢 Integracja z GUS (w przygotowaniu)

## Technologie

- Node.js + Express
- Nodemailer (email)
- SQLite (baza danych) - w przygotowaniu
- CORS

## Uruchomienie lokalnie

```bash
npm install
npm run dev
```

## Deploy na Render

Ten backend jest przygotowany do deployu na Render.com

## Zmienne środowiskowe

Stwórz plik `.env` na podstawie `.env.example`

```
PORT=3001
BASE_URL=https://plexisystem.vercel.app
SMTP_HOST=your_smtp_host
SMTP_PORT=465
SMTP_USER=your_email
SMTP_PASS=your_password
```

## API Endpoints

- `GET /` - Informacje o API
- `GET /api/health` - Health check
- `POST /api/send-email` - Wysyłanie emaili