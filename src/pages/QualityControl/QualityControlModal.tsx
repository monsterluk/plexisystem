import React, { useState } from 'react';
import { X, Search, Save, Camera, AlertTriangle, CheckCircle, Plus, Minus } from 'lucide-react';

interface QualityControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (check: any) => void;
}

interface Measurement {
  id: string;
  parameter: string;
  nominal: number;
  tolerance: number;
  measured: number;
  inTolerance?: boolean;
}

interface Defect {
  id: string;
  type: string;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  action: string;
  photos?: string[];
}

export function QualityControlModal({ isOpen, onClose, onSave }: QualityControlModalProps) {
  const [formData, setFormData] = useState({
    orderNumber: '',
    productName: '',
    productCode: '',
    batchNumber: '',
    quantity: 1,
    inspector: '',
    checkDate: new Date().toISOString().split('T')[0],
    checkTime: new Date().toTimeString().split(' ')[0].substring(0, 5)
  });

  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: '1', parameter: 'Szerokość', nominal: 0, tolerance: 0, measured: 0 },
    { id: '2', parameter: 'Wysokość', nominal: 0, tolerance: 0, measured: 0 },
    { id: '3', parameter: 'Grubość', nominal: 0, tolerance: 0, measured: 0 }
  ]);

  const [defects, setDefects] = useState<Defect[]>([]);
  const [showDefectForm, setShowDefectForm] = useState(false);
  const [newDefect, setNewDefect] = useState<Partial<Defect>>({
    type: '',
    severity: 'minor',
    description: '',
    action: ''
  });

  const [overallStatus, setOverallStatus] = useState<'passed' | 'failed' | 'conditional'>('passed');
  const [notes, setNotes] = useState('');

  // Przykładowe dane
  const defectTypes = [
    'Wymiarowa',
    'Powierzchni',
    'Koloru',
    'Montażu',
    'Elektryczna',
    'Mechaniczna',
    'Estetyczna',
    'Inna'
  ];

  const inspectors = [
    'Jan Kowalski',
    'Anna Nowak',
    'Piotr Wiśniewski',
    'Maria Zielińska'
  ];

  const updateMeasurement = (id: string, field: keyof Measurement, value: number) => {
    setMeasurements(measurements.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        // Automatyczne sprawdzanie tolerancji
        if (field === 'measured' || field === 'nominal' || field === 'tolerance') {
          const diff = Math.abs(updated.measured - updated.nominal);
          updated.inTolerance = diff <= updated.tolerance;
        }
        return updated;
      }
      return m;
    }));
  };

  const addMeasurement = () => {
    const newMeasurement: Measurement = {
      id: Date.now().toString(),
      parameter: '',
      nominal: 0,
      tolerance: 0,
      measured: 0,
      inTolerance: true
    };
    setMeasurements([...measurements, newMeasurement]);
  };

  const removeMeasurement = (id: string) => {
    if (measurements.length > 1) {
      setMeasurements(measurements.filter(m => m.id !== id));
    }
  };

  const addDefect = () => {
    if (newDefect.type && newDefect.description) {
      const defect: Defect = {
        id: Date.now().toString(),
        type: newDefect.type!,
        severity: newDefect.severity as 'minor' | 'major' | 'critical',
        description: newDefect.description!,
        action: newDefect.action || '',
        photos: []
      };
      setDefects([...defects, defect]);
      setNewDefect({ type: '', severity: 'minor', description: '', action: '' });
      setShowDefectForm(false);
    }
  };

  const removeDefect = (id: string) => {
    setDefects(defects.filter(d => d.id !== id));
  };

  const calculateOverallStatus = () => {
    const hasFailedMeasurements = measurements.some(m => m.inTolerance === false);
    const hasCriticalDefects = defects.some(d => d.severity === 'critical');
    const hasMajorDefects = defects.some(d => d.severity === 'major');

    if (hasCriticalDefects || hasFailedMeasurements) {
      return 'failed';
    } else if (hasMajorDefects) {
      return 'conditional';
    }
    return 'passed';
  };

  const handleSave = () => {
    const status = calculateOverallStatus();
    const check = {
      ...formData,
      measurements,
      defects,
      status,
      notes,
      createdAt: new Date().toISOString()
    };
    onSave(check);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Kontrola Jakości</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Informacje podstawowe */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Dane kontroli</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Numer zamówienia
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="np. ZAM/2024/07/001"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nazwa produktu
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="np. Kaseton LED 100x50cm"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Kod produktu
                  </label>
                  <input
                    type="text"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    placeholder="np. KAS-LED-100-50"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Numer partii
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    placeholder="np. 2024-07-001"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ilość kontrolowana
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Kontroler
                  </label>
                  <select
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">-- Wybierz kontrolera --</option>
                    {inspectors.map(inspector => (
                      <option key={inspector} value={inspector}>{inspector}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Data kontroli
                  </label>
                  <input
                    type="date"
                    value={formData.checkDate}
                    onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Godzina kontroli
                  </label>
                  <input
                    type="time"
                    value={formData.checkTime}
                    onChange={(e) => setFormData({ ...formData, checkTime: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Pomiary */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-white">Pomiary</h3>
                <button
                  onClick={addMeasurement}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj pomiar
                </button>
              </div>
              
              <div className="space-y-3">
                {measurements.map((measurement, index) => (
                  <div key={measurement.id} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Parametr
                        </label>
                        <input
                          type="text"
                          value={measurement.parameter}
                          onChange={(e) => setMeasurements(measurements.map(m => 
                            m.id === measurement.id ? { ...m, parameter: e.target.value } : m
                          ))}
                          placeholder="np. Szerokość"
                          className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Wartość nominalna
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurement.nominal}
                          onChange={(e) => updateMeasurement(measurement.id, 'nominal', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Tolerancja (±)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurement.tolerance}
                          onChange={(e) => updateMeasurement(measurement.id, 'tolerance', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Wartość zmierzona
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurement.measured}
                          onChange={(e) => updateMeasurement(measurement.id, 'measured', parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 py-1.5 border rounded text-sm ${
                            measurement.inTolerance === false
                              ? 'bg-red-900/30 border-red-600 text-red-200'
                              : 'bg-gray-700 border-gray-600 text-white'
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          measurement.inTolerance === false
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {measurement.inTolerance === false ? (
                            <>
                              <X className="w-3 h-3" />
                              Poza tolerancją
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              W tolerancji
                            </>
                          )}
                        </div>
                        {measurements.length > 1 && (
                          <button
                            onClick={() => removeMeasurement(measurement.id)}
                            className="p-1.5 hover:bg-gray-700 rounded transition-colors text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Niezgodności */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-white">Niezgodności</h3>
                <button
                  onClick={() => setShowDefectForm(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all text-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Zgłoś niezgodność
                </button>
              </div>

              {/* Formularz dodawania niezgodności */}
              {showDefectForm && (
                <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Typ niezgodności
                      </label>
                      <select
                        value={newDefect.type}
                        onChange={(e) => setNewDefect({ ...newDefect, type: e.target.value })}
                        className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                      >
                        <option value="">-- Wybierz typ --</option>
                        {defectTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Waga niezgodności
                      </label>
                      <select
                        value={newDefect.severity}
                        onChange={(e) => setNewDefect({ ...newDefect, severity: e.target.value as any })}
                        className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                      >
                        <option value="minor">Drobna</option>
                        <option value="major">Znacząca</option>
                        <option value="critical">Krytyczna</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Opis niezgodności
                    </label>
                    <textarea
                      value={newDefect.description}
                      onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                      rows={2}
                      className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                      placeholder="Opisz wykrytą niezgodność..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Podjęte działanie
                    </label>
                    <textarea
                      value={newDefect.action}
                      onChange={(e) => setNewDefect({ ...newDefect, action: e.target.value })}
                      rows={2}
                      className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                      placeholder="Opisz podjęte działanie..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowDefectForm(false);
                        setNewDefect({ type: '', severity: 'minor', description: '', action: '' });
                      }}
                      className="px-3 py-1.5 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-all"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={addDefect}
                      disabled={!newDefect.type || !newDefect.description}
                      className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
                    >
                      Dodaj niezgodność
                    </button>
                  </div>
                </div>
              )}

              {/* Lista niezgodności */}
              {defects.length > 0 ? (
                <div className="space-y-3">
                  {defects.map(defect => (
                    <div key={defect.id} className={`p-4 rounded-lg border ${
                      defect.severity === 'critical' 
                        ? 'bg-red-900/20 border-red-700' 
                        : defect.severity === 'major'
                        ? 'bg-yellow-900/20 border-yellow-700'
                        : 'bg-gray-700/30 border-gray-600'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            defect.severity === 'critical'
                              ? 'bg-red-500/20 text-red-400'
                              : defect.severity === 'major'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {defect.severity === 'critical' ? 'Krytyczna' :
                             defect.severity === 'major' ? 'Znacząca' : 'Drobna'}
                          </span>
                          <span className="text-sm font-medium text-white">{defect.type}</span>
                        </div>
                        <button
                          onClick={() => removeDefect(defect.id)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{defect.description}</p>
                      {defect.action && (
                        <p className="text-sm text-gray-400">
                          <span className="font-medium">Działanie:</span> {defect.action}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Brak zgłoszonych niezgodności</p>
                </div>
              )}
            </div>

            {/* Status końcowy */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status kontroli
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setOverallStatus('passed')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    overallStatus === 'passed'
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-sm font-medium">Zgodne</p>
                </button>
                <button
                  onClick={() => setOverallStatus('conditional')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    overallStatus === 'conditional'
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                      : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-sm font-medium">Warunkowe</p>
                </button>
                <button
                  onClick={() => setOverallStatus('failed')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    overallStatus === 'failed'
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <X className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-sm font-medium">Niezgodne</p>
                </button>
              </div>
            </div>

            {/* Uwagi */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Uwagi dodatkowe
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Dodatkowe informacje o kontroli..."
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            Anuluj
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {/* TODO: Implementacja zdjęć */}}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              <Camera className="w-4 h-4" />
              Dodaj zdjęcia
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.orderNumber || !formData.productName || !formData.inspector}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" />
              Zapisz protokół
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}