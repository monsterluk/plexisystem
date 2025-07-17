-- Kompletny skrypt do utworzenia wszystkich tabel PlexiSystem

-- Najpierw usuń istniejące tabele jeśli istnieją (opcjonalne)
-- DROP TABLE IF EXISTS quotation_items CASCADE;
-- DROP TABLE IF EXISTS quotations CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS materials CASCADE;
-- DROP TABLE IF EXISTS clients CASCADE;

-- Tabela materiałów
CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  density DECIMAL(10, 3),
  properties JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela produktów
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  material_id UUID REFERENCES materials(id),
  thickness DECIMAL(10, 2),
  base_price DECIMAL(10, 2),
  cutting_time DECIMAL(10, 2),
  max_width INTEGER,
  max_height INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela klientów
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nip VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(10),
  email VARCHAR(255),
  phone VARCHAR(50),
  contact_person VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela ofert
CREATE TABLE IF NOT EXISTS quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  salesperson_id VARCHAR(50),
  salesperson_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  discount DECIMAL(5, 2) DEFAULT 0,
  discount_value DECIMAL(10, 2) DEFAULT 0,
  delivery_cost DECIMAL(10, 2) DEFAULT 0,
  delivery_region VARCHAR(100),
  total_net DECIMAL(10, 2) DEFAULT 0,
  total_net_after_discount DECIMAL(10, 2) DEFAULT 0,
  comment TEXT,
  internal_note TEXT,
  share_token VARCHAR(255) UNIQUE,
  project_name VARCHAR(255),
  payment_terms VARCHAR(255),
  delivery_time VARCHAR(255),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela pozycji oferty
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255),
  material_name VARCHAR(255),
  thickness DECIMAL(10, 2),
  dimensions JSONB,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  cutting_time DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy
CREATE INDEX idx_quotations_client_id ON quotations(client_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_created_at ON quotations(created_at);
CREATE INDEX idx_quotation_items_quotation_id ON quotation_items(quotation_id);
CREATE INDEX idx_quotation_items_product_id ON quotation_items(product_id);
CREATE INDEX idx_clients_nip ON clients(nip);
CREATE INDEX idx_products_material_id ON products(material_id);

-- Funkcja do automatycznego generowania numeru oferty
CREATE OR REPLACE FUNCTION generate_quotation_number()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  current_month TEXT;
  last_number INTEGER;
  new_number TEXT;
BEGIN
  current_year := to_char(CURRENT_DATE, 'YYYY');
  current_month := to_char(CURRENT_DATE, 'MM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO last_number
  FROM quotations
  WHERE number LIKE 'OF/' || current_year || '/' || current_month || '/%';
  
  new_number := 'OF/' || current_year || '/' || current_month || '/' || LPAD(last_number::TEXT, 3, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do generowania tokenu udostępniania
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Trigger do automatycznego ustawiania numeru oferty
CREATE OR REPLACE FUNCTION set_quotation_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.number IS NULL THEN
    NEW.number := generate_quotation_number();
  END IF;
  IF NEW.share_token IS NULL THEN
    NEW.share_token := generate_share_token();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_quotation_number_trigger
BEFORE INSERT ON quotations
FOR EACH ROW
EXECUTE FUNCTION set_quotation_number();

-- Włącz Row Level Security
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

-- Polityki RLS (dla authenticated users)
CREATE POLICY "Users can read all materials" ON materials FOR SELECT USING (true);
CREATE POLICY "Users can read all products" ON products FOR SELECT USING (true);
CREATE POLICY "Users can read all clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Users can read all quotations" ON quotations FOR SELECT USING (true);
CREATE POLICY "Users can read all quotation_items" ON quotation_items FOR SELECT USING (true);

CREATE POLICY "Users can create materials" ON materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can create products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can create clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can create quotations" ON quotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can create quotation_items" ON quotation_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update materials" ON materials FOR UPDATE USING (true);
CREATE POLICY "Users can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Users can update clients" ON clients FOR UPDATE USING (true);
CREATE POLICY "Users can update quotations" ON quotations FOR UPDATE USING (true);
CREATE POLICY "Users can update quotation_items" ON quotation_items FOR UPDATE USING (true);

CREATE POLICY "Users can delete materials" ON materials FOR DELETE USING (true);
CREATE POLICY "Users can delete products" ON products FOR DELETE USING (true);
CREATE POLICY "Users can delete clients" ON clients FOR DELETE USING (true);
CREATE POLICY "Users can delete quotations" ON quotations FOR DELETE USING (true);
CREATE POLICY "Users can delete quotation_items" ON quotation_items FOR DELETE USING (true);

-- NOWE TABELE DLA ROZSZERZONYCH FUNKCJONALNOŚCI

-- Tabela do przechowywania umów
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  contract_number VARCHAR(50) UNIQUE NOT NULL,
  contract_data TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  signed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela statusów zamówień
CREATE TABLE IF NOT EXISTS order_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  status_history JSONB DEFAULT '[]'::jsonb,
  tracking_number VARCHAR(100),
  estimated_delivery DATE,
  production_notes TEXT,
  invoice_number VARCHAR(50),
  contract_number VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela wiadomości od klientów
CREATE TABLE IF NOT EXISTS client_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'client_to_sales',
  read_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela powiadomień
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  related_id UUID,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela automatyzacji email
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  type VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela logów email
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT,
  template_id UUID REFERENCES email_templates(id),
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy dla nowych tabel
CREATE INDEX idx_order_status_offer_id ON order_status(offer_id);
CREATE INDEX idx_order_status_status ON order_status(status);
CREATE INDEX idx_client_messages_offer_id ON client_messages(offer_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- Triggery do aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_status_updated_at BEFORE UPDATE ON order_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Funkcja do automatycznego tworzenia statusu zamówienia po akceptacji oferty
CREATE OR REPLACE FUNCTION create_order_status_on_accept()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    INSERT INTO order_status (offer_id, status, status_history)
    VALUES (
      NEW.id, 
      'accepted',
      jsonb_build_array(
        jsonb_build_object(
          'status', 'accepted',
          'date', NOW(),
          'comment', 'Oferta została zaakceptowana przez klienta'
        )
      )
    );
    
    -- Dodaj powiadomienie
    INSERT INTO notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.created_by,
      'Oferta zaakceptowana',
      'Oferta ' || NEW.number || ' została zaakceptowana przez klienta',
      'offer_accepted',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_order_status_trigger 
  AFTER UPDATE ON quotations
  FOR EACH ROW 
  EXECUTE FUNCTION create_order_status_on_accept();

-- Polityki RLS dla nowych tabel
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Polityki dla contracts
CREATE POLICY "Users can read contracts" ON contracts
  FOR SELECT USING (true);

CREATE POLICY "Users can create contracts" ON contracts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update contracts" ON contracts
  FOR UPDATE USING (true);

-- Polityki dla order_status
CREATE POLICY "Users can read order_status" ON order_status
  FOR SELECT USING (true);

CREATE POLICY "Users can create order_status" ON order_status
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update order_status" ON order_status
  FOR UPDATE USING (true);

-- Polityki dla notifications
CREATE POLICY "Users can read notifications" ON notifications
  FOR SELECT USING (true);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update notifications" ON notifications
  FOR UPDATE USING (true);

-- Polityki dla client_messages
CREATE POLICY "All can use client_messages" ON client_messages
  FOR ALL USING (true);

-- Polityki dla email_templates
CREATE POLICY "Users can read email_templates" ON email_templates
  FOR SELECT USING (true);

CREATE POLICY "Users can manage email_templates" ON email_templates
  FOR ALL USING (true);

-- Polityki dla email_logs
CREATE POLICY "Users can read email_logs" ON email_logs
  FOR SELECT USING (true);

CREATE POLICY "Users can create email_logs" ON email_logs
  FOR INSERT WITH CHECK (true);

-- Przykładowe dane początkowe

-- Materiały
INSERT INTO materials (name, type, density, properties) VALUES
  ('Plexi Transparentne', 'plexi', 1.19, '{"transparency": "high", "uv_resistant": false}'),
  ('Plexi Białe', 'plexi', 1.19, '{"transparency": "low", "color": "white"}'),
  ('Plexi Czarne', 'plexi', 1.19, '{"transparency": "low", "color": "black"}'),
  ('Dibond Biały', 'dibond', 1.5, '{"core": "PE", "surface": "aluminum", "color": "white"}'),
  ('Dibond Srebrny', 'dibond', 1.5, '{"core": "PE", "surface": "aluminum", "color": "silver"}'),
  ('PCV Spienione', 'pcv', 0.55, '{"type": "foam", "color": "white"}')
ON CONFLICT DO NOTHING;

-- Przykładowe szablony email
INSERT INTO email_templates (name, subject, body, variables, type) VALUES
  ('Oferta utworzona', 'Nowa oferta {{offer_number}} od PlexiSystem', 
   'Szanowny Kliencie,

Przygotowaliśmy dla Państwa ofertę nr {{offer_number}}.

Link do oferty: {{offer_link}}

Oferta ważna do: {{valid_until}}

Pozdrawiamy,
Zespół PlexiSystem', 
   '["offer_number", "offer_link", "valid_until"]'::jsonb, 
   'offer_created'),
  
  ('Oferta zaakceptowana', 'Dziękujemy za akceptację oferty {{offer_number}}', 
   'Szanowny Kliencie,

Dziękujemy za akceptację naszej oferty nr {{offer_number}}.

W załączeniu przesyłamy umowę do podpisu.

Po otrzymaniu podpisanej umowy rozpoczniemy realizację zamówienia.

Pozdrawiamy,
Zespół PlexiSystem', 
   '["offer_number", "client_name"]'::jsonb, 
   'offer_accepted'),
  
  ('Umowa gotowa', 'Umowa do oferty {{offer_number}} - do podpisu', 
   'Szanowny Kliencie,

Umowa sprzedaży do oferty nr {{offer_number}} jest gotowa.

Prosimy o jej wydrukowanie, podpisanie i odesłanie na nasz adres lub skan na email.

Link do pobrania: {{contract_link}}

Pozdrawiamy,
Zespół PlexiSystem', 
   '["offer_number", "contract_link", "client_name"]'::jsonb, 
   'contract_ready')
ON CONFLICT DO NOTHING;