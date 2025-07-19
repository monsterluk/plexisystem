// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// DEBUGGING
console.log('🔍 Supabase konfiguracja:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'BRAK');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co') {
  console.error('❌ Błąd konfiguracji Supabase!');
  console.error('Sprawdź plik .env i upewnij się, że VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY są ustawione.');
  throw new Error('Brakuje konfiguracji Supabase!');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Typy dla tabel
export interface DbClient {
  id?: number;
  nip: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  regon?: string;
  wojewodztwo?: string;
  powiat?: string;
  gmina?: string;
  created_at?: string;
}

export interface DbOffer {
  id?: number;
  offer_number: string;
  share_token: string;
  client_id: number;
  salesperson_id: string;
  salesperson_name: string;
  project_name?: string;
  status: string;
  total_net: number;
  discount: number;
  discount_value: number;
  total_net_after_discount: number;
  delivery_region: string;
  delivery_cost: number;
  terms_delivery_time: string;
  terms_delivery_method: string;
  terms_payment: string;
  terms_warranty: string;
  terms_validity: string;
  valid_until: string;
  comment?: string;
  internal_notes?: string;
  created_at?: string;
  updated_at?: string;
  version: number;
}

export interface DbOfferItem {
  id?: number;
  offer_id: number;
  product: string;
  product_name: string;
  expositor_type?: string;
  material: string;
  material_name: string;
  thickness: number;
  width: number;
  height: number;
  depth: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  surface: number;
  weight: number;
  options: any;
  calculations: any;
}