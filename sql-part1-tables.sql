-- CZĘŚĆ 1: PODSTAWOWE TABELE
-- Wykonaj ten skrypt w Supabase SQL Editor

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