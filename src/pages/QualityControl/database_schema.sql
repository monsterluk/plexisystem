-- Tabela dokumentów WZ
CREATE TABLE shipping_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_number VARCHAR(50) UNIQUE NOT NULL,
  order_number VARCHAR(50),
  client_id UUID REFERENCES clients(id),
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
CREATE TABLE shipping_document_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
CREATE TABLE quality_checks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
CREATE TABLE quality_measurements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quality_check_id UUID REFERENCES quality_checks(id) ON DELETE CASCADE,
  parameter VARCHAR(100) NOT NULL,
  nominal DECIMAL(10,3) NOT NULL,
  tolerance DECIMAL(10,3) NOT NULL,
  measured DECIMAL(10,3) NOT NULL,
  in_tolerance BOOLEAN GENERATED ALWAYS AS (ABS(measured - nominal) <= tolerance) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela defektów
CREATE TABLE quality_defects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quality_check_id UUID REFERENCES quality_checks(id) ON DELETE CASCADE,
  defect_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
  description TEXT NOT NULL,
  action_taken TEXT,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indeksy dla wydajności
CREATE INDEX idx_shipping_documents_status ON shipping_documents(status);
CREATE INDEX idx_shipping_documents_client ON shipping_documents(client_id);
CREATE INDEX idx_shipping_documents_date ON shipping_documents(delivery_date);
CREATE INDEX idx_quality_checks_status ON quality_checks(status);
CREATE INDEX idx_quality_checks_date ON quality_checks(check_date);
CREATE INDEX idx_quality_checks_order ON quality_checks(order_number);

-- Trigger do aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shipping_documents_updated_at BEFORE UPDATE ON shipping_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_checks_updated_at BEFORE UPDATE ON quality_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE shipping_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_document_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_defects ENABLE ROW LEVEL SECURITY;

-- Polityki RLS - wszyscy zalogowani użytkownicy mogą wszystko
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