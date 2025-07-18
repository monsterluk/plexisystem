import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, 
  Package, 
  Calculator, 
  Download, 
  Plus, 
  Trash2, 
  RotateCw,
  Grid3x3,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';
import { 
  SheetOptimizer, 
  SheetSize, 
  CutPiece, 
  OptimizationResult,
  generateCuttingVisualization 
} from '@/utils/optimization/sheetOptimizer';

// Standardowe rozmiary arkuszy
const STANDARD_SHEETS: SheetSize[] = [
  { width: 3050, height: 2050, material: 'Plexi bezbarwna', thickness: 3, pricePerSheet: 450 },
  { width: 3050, height: 2050, material: 'Plexi bezbarwna', thickness: 5, pricePerSheet: 750 },
  { width: 2050, height: 1250, material: 'Plexi bezbarwna', thickness: 3, pricePerSheet: 280 },
  { width: 3050, height: 2050, material: 'Plexi mleczna', thickness: 3, pricePerSheet: 480 },
  { width: 3050, height: 2050, material: 'PCV spienione', thickness: 5, pricePerSheet: 320 },
  { width: 3050, height: 2050, material: 'PCV spienione', thickness: 10, pricePerSheet: 580 },
];

export const SheetCuttingOptimizer: React.FC = () => {
  const [selectedSheet, setSelectedSheet] = useState<SheetSize>(STANDARD_SHEETS[0]);
  const [pieces, setPieces] = useState<CutPiece[]>([
    { id: '1', width: 400, height: 600, quantity: 5, canRotate: true, label: 'A1' },
    { id: '2', width: 300, height: 300, quantity: 8, canRotate: true, label: 'B1' },
  ]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const addPiece = () => {
    const newPiece: CutPiece = {
      id: Date.now().toString(),
      width: 300,
      height: 400,
      quantity: 1,
      canRotate: true,
      label: `P${pieces.length + 1}`
    };
    setPieces([...pieces, newPiece]);
  };

  const updatePiece = (id: string, field: keyof CutPiece, value: any) => {
    setPieces(pieces.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removePiece = (id: string) => {
    setPieces(pieces.filter(p => p.id !== id));
  };

  const runOptimization = async () => {
    if (pieces.length === 0) {
      toast.error('Dodaj przynajmniej jeden element do cięcia');
      return;
    }

    setIsOptimizing(true);
    
    try {
      // Symulacja opóźnienia obliczeń
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const optimizer = new SheetOptimizer([selectedSheet], pieces);
      const result = optimizer.optimize();
      
      setOptimizationResult(result);
      
      if (result.wastePercentage < 10) {
        toast.success(`Świetna optymalizacja! Tylko ${result.wastePercentage.toFixed(1)}% odpadu`);
      } else if (result.wastePercentage < 20) {
        toast.success(`Dobra optymalizacja - ${result.wastePercentage.toFixed(1)}% odpadu`);
      } else {
        toast.success(`Optymalizacja zakończona - ${result.wastePercentage.toFixed(1)}% odpadu`);
      }
    } catch (error) {
      toast.error('Błąd podczas optymalizacji');
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const exportToPDF = () => {
    // TODO: Implementacja eksportu do PDF
    toast.success('Funkcja eksportu będzie dostępna wkrótce');
  };

  const exportToDXF = () => {
    // TODO: Implementacja eksportu do DXF dla maszyn CNC
    toast.success('Funkcja eksportu DXF będzie dostępna wkrótce');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel konfiguracji */}
      <div className="space-y-6">
        {/* Wybór arkusza */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Arkusz bazowy</h3>
          </div>
          
          <select
            value={STANDARD_SHEETS.findIndex(s => 
              s.width === selectedSheet.width && 
              s.height === selectedSheet.height && 
              s.material === selectedSheet.material
            )}
            onChange={(e) => setSelectedSheet(STANDARD_SHEETS[parseInt(e.target.value)])}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-purple-500 focus:outline-none mb-4"
          >
            {STANDARD_SHEETS.map((sheet, index) => (
              <option key={index} value={index}>
                {sheet.material} {sheet.thickness}mm - {sheet.width}x{sheet.height}mm - {sheet.pricePerSheet} zł
              </option>
            ))}
          </select>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Powierzchnia:</span>
              <span className="text-white ml-2">
                {((selectedSheet.width * selectedSheet.height) / 1000000).toFixed(2)} m²
              </span>
            </div>
            <div>
              <span className="text-gray-500">Cena/m²:</span>
              <span className="text-white ml-2">
                {(selectedSheet.pricePerSheet / ((selectedSheet.width * selectedSheet.height) / 1000000)).toFixed(2)} zł
              </span>
            </div>
          </div>
        </Card>

        {/* Lista elementów do cięcia */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Scissors className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Elementy do cięcia</h3>
            </div>
            <Button size="sm" onClick={addPiece}>
              <Plus className="w-4 h-4" />
              Dodaj element
            </Button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pieces.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-zinc-800/50 rounded-lg p-4"
              >
                <div className="grid grid-cols-5 gap-3 items-center">
                  <Input
                    type="text"
                    value={piece.label || ''}
                    onChange={(e) => updatePiece(piece.id, 'label', e.target.value)}
                    placeholder="Nazwa"
                    className="col-span-1"
                  />
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={piece.width}
                      onChange={(e) => updatePiece(piece.id, 'width', parseInt(e.target.value))}
                      placeholder="Szer."
                      min="1"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={piece.height}
                      onChange={(e) => updatePiece(piece.id, 'height', parseInt(e.target.value))}
                      placeholder="Wys."
                      min="1"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={piece.quantity}
                      onChange={(e) => updatePiece(piece.id, 'quantity', parseInt(e.target.value))}
                      placeholder="Ilość"
                      min="1"
                    />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    <button
                      onClick={() => updatePiece(piece.id, 'canRotate', !piece.canRotate)}
                      className={`p-2 rounded transition-all ${
                        piece.canRotate 
                          ? 'bg-purple-900/30 text-purple-400' 
                          : 'bg-zinc-700 text-gray-500'
                      }`}
                      title="Możliwość obrotu"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removePiece(piece.id)}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {pieces.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Grid3x3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Brak elementów do cięcia</p>
              <p className="text-sm">Kliknij "Dodaj element" aby rozpocząć</p>
            </div>
          )}
        </Card>

        {/* Przycisk optymalizacji */}
        <Button
          onClick={runOptimization}
          variant="primary"
          className="w-full"
          disabled={isOptimizing || pieces.length === 0}
        >
          {isOptimizing ? (
            <>
              <Calculator className="w-5 h-5 animate-pulse" />
              Optymalizowanie...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              Optymalizuj rozkrój
            </>
          )}
        </Button>
      </div>

      {/* Panel wyników */}
      <div className="space-y-6">
        {optimizationResult ? (
          <>
            {/* Statystyki */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Wyniki optymalizacji</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Arkusze</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{optimizationResult.totalSheets}</p>
                </div>
                
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-full ${
                      optimizationResult.wastePercentage < 10 ? 'bg-green-400' :
                      optimizationResult.wastePercentage < 20 ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`} />
                    <span className="text-sm text-gray-400">Odpad</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {optimizationResult.wastePercentage.toFixed(1)}%
                  </p>
                </div>
                
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">💰 Koszt</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{optimizationResult.totalCost} zł</p>
                </div>
                
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">⏱️ Czas cięcia</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {optimizationResult.estimatedTime.toFixed(0)} min
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Powierzchnia użyta:</span>
                  <span className="text-white">
                    {(optimizationResult.usedArea / 1000000).toFixed(2)} m²
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Powierzchnia odpadu:</span>
                  <span className="text-white">
                    {(optimizationResult.wasteArea / 1000000).toFixed(2)} m²
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Długość cięcia:</span>
                  <span className="text-white">
                    {(optimizationResult.cuttingDistance / 1000).toFixed(1)} m
                  </span>
                </div>
              </div>
            </Card>

            {/* Wizualizacje arkuszy */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Rozkład arkuszy</h3>
              
              <div className="space-y-4">
                {optimizationResult.layouts.map((layout, index) => (
                  <div key={index} className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">
                        Arkusz #{index + 1}
                      </h4>
                      <span className="text-sm text-gray-400">
                        Wykorzystanie: {layout.utilization.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div 
                      className="bg-white rounded overflow-hidden"
                      dangerouslySetInnerHTML={{ 
                        __html: generateCuttingVisualization(layout, 0.15) 
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Przyciski eksportu */}
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={exportToPDF} variant="secondary">
                <Download className="w-5 h-5" />
                Eksport PDF
              </Button>
              <Button onClick={exportToDXF} variant="secondary">
                <Download className="w-5 h-5" />
                Eksport DXF
              </Button>
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <Grid3x3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Brak wyników optymalizacji
            </h3>
            <p className="text-gray-400">
              Skonfiguruj elementy do cięcia i kliknij "Optymalizuj rozkrój"
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};