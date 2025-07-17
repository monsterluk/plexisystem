-- Utworzenie tabel dla PlexiSystem

-- 1. Tabela klientów
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  nip VARCHAR(20) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  email TEXT,
  phone VARCHAR(20),
  regon VARCHAR(20),
  wojewodztwo TEXT,
  powiat TEXT,
  gmina TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela profili użytkowników
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'salesperson', 'viewer')) DEFAULT 'viewer',
  salesperson_id VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela ofert
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  offer_number VARCHAR(50) UNIQUE NOT NULL,
  share_token UUID DEFAULT gen_random_uuid() UNIQUE,
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  salesperson_id VARCHAR(10) NOT NULL,
  salesperson_name TEXT NOT NULL,
  salesperson_email TEXT,
  salesperson_phone VARCHAR(20),
  project_name TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  total_net DECIMAL(10,2) DEFAULT 0,
  discount INTEGER DEFAULT 0,
  discount_value DECIMAL(10,2) DEFAULT 0,
  total_net_after_discount DECIMAL(10,2) DEFAULT 0,
  delivery_region VARCHAR(50) DEFAULT 'odbior',
  delivery_cost DECIMAL(10,2) DEFAULT 0,
  terms_delivery_time TEXT DEFAULT '3-10 dni roboczych',
  terms_delivery_method TEXT DEFAULT 'Kurier / odbiór osobisty',
  terms_payment TEXT DEFAULT 'Przelew 7 dni',
  terms_warranty TEXT DEFAULT 'Produkty niestandardowe nie podlegają zwrotowi',
  terms_validity TEXT DEFAULT '7 dni',
  valid_until DATE,
  comment TEXT,
  internal_notes TEXT,
  version INTEGER DEFAULT 1,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela pozycji ofert
CREATE TABLE offer_items (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL,
  product VARCHAR(50) NOT NULL,
  product_name TEXT NOT NULL,
  expositor_type VARCHAR(50),
  material VARCHAR(50) NOT NULL,
  material_name TEXT NOT NULL,
  thickness DECIMAL(10,2) NOT NULL,
  width DECIMAL(10,2) NOT NULL,
  height DECIMAL(10,2) NOT NULL,
  depth DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  surface DECIMAL(10,4) DEFAULT 0,
  weight DECIMAL(10,2) DEFAULT 0,
  options JSONB DEFAULT '{}',
  calculations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela ustawień aplikacji
CREATE TABLE app_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabela statystyk ofert
CREATE TABLE offer_statistics (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- 7. Tabela historii statusów
CREATE TABLE offer_status_history (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20),
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Indeksy dla wydajności
CREATE INDEX idx_offers_client_id ON offers(client_id);
CREATE INDEX idx_offers_salesperson_id ON offers(salesperson_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_created_at ON offers(created_at);
CREATE INDEX idx_offer_items_offer_id ON offer_items(offer_id);
CREATE INDEX idx_clients_nip ON clients(nip);

-- Wyłącz RLS dla wszystkich tabel (tymczasowo)
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE offer_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE offer_statistics DISABLE ROW LEVEL SECURITY;
ALTER TABLE offer_status_history DISABLE ROW LEVEL SECURITY;

-- Dodaj przykładowe dane
INSERT INTO profiles (email, name, role, salesperson_id) VALUES
  ('lukasz@plexisystem.pl', 'Łukasz Sikorra', 'admin', 'LS'),
  ('dorota@plexisystem.pl', 'Dorota Będkowska', 'salesperson', 'DB');

-- Dodaj przykładowego klienta
INSERT INTO clients (nip, name, address, email, phone) VALUES
  ('1234567890', 'Firma Testowa Sp. z o.o.', 'ul. Przykładowa 123, 00-001 Warszawa', 'kontakt@test.pl', '123456789');
