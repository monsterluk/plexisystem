-- ====================================
-- SEKCJA 1: TABELE UŻYTKOWNIKÓW
-- ====================================

-- Tabela użytkowników
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT true,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indeksy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Tabela sesji użytkowników (opcjonalna, do śledzenia aktywności)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Tabela logów aktywności użytkowników
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indeksy dla logów
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_module ON user_activity_logs(module);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- ====================================
-- SEKCJA 2: TABELE KONTROLI JAKOŚCI
-- ====================================

-- Tabela dokumentów WZ
CREATE TABLE IF NOT EXISTS shipping_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_number VARCHAR(50) UNIQUE NOT NULL,
  order_number VARCHAR(50),
  client_id UUID,
  client_name VARCHAR(255) NOT NULL,
  client_address TEXT,
  client_nip VARCHAR(20),
  delivery_address TEXT,
  delivery_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'sent')),
  net_total DECIMAL(10,2),
  vat_total DECIMAL(10,2),
  gross_total DECIMAL(10,2),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela pozycji dokumentów WZ
CREATE TABLE IF NOT EXISTS shipping_document_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES shipping_documents(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_code VARCHAR(50),
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  vat INTEGER DEFAULT 23,
  total DECIMAL(10,2) NOT NULL,
  serial_numbers TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela kontroli jakości
CREATE TABLE IF NOT EXISTS quality_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50),
  product_name VARCHAR(255) NOT NULL,
  product_code VARCHAR(50),
  batch_number VARCHAR(50),
  quantity INTEGER DEFAULT 1,
  inspector VARCHAR(100) NOT NULL,
  check_date DATE NOT NULL,
  check_time TIME,
  status VARCHAR(20) NOT NULL CHECK (status IN ('passed', 'failed', 'conditional')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela pomiarów
CREATE TABLE IF NOT EXISTS quality_measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quality_check_id UUID REFERENCES quality_checks(id) ON DELETE CASCADE,
  parameter VARCHAR(100) NOT NULL,
  nominal DECIMAL(10,3) NOT NULL,
  tolerance DECIMAL(10,3) NOT NULL,
  measured DECIMAL(10,3) NOT NULL,
  in_tolerance BOOLEAN GENERATED ALWAYS AS (ABS(measured - nominal) <= tolerance) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela defektów
CREATE TABLE IF NOT EXISTS quality_defects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quality_check_id UUID REFERENCES quality_checks(id) ON DELETE CASCADE,
  defect_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
  description TEXT NOT NULL,
  action_taken TEXT,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================
-- SEKCJA 3: INDEKSY
-- ====================================

-- Indeksy dla wydajności
CREATE INDEX IF NOT EXISTS idx_shipping_documents_status ON shipping_documents(status);
CREATE INDEX IF NOT EXISTS idx_shipping_documents_client ON shipping_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_shipping_documents_date ON shipping_documents(delivery_date);
CREATE INDEX IF NOT EXISTS idx_quality_checks_status ON quality_checks(status);
CREATE INDEX IF NOT EXISTS idx_quality_checks_date ON quality_checks(check_date);
CREATE INDEX IF NOT EXISTS idx_quality_checks_order ON quality_checks(order_number);

-- ====================================
-- SEKCJA 4: FUNKCJE I TRIGGERY
-- ====================================

-- Funkcja do aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggery dla aktualizacji updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipping_documents_updated_at ON shipping_documents;
CREATE TRIGGER update_shipping_documents_updated_at BEFORE UPDATE ON shipping_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quality_checks_updated_at ON quality_checks;
CREATE TRIGGER update_quality_checks_updated_at BEFORE UPDATE ON quality_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- SEKCJA 5: ROW LEVEL SECURITY (RLS)
-- ====================================

-- Włącz RLS dla tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_document_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_defects ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla administratorów (tabela users)
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update users" ON users
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete users" ON users
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Polityki dla zwykłych użytkowników
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid() AND role = (SELECT role FROM users WHERE id = auth.uid()));

-- Polityki dla dokumentów WZ i kontroli jakości
CREATE POLICY "Users can view all shipping documents" ON shipping_documents
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create shipping documents" ON shipping_documents
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update shipping documents" ON shipping_documents
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete shipping documents" ON shipping_documents
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Podobne polityki dla pozostałych tabel
CREATE POLICY "Users can manage shipping items" ON shipping_document_items
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage quality checks" ON quality_checks
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage measurements" ON quality_measurements
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage defects" ON quality_defects
    FOR ALL USING (auth.uid() IS NOT NULL);

-- ====================================
-- SEKCJA 6: DANE POCZĄTKOWE
-- ====================================

-- Dodaj administratora systemu (jeśli nie istnieje)
INSERT INTO users (email, full_name, role, permissions) VALUES
    ('admin@plexisystem.pl', 'Administrator Systemu', 'admin', 
     '[
        {"module": "dashboard", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true},
        {"module": "offers", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true},
        {"module": "clients", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true},
        {"module": "products", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true},
        {"module": "production", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true},
        {"module": "quality_control", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true},
        {"module": "reports", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true},
        {"module": "automation", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true},
        {"module": "users", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true},
        {"module": "settings", "can_view": true, "can_create": true, "can_edit": true, "can_delete": true}
     ]'::jsonb)
ON CONFLICT (email) DO NOTHING;