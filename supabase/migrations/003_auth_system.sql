-- Migracja dla systemu autoryzacji i ról użytkowników

-- Tabela profiles (rozszerzenie auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'salesperson', 'viewer')) DEFAULT 'viewer',
  salesperson_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger dla automatycznego tworzenia profilu przy rejestracji
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, split_part(new.email, '@', 1), 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Użytkownicy mogą tylko czytać swój profil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admini mogą wszystko
CREATE POLICY "Admins can do everything" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Dodaj kolumny do tabeli offers dla śledzenia właściciela
ALTER TABLE offers ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS salesperson_id TEXT;

-- RLS dla offers - handlowcy widzą tylko swoje oferty
CREATE POLICY "Salespeople see own offers" ON offers
  FOR SELECT USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.role = 'viewer')
    )
  );

-- Handlowcy mogą tworzyć oferty
CREATE POLICY "Salespeople can create offers" ON offers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'salesperson')
    )
  );

-- Handlowcy mogą edytować swoje oferty
CREATE POLICY "Salespeople can update own offers" ON offers
  FOR UPDATE USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
