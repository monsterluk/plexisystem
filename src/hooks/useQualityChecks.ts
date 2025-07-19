import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';

export interface QualityCheck {
  id: string;
  order_number: string;
  product_name: string;
  product_code?: string;
  batch_number?: string;
  quantity: number;
  inspector: string;
  check_date: string;
  check_time?: string;
  status: 'passed' | 'failed' | 'conditional';
  notes?: string;
  measurements?: QualityMeasurement[];
  defects?: QualityDefect[];
  created_at?: string;
  updated_at?: string;
}

export interface QualityMeasurement {
  id: string;
  quality_check_id: string;
  parameter: string;
  nominal: number;
  tolerance: number;
  measured: number;
  in_tolerance?: boolean;
}

export interface QualityDefect {
  id: string;
  quality_check_id: string;
  defect_type: string;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  action_taken?: string;
  photos?: string[];
}

export function useQualityChecks() {
  const [checks, setChecks] = useState<QualityCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pobierz wszystkie kontrole
  const fetchChecks = async () => {
    try {
      setLoading(true);
      const { data: checksData, error: checksError } = await supabase
        .from('quality_checks')
        .select(`
          *,
          measurements:quality_measurements(*),
          defects:quality_defects(*)
        `)
        .order('check_date', { ascending: false });

      if (checksError) throw checksError;

      setChecks(checksData || []);
    } catch (err) {
      console.error('Error fetching quality checks:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Utwórz nową kontrolę
  const createCheck = async (checkData: Partial<QualityCheck>) => {
    try {
      const { measurements, defects, ...mainData } = checkData;
      
      // Najpierw utwórz główny rekord kontroli
      const { data: newCheck, error: checkError } = await supabase
        .from('quality_checks')
        .insert([{
          ...mainData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (checkError) throw checkError;

      // Dodaj pomiary
      if (measurements && measurements.length > 0) {
        const measurementsWithCheckId = measurements.map(m => ({
          ...m,
          quality_check_id: newCheck.id
        }));

        const { error: measurementsError } = await supabase
          .from('quality_measurements')
          .insert(measurementsWithCheckId);

        if (measurementsError) throw measurementsError;
      }

      // Dodaj defekty
      if (defects && defects.length > 0) {
        const defectsWithCheckId = defects.map(d => ({
          ...d,
          quality_check_id: newCheck.id
        }));

        const { error: defectsError } = await supabase
          .from('quality_defects')
          .insert(defectsWithCheckId);

        if (defectsError) throw defectsError;
      }

      await fetchChecks(); // Odśwież listę
      return newCheck;
    } catch (err) {
      console.error('Error creating quality check:', err);
      throw err;
    }
  };

  // Aktualizuj kontrolę
  const updateCheck = async (id: string, updates: Partial<QualityCheck>) => {
    try {
      const { measurements, defects, ...mainUpdates } = updates;

      // Aktualizuj główny rekord
      const { error: checkError } = await supabase
        .from('quality_checks')
        .update(mainUpdates)
        .eq('id', id);

      if (checkError) throw checkError;

      // Aktualizuj pomiary
      if (measurements) {
        // Usuń stare pomiary
        await supabase
          .from('quality_measurements')
          .delete()
          .eq('quality_check_id', id);

        // Dodaj nowe pomiary
        if (measurements.length > 0) {
          const measurementsWithCheckId = measurements.map(m => ({
            ...m,
            quality_check_id: id
          }));

          const { error: measurementsError } = await supabase
            .from('quality_measurements')
            .insert(measurementsWithCheckId);

          if (measurementsError) throw measurementsError;
        }
      }

      // Aktualizuj defekty
      if (defects) {
        // Usuń stare defekty
        await supabase
          .from('quality_defects')
          .delete()
          .eq('quality_check_id', id);

        // Dodaj nowe defekty
        if (defects.length > 0) {
          const defectsWithCheckId = defects.map(d => ({
            ...d,
            quality_check_id: id
          }));

          const { error: defectsError } = await supabase
            .from('quality_defects')
            .insert(defectsWithCheckId);

          if (defectsError) throw defectsError;
        }
      }

      await fetchChecks(); // Odśwież listę
    } catch (err) {
      console.error('Error updating quality check:', err);
      throw err;
    }
  };

  // Usuń kontrolę
  const deleteCheck = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quality_checks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchChecks(); // Odśwież listę
    } catch (err) {
      console.error('Error deleting quality check:', err);
      throw err;
    }
  };

  // Statystyki
  const getStatistics = async (dateFrom?: string, dateTo?: string) => {
    try {
      let query = supabase
        .from('quality_checks')
        .select('status');

      if (dateFrom) {
        query = query.gte('check_date', dateFrom);
      }
      if (dateTo) {
        query = query.lte('check_date', dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      const total = data?.length || 0;
      const passed = data?.filter(c => c.status === 'passed').length || 0;
      const conditional = data?.filter(c => c.status === 'conditional').length || 0;
      const failed = data?.filter(c => c.status === 'failed').length || 0;

      return {
        total,
        passed,
        conditional,
        failed,
        passedPercentage: total > 0 ? (passed / total) * 100 : 0,
        conditionalPercentage: total > 0 ? (conditional / total) * 100 : 0,
        failedPercentage: total > 0 ? (failed / total) * 100 : 0
      };
    } catch (err) {
      console.error('Error getting statistics:', err);
      throw err;
    }
  };

  // Pobierz defekty dla raportów
  const getDefectStatistics = async (dateFrom?: string, dateTo?: string) => {
    try {
      let query = supabase
        .from('quality_defects')
        .select(`
          *,
          quality_checks!inner(check_date)
        `);

      if (dateFrom || dateTo) {
        query = query.filter('quality_checks.check_date', 'gte', dateFrom || '1900-01-01')
                     .filter('quality_checks.check_date', 'lte', dateTo || '2100-12-31');
      }

      const { data, error } = await query;

      if (error) throw error;

      // Grupuj defekty według typu
      const defectCounts: Record<string, number> = {};
      data?.forEach(defect => {
        defectCounts[defect.defect_type] = (defectCounts[defect.defect_type] || 0) + 1;
      });

      return defectCounts;
    } catch (err) {
      console.error('Error getting defect statistics:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchChecks();
  }, []);

  return {
    checks,
    loading,
    error,
    createCheck,
    updateCheck,
    deleteCheck,
    getStatistics,
    getDefectStatistics,
    refreshChecks: fetchChecks
  };
}