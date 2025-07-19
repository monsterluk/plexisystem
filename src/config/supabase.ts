import { createClient } from '@supabase/supabase-js';

// Te wartości powinny być w zmiennych środowiskowych
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typy dla bazy danych
export type Database = {
  public: {
    Tables: {
      shipping_documents: {
        Row: {
          id: string;
          document_number: string;
          order_number?: string;
          client_id?: string;
          client_name: string;
          client_address?: string;
          client_nip?: string;
          delivery_address?: string;
          delivery_date: string;
          status: 'draft' | 'confirmed' | 'sent';
          net_total?: number;
          vat_total?: number;
          gross_total?: number;
          notes?: string;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['shipping_documents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['shipping_documents']['Insert']>;
      };
      shipping_document_items: {
        Row: {
          id: string;
          document_id: string;
          product_name: string;
          product_code?: string;
          quantity: number;
          unit: string;
          price: number;
          vat: number;
          total: number;
          serial_numbers?: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['shipping_document_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['shipping_document_items']['Insert']>;
      };
      quality_checks: {
        Row: {
          id: string;
          order_number?: string;
          product_name: string;
          product_code?: string;
          batch_number?: string;
          quantity: number;
          inspector: string;
          check_date: string;
          check_time?: string;
          status: 'passed' | 'failed' | 'conditional';
          notes?: string;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quality_checks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['quality_checks']['Insert']>;
      };
      quality_measurements: {
        Row: {
          id: string;
          quality_check_id: string;
          parameter: string;
          nominal: number;
          tolerance: number;
          measured: number;
          in_tolerance: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quality_measurements']['Row'], 'id' | 'created_at' | 'in_tolerance'>;
        Update: Partial<Database['public']['Tables']['quality_measurements']['Insert']>;
      };
      quality_defects: {
        Row: {
          id: string;
          quality_check_id: string;
          defect_type: string;
          severity: 'minor' | 'major' | 'critical';
          description: string;
          action_taken?: string;
          photos?: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quality_defects']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['quality_defects']['Insert']>;
      };
    };
  };
};