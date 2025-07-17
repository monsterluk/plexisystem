# PlexiSystem - System Ofertowania

## 🚀 Aktualizacje do wykonania w Supabase

### 1. Dodaj kolumny do tabeli `offers`:

```sql
-- Dodaj kolumny email i telefon handlowca
ALTER TABLE offers 
ADD COLUMN salesperson_email TEXT,
ADD COLUMN salesperson_phone TEXT;
```

### 2. Zaktualizuj widoczność ofert dla handlowców:

Dorota Będkowska powinna widzieć tylko swoje oferty (salesperson_id = 'DB')
Łukasz Sikorra powinien widzieć wszystkie oferty (administrator)

Możesz to zrobić przez RLS (Row Level Security) w Supabase.

## 📧 Powiadomienia email

Teraz powiadomienia o akceptacji/odrzuceniu oferty są wysyłane na email handlowca:
- Dorota Będkowska: dorota@plexisystem.pl
- Łukasz Sikorra: lukasz@plexisystem.pl

## 🔧 Do zrobienia:

1. **Moduł "Baza Wiedzy"** - informacje techniczne o tworzywach i frezach
2. **Moduł AI** - asystent do tworzenia ofert
3. **Naprawić podgląd/wydruk PDF** w historii ofert
4. **Role użytkowników** - administrator vs handlowiec
5. **Poprawić szatę graficzną**
6. **Integracja z GUS API** - klucz: cc8f3d1743644ffc9b15

## 🌐 Adresy:

- Frontend: https://plexisystem.netlify.app
- Backend: https://plexisystem-backend.onrender.com

## 💻 Rozwój lokalny:

```bash
# Frontend
npm install
npm run dev

# Backend (w folderze plexisystem-backend)
npm install
npm run dev
```

## 🔑 Zmienne środowiskowe:

### Frontend (.env):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env):
```
PORT=3001
SMTP_HOST=s44.cyber-folks.pl
SMTP_PORT=465
SMTP_USER=oferty@plexisystem.pl
SMTP_PASS=your_password
DATABASE_PATH=./plexisystem.db
```