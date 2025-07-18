// @ts-nocheck
import React, { useState } from 'react';
import { Plus, Trash2, Package, Settings, Calculator } from 'lucide-react';
import { sheetOptimizer } from '@/services/optimization/sheetOptimizer';
import { CuttingVisualization } from './CuttingVisualization';

interface SheetOptimizerFormProps {
  onOptimize?: (plan: any) => void;
}

export const SheetOptimizerForm: React.FC<SheetOptimizerFormProps> = ({ onOptimize }) => {
  const [rectangles, setRectangles] = useState([
    { id: 'R1', width: 600, height: 400, rotatable: true },
    { id: 'R2', width: 300, height: 200, rotatable: true },
  ]);
  
  const [sheets, setSheets] = useState([
    { id: 'S1', width: 2000, height: 1000 }
  ]);

  const [cuttingPlan, setCuttingPlan] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const addRectangle = () => {
    const newId = `R${rectangles.length + 1}`;
    setRectangles([...rectangles, { 
      id: newId, 
      width: 300, 
      height: 200, 
      rotatable: true 
    }]);
  };

  const removeRectangle = (index: number) => {
    setRectangles(rectangles.filter((_, i) => i !== index));
  };

  const updateRectangle = (index: number, field: string, value: any) => {
    const updated = [...rectangles];
    updated[index] = { ...updated[index], [field]: value };
    setRectangles(updated);
  };

  const addSheet = () => {
    const newId = `S${sheets.length + 1}`;
    setSheets([...sheets, { id: newId, width: 2000, height: 1000 }]);
  };

  const removeSheet = (index: number) => {
    if (sheets.length > 1) {
      setSheets(sheets.filter((_, i) => i !== index));
    }
  };

  const updateSheet = (index: number, field: string, value: number) => {
    const updated = [...sheets];
    updated[index] = { ...updated[index], [field]: value };
    setSheets(updated);
  };

  const performOptimization = () => {
    const plan = sheetOptimizer.optimize(rectangles, sheets);
    setCuttingPlan(plan);
    if (onOptimize) onOptimize(plan);

    // Generuj instrukcje
    const instructions = sheetOptimizer.generateCuttingInstructions(plan);
    console.log('Instrukcje cięcia:', instructions.join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* Elementy do cięcia */}
      <div className="bg-zinc-700 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Package className="w-5 h-5 text-orange-500" />
            Elementy do rozkroju
          </h3>
          <button
            onClick={addRectangle}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Dodaj element
          </button>
        </div>

        <div className="space-y-3">
          {rectangles.map((rect, index) => (
            <div key={rect.id} className="flex items-center gap-4 p-3 bg-zinc-800 rounded-lg">
              <input
                type="text"
                value={rect.id}
                onChange={(e) => updateRectangle(index, 'id', e.target.value)}
                className="w-20 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                placeholder="ID"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rect.width}
                  onChange={(e) => updateRectangle(index, 'width', parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  placeholder="Szerokość"
                />
                <span className="text-gray-400">×</span>
                <input
                  type="number"
                  value={rect.height}
                  onChange={(e) => updateRectangle(index, 'height', parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  placeholder="Wysokość"
                />
                <span className="text-gray-400">mm</span>
              </div>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={rect.rotatable}
                  onChange={(e) => updateRectangle(index, 'rotatable', e.target.checked)}
                  className="rounded bg-zinc-700 border-zinc-600"
                />
                <span className="text-sm">Może być obrócony</span>
              </label>
              <button
                onClick={() => removeRectangle(index)}
                className="ml-auto p-2 text-red-400 hover:bg-red-500/20 rounded transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Arkusze materiału */}
      <div className="bg-zinc-700 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Settings className="w-5 h-5 text-green-500" />
            Dostępne arkusze
          </h3>
          <button
            onClick={addSheet}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Dodaj arkusz
          </button>
        </div>

        <div className="space-y-3">
          {sheets.map((sheet, index) => (
            <div key={sheet.id} className="flex items-center gap-4 p-3 bg-zinc-800 rounded-lg">
              <input
                type="text"
                value={sheet.id}
                readOnly
                className="w-20 px-3 py-2 bg-zinc-600 border border-zinc-600 rounded text-gray-300"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sheet.width}
                  onChange={(e) => updateSheet(index, 'width', parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  placeholder="Szerokość"
                />
                <span className="text-gray-400">×</span>
                <input
                  type="number"
                  value={sheet.height}
                  onChange={(e) => updateSheet(index, 'height', parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  placeholder="Wysokość"
                />
                <span className="text-gray-400">mm</span>
              </div>
              {sheets.length > 1 && (
                <button
                  onClick={() => removeSheet(index)}
                  className="ml-auto p-2 text-red-400 hover:bg-red-500/20 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Przycisk optymalizacji */}
      <div className="flex justify-center">
        <button
          onClick={performOptimization}
          className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-lg font-semibold flex items-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          Optymalizuj rozkrój
        </button>
      </div>

      {/* Wyniki optymalizacji */}
      {cuttingPlan && (
        <>
          <CuttingVisualization plan={cuttingPlan} />
          
          <div className="bg-zinc-700 rounded-lg shadow-xl p-6">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full text-left font-semibold text-lg flex justify-between items-center text-white"
            >
              Instrukcje cięcia
              <span className="text-sm text-gray-400">
                {showInstructions ? 'Ukryj' : 'Pokaż'}
              </span>
            </button>
            
            {showInstructions && (
              <pre className="mt-4 p-4 bg-zinc-800 rounded-lg text-sm overflow-x-auto text-gray-300">
                {sheetOptimizer.generateCuttingInstructions(cuttingPlan).join('\n')}
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  );
};