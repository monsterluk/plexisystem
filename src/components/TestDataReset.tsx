import React, { useState } from 'react';
import { 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  Database,
  Check,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ResetOption {
  id: string;
  label: string;
  description: string;
  tables: string[];
  danger: boolean;
}

const RESET_OPTIONS: ResetOption[] = [
  {
    id: 'shipping_docs',
    label: 'Dokumenty WZ',
    description: 'Usuń wszystkie dokumenty wydania i ich pozycje',
    tables: ['shipping_document_items', 'shipping_documents'],
    danger: true
  },
  {
    id: 'quality_checks',
    label: 'Kontrole jakości',
    description: 'Usuń wszystkie protokoły kontroli, pomiary i defekty',
    tables: ['quality_defects', 'quality_measurements', 'quality_checks'],
    danger: true
  },
  {
    id: 'offers',
    label: 'Oferty',
    description: 'Usuń wszystkie oferty i ich pozycje',
    tables: ['offer_items', 'offers'],
    danger: true
  },
  {
    id: 'clients',
    label: 'Klienci',
    description: 'Usuń wszystkich klientów (oprócz przykładowych)',
    tables: ['clients'],
    danger: true
  },
  {
    id: 'products',
    label: 'Produkty',
    description: 'Usuń wszystkie produkty (oprócz przykładowych)',
    tables: ['products'],
    danger: true
  },
  {
    id: 'activity_logs',
    label: 'Logi aktywności',
    description: 'Wyczyść historię aktywności użytkowników',
    tables: ['user_activity_logs'],
    danger: false
  },
  {
    id: 'sessions',
    label: 'Sesje użytkowników',
    description: 'Wyczyść historię sesji',
    tables: ['user_sessions'],
    danger: false
  }
];

export const TestDataReset: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [results, setResults] = useState<{ table: string; success: boolean; error?: string }[]>([]);

  const handleToggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleReset = async () => {
    if (confirmText !== 'RESETUJ' || selectedOptions.length === 0) return;

    setIsResetting(true);
    setResults([]);

    const tablesToReset = selectedOptions
      .flatMap(optionId => {
        const option = RESET_OPTIONS.find(o => o.id === optionId);
        return option ? option.tables : [];
      })
      .filter((table, index, self) => self.indexOf(table) === index); // Unikalne tabele

    const resetResults = [];

    for (const table of tablesToReset) {
      try {
        // Specjalne przypadki dla niektórych tabel
        let query = supabase.from(table).delete();

        // Zachowaj przykładowe dane
        if (table === 'clients') {
          query = query.not('name', 'in', '("Firma ABC Sp. z o.o.","XYZ S.A.","Przykładowy Klient")');
        } else if (table === 'products') {
          query = query.not('name', 'in', '("Pleksi przezroczysta 3mm","Pleksi mleczna 5mm","Pleksi czarna 10mm")');
        } else {
          // Dla innych tabel usuń wszystko
          query = query.neq('id', '00000000-0000-0000-0000-000000000000'); // Usuń wszystkie rekordy
        }

        const { error } = await query;

        resetResults.push({
          table,
          success: !error,
          error: error?.message
        });
      } catch (err: any) {
        resetResults.push({
          table,
          success: false,
          error: err.message
        });
      }
    }

    setResults(resetResults);
    setIsResetting(false);
    
    // Po udanym resecie odśwież stronę
    const allSuccess = resetResults.every(r => r.success);
    if (allSuccess) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const selectedCount = selectedOptions.length;
  const hasDangerousOptions = selectedOptions.some(id => 
    RESET_OPTIONS.find(o => o.id === id)?.danger
  );

  return (
    <>
      {/* Przycisk w ustawieniach */}
      <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-orange-500" />
              Zarządzanie danymi testowymi
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Resetuj wybrane dane testowe w systemie
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition"
          >
            <Trash2 className="w-4 h-4" />
            Resetuj dane
          </button>
        </div>
      </div>

      {/* Modal resetowania */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-lg border border-zinc-700 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Nagłówek */}
            <div className="p-6 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  Resetowanie danych testowych
                </h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedOptions([]);
                    setConfirmText('');
                    setResults([]);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Zawartość */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Ostrzeżenie */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 text-sm">
                  <strong>Uwaga!</strong> Ta operacja nieodwracalnie usunie wybrane dane z systemu.
                  Upewnij się, że masz kopię zapasową ważnych danych.
                </p>
              </div>

              {/* Opcje resetowania */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300 uppercase">
                  Wybierz dane do zresetowania:
                </h3>
                
                {RESET_OPTIONS.map(option => (
                  <label
                    key={option.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      selectedOptions.includes(option.id)
                        ? 'bg-zinc-700 border-orange-500'
                        : 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleToggleOption(option.id)}
                      className="mt-1 w-4 h-4 text-orange-500 bg-zinc-900 border-zinc-700 rounded focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{option.label}</span>
                        {option.danger && (
                          <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
                            Niebezpieczne
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tabele: {option.tables.join(', ')}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Potwierdzenie */}
              {selectedCount > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Aby potwierdzić operację, wpisz <strong className="text-white">RESETUJ</strong>:
                  </p>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Wpisz RESETUJ"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              {/* Wyniki */}
              {results.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-300 uppercase">Wyniki operacji:</h3>
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded ${
                        result.success ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}
                    >
                      <span className="text-sm text-gray-300">{result.table}</span>
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">Zresetowano</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-400">{result.error || 'Błąd'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {results.every(r => r.success) && (
                    <p className="text-sm text-green-400 text-center mt-4">
                      Wszystkie dane zostały zresetowane. Strona zostanie odświeżona...
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Stopka */}
            <div className="p-6 border-t border-zinc-700 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Wybrano: {selectedCount} {selectedCount === 1 ? 'opcję' : 'opcji'}
                {hasDangerousOptions && (
                  <span className="text-red-400 ml-2">(zawiera niebezpieczne operacje)</span>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedOptions([]);
                    setConfirmText('');
                    setResults([]);
                  }}
                  className="px-4 py-2 border border-zinc-700 text-gray-300 rounded-lg hover:bg-zinc-700 transition"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleReset}
                  disabled={
                    isResetting || 
                    selectedCount === 0 || 
                    confirmText !== 'RESETUJ' ||
                    results.length > 0
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    confirmText === 'RESETUJ' && selectedCount > 0 && !isResetting && results.length === 0
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-zinc-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isResetting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Resetowanie...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Resetuj wybrane dane
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};