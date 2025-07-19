import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';

export interface ShippingDocument {
  id: string;
  document_number: string;
  order_number: string;
  client_id?: string;
  client_name: string;
  client_address: string;
  client_nip: string;
  delivery_address: string;
  delivery_date: string;
  status: 'draft' | 'confirmed' | 'sent';
  net_total: number;
  vat_total: number;
  gross_total: number;
  notes?: string;
  items?: ShippingDocumentItem[];
  created_at?: string;
  updated_at?: string;
}

export interface ShippingDocumentItem {
  id: string;
  document_id: string;
  product_name: string;
  product_code: string;
  quantity: number;
  unit: string;
  price: number;
  vat: number;
  total: number;
  serial_numbers?: string[];
}

export function useShippingDocuments() {
  const [documents, setDocuments] = useState<ShippingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pobierz wszystkie dokumenty
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data: docs, error: docsError } = await supabase
        .from('shipping_documents')
        .select(`
          *,
          items:shipping_document_items(*)
        `)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;

      setDocuments(docs || []);
    } catch (err) {
      console.error('Error fetching shipping documents:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Utwórz nowy dokument
  const createDocument = async (documentData: Partial<ShippingDocument>) => {
    try {
      const { items, ...docData } = documentData;
      
      // Najpierw utwórz dokument
      const { data: newDoc, error: docError } = await supabase
        .from('shipping_documents')
        .insert([{
          ...docData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (docError) throw docError;

      // Następnie dodaj pozycje
      if (items && items.length > 0) {
        const itemsWithDocId = items.map(item => ({
          ...item,
          document_id: newDoc.id
        }));

        const { error: itemsError } = await supabase
          .from('shipping_document_items')
          .insert(itemsWithDocId);

        if (itemsError) throw itemsError;
      }

      await fetchDocuments(); // Odśwież listę
      return newDoc;
    } catch (err) {
      console.error('Error creating shipping document:', err);
      throw err;
    }
  };

  // Aktualizuj dokument
  const updateDocument = async (id: string, updates: Partial<ShippingDocument>) => {
    try {
      const { items, ...docUpdates } = updates;

      // Aktualizuj dokument
      const { error: docError } = await supabase
        .from('shipping_documents')
        .update(docUpdates)
        .eq('id', id);

      if (docError) throw docError;

      // Jeśli są pozycje do aktualizacji
      if (items) {
        // Usuń stare pozycje
        await supabase
          .from('shipping_document_items')
          .delete()
          .eq('document_id', id);

        // Dodaj nowe pozycje
        if (items.length > 0) {
          const itemsWithDocId = items.map(item => ({
            ...item,
            document_id: id
          }));

          const { error: itemsError } = await supabase
            .from('shipping_document_items')
            .insert(itemsWithDocId);

          if (itemsError) throw itemsError;
        }
      }

      await fetchDocuments(); // Odśwież listę
    } catch (err) {
      console.error('Error updating shipping document:', err);
      throw err;
    }
  };

  // Usuń dokument
  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shipping_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchDocuments(); // Odśwież listę
    } catch (err) {
      console.error('Error deleting shipping document:', err);
      throw err;
    }
  };

  // Generuj numer dokumentu
  const generateDocumentNumber = async (): Promise<string> => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Pobierz ostatni numer z tego miesiąca
    const { data, error } = await supabase
      .from('shipping_documents')
      .select('document_number')
      .like('document_number', `WZ/${year}/${month}/%`)
      .order('document_number', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error generating document number:', error);
      return `WZ/${year}/${month}/001`;
    }

    if (!data || data.length === 0) {
      return `WZ/${year}/${month}/001`;
    }

    // Wyciągnij numer i zwiększ o 1
    const lastNumber = data[0].document_number;
    const lastSequence = parseInt(lastNumber.split('/').pop() || '0');
    const newSequence = String(lastSequence + 1).padStart(3, '0');

    return `WZ/${year}/${month}/${newSequence}`;
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    generateDocumentNumber,
    refreshDocuments: fetchDocuments
  };
}