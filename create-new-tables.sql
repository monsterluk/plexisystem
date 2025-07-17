-- Dodatkowe tabele dla nowych funkcjonalności

-- Tabela do przechowywania umów
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  contract_number VARCHAR(50) UNIQUE NOT NULL,
  contract_data TEXT, -- Base64 encoded PDF
  status VARCHAR(50) DEFAULT 'draft', -- draft, signed, cancelled
  signed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela statusów zamówień
CREATE TABLE IF NOT EXISTS order_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL, -- accepted, contract_generated, payment_pending, payment_received, in_production, ready_for_shipping, shipped, delivered
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
  type VARCHAR(50) DEFAULT 'client_to_sales', -- client_to_sales, sales_to_client
  read_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela powiadomień
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- offer_accepted, new_message, payment_received, etc.
  related_id UUID, -- ID powiązanego obiektu (oferta, zamówienie, etc.)
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela automatyzacji email
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb, -- Lista zmiennych do podmienienia
  type VARCHAR(50) NOT NULL, -- offer_created, offer_accepted, contract_ready, etc.
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
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy dla lepszej wydajności
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

-- Dodaj przykładowe szablony email
INSERT INTO email_templates (name, subject, body, variables, type) VALUES
  ('Oferta utworzona', 'Nowa oferta {{offer_number}} od PlexiSystem', 
   'Szanowny Kliencie,\n\nPrzygotowaliśmy dla Państwa ofertę nr {{offer_number}}.\n\nLink do oferty: {{offer_link}}\n\nOferta ważna do: {{valid_until}}\n\nPozdrawiamy,\nZespół PlexiSystem', 
   '["offer_number", "offer_link", "valid_until"]'::jsonb, 
   'offer_created'),
  
  ('Oferta zaakceptowana', 'Dziękujemy za akceptację oferty {{offer_number}}', 
   'Szanowny Kliencie,\n\nDziękujemy za akceptację naszej oferty nr {{offer_number}}.\n\nW załączeniu przesyłamy umowę do podpisu.\n\nPo otrzymaniu podpisanej umowy rozpoczniemy realizację zamówienia.\n\nPozdrawiamy,\nZespół PlexiSystem', 
   '["offer_number", "client_name"]'::jsonb, 
   'offer_accepted'),
  
  ('Umowa gotowa', 'Umowa do oferty {{offer_number}} - do podpisu', 
   'Szanowny Kliencie,\n\nUmowa sprzedaży do oferty nr {{offer_number}} jest gotowa.\n\nProsimy o jej wydrukowanie, podpisanie i odesłanie na nasz adres lub skan na email.\n\nLink do pobrania: {{contract_link}}\n\nPozdrawiamy,\nZespół PlexiSystem', 
   '["offer_number", "contract_link", "client_name"]'::jsonb, 
   'contract_ready');

-- Widok dla łatwiejszego dostępu do statusów zamówień z pełnymi danymi
CREATE OR REPLACE VIEW order_tracking AS
SELECT 
  os.*,
  q.number as offer_number,
  q.total_net,
  q.total_net_after_discount,
  q.delivery_cost,
  c.name as client_name,
  c.email as client_email,
  c.phone as client_phone
FROM order_status os
JOIN quotations q ON os.offer_id = q.id
JOIN clients c ON q.client_id = c.id;

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
    SELECT 
      NEW.created_by,
      'Oferta zaakceptowana',
      'Oferta ' || NEW.number || ' została zaakceptowana przez klienta',
      'offer_accepted',
      NEW.id;
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
CREATE POLICY "Użytkownicy mogą czytać umowy" ON contracts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Użytkownicy mogą tworzyć umowy" ON contracts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Użytkownicy mogą aktualizować umowy" ON contracts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Polityki dla order_status
CREATE POLICY "Użytkownicy mogą czytać statusy" ON order_status
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Użytkownicy mogą tworzyć statusy" ON order_status
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Użytkownicy mogą aktualizować statusy" ON order_status
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Polityki dla notifications
CREATE POLICY "Użytkownicy widzą swoje powiadomienia" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System może tworzyć powiadomienia" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Użytkownicy mogą aktualizować swoje powiadomienia" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Polityki dla client_messages
CREATE POLICY "Wszyscy mogą czytać wiadomości" ON client_messages
  FOR ALL USING (true);
