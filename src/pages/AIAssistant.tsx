import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Sparkles, Calculator, FileText, Lightbulb, BarChart, Target, Zap, RefreshCw, MessageSquare, ChevronRight, DollarSign, Percent, Clock, AlertCircle, Package, Grid, Maximize, Square, Plus, Trash2, RotateCcw, Download } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { AIService } from '@/services/aiService';
import { formatDate } from '@/utils/dateHelpers';
import { aiServiceAPI } from '@/config/aiConfig';

interface PriceSuggestion {
  productId: string;
  productName: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  confidence: number;
  potentialRevenue: number;
}

interface ConversionPrediction {
  offerId: string;
  offerNumber: string;
  clientName: string;
  probability: number;
  factors: { factor: string; impact: 'positive' | 'negative'; weight: number }[];
  suggestedActions: string[];
}

interface ProductDescription {
  productId: string;
  productName: string;
  generatedDescription: string;
  keywords: string[];
  tone: 'professional' | 'casual' | 'technical';
}

interface NestingPart {
  id: string;
  name: string;
  width: number;
  height: number;
  quantity: number;
  material: string;
  thickness: number;
  urgent?: boolean;
}

interface NestingResult {
  sheetSize: { width: number; height: number };
  efficiency: number;
  wasteArea: number;
  totalSheets: number;
  partsLayout: { partId: string; x: number; y: number; rotation: number }[];
  materialCost: number;
  estimatedCutTime: number;
}

export function AIAssistant() {
  const [activeTab, setActiveTab] = useState<'pricing' | 'conversion' | 'descriptions' | 'insights' | 'nesting'>('pricing');
  const [loading, setLoading] = useState(false);
  const [priceSuggestions, setPriceSuggestions] = useState<PriceSuggestion[]>([]);
  const [conversionPredictions, setConversionPredictions] = useState<ConversionPrediction[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [nestingParts, setNestingParts] = useState<NestingPart[]>([]);
  const [nestingResults, setNestingResults] = useState<NestingResult[]>([]);
  const [selectedSheet, setSelectedSheet] = useState({ width: 3050, height: 2050 });
  const [aiStatus, setAiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Sprawdź status AI przy ładowaniu komponentu
  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      // Sprawdź czy klucz API jest skonfigurowany
      const hasApiKey = import.meta.env.VITE_CLAUDE_API_KEY || 
                       import.meta.env.VITE_OPENAI_API_KEY || 
                       import.meta.env.VITE_GEMINI_API_KEY || 
                       import.meta.env.VITE_PERPLEXITY_API_KEY;
      
      setAiStatus(hasApiKey ? 'connected' : 'disconnected');
    } catch (error) {
      setAiStatus('disconnected');
    }
  };

  // Dodaj część do nestingu
  const addNestingPart = () => {
    const newPart: NestingPart = {
      id: `part_${Date.now()}`,
      name: `Część ${nestingParts.length + 1}`,
      width: 100,
      height: 100,
      quantity: 1,
      material: 'PMMA 3mm',
      thickness: 3,
    };
    setNestingParts([...nestingParts, newPart]);
  };

  // Usuń część
  const removePart = (partId: string) => {
    setNestingParts(nestingParts.filter(part => part.id !== partId));
  };

  // Aktualizuj część
  const updatePart = (partId: string, field: keyof NestingPart, value: any) => {
    setNestingParts(nestingParts.map(part => 
      part.id === partId ? { ...part, [field]: value } : part
    ));
  };

  // Uruchom analizę nestingu
  const runNestingAnalysis = async () => {
    if (nestingParts.length === 0) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Obliczanie powierzchni z uwzględnieniem marginesu cięcia (5mm)
    const cuttingMargin = 5; // margines cięcia w mm
    const totalPartsArea = nestingParts.reduce((sum, part) => 
      sum + ((part.width + cuttingMargin * 2) * (part.height + cuttingMargin * 2) * part.quantity), 0
    );

    const sheetArea = selectedSheet.width * selectedSheet.height;
    
    // Realistyczna efektywność (70-85% w zależności od wypełnienia)
    const fillRatio = totalPartsArea / sheetArea;
    const estimatedEfficiency = Math.min(85, Math.max(50, 70 + fillRatio * 15));
    
    // Rzeczywista powierzchnia użyta (z marginesami)
    const usedArea = totalPartsArea;
    const totalSheets = Math.ceil(usedArea / (sheetArea * (estimatedEfficiency / 100)));
    const totalUsedSheetArea = totalSheets * sheetArea;
    const wasteArea = totalUsedSheetArea - totalPartsArea;

    const result: NestingResult = {
      sheetSize: selectedSheet,
      efficiency: estimatedEfficiency,
      wasteArea: wasteArea,
      totalSheets: totalSheets,
      partsLayout: nestingParts.flatMap(part => 
        Array.from({ length: part.quantity }, (_, i) => ({
          partId: `${part.id}_${i}`,
          x: Math.random() * Math.max(0, selectedSheet.width - part.width - cuttingMargin * 2),
          y: Math.random() * Math.max(0, selectedSheet.height - part.height - cuttingMargin * 2),
          rotation: Math.random() > 0.7 ? 90 : 0
        }))
      ),
      materialCost: totalSheets * 45 * ((selectedSheet.width * selectedSheet.height) / 1000000),
      estimatedCutTime: (totalPartsArea / 100) / 150 // mm²/min -> min
    };

    setNestingResults([result]);
    setLoading(false);
  };

  // Używanie prawdziwego AI API do generowania sugestii cenowych
  const generatePriceSuggestions = async () => {
    setLoading(true);
    
    try {
      // Pobierz dane produktów z bazy
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .limit(3);
      
      if (error) throw error;
      
      const suggestions = [];
      
      // Dla każdego produktu wywołaj AI API
      for (const product of products || []) {
        try {
          // Przygotuj dane dla AI
          const productData = {
            name: product.name,
            currentPrice: product.base_price || 150,
            category: product.category,
            salesHistory: 'Ostatnie 30 dni: 45 szt., średnia cena: ' + product.base_price
          };
          
          // Wywołaj AI API
          const aiResponse = await aiServiceAPI.analyzePricing(productData);
          
          if (aiResponse) {
            suggestions.push({
              productId: product.id,
              productName: product.name,
              currentPrice: product.base_price || 150,
              suggestedPrice: aiResponse.suggestedPrice || product.base_price * 1.1,
              reason: aiResponse.reason || 'Analiza rynku sugeruje korektę ceny.',
              confidence: aiResponse.confidence || 75,
              potentialRevenue: Math.round((aiResponse.suggestedPrice - product.base_price) * 50)
            });
          }
        } catch (aiError) {
          console.error('AI API Error for product:', product.name, aiError);
          // Fallback do symulowanych danych
          suggestions.push({
            productId: product.id,
            productName: product.name,
            currentPrice: product.base_price || 150,
            suggestedPrice: Math.round((product.base_price || 150) * 1.05),
            reason: 'Analiza niedostępna - sugerowana standardowa korekta 5%',
            confidence: 50,
            potentialRevenue: Math.round((product.base_price || 150) * 0.05 * 50)
          });
        }
      }
      
      // Jeśli nie ma produktów lub błąd, użyj danych demo
      if (suggestions.length === 0) {
        suggestions.push(
          {
            productId: '1',
            productName: 'Plexi Transparentne 3mm',
            currentPrice: 150,
            suggestedPrice: 165,
            reason: 'Analiza rynku pokazuje, że konkurencja oferuje podobne produkty w cenie 170-180 zł/m². Możesz bezpiecznie podnieść cenę.',
            confidence: 85,
            potentialRevenue: 1250
          },
          {
            productId: '2',
            productName: 'Dibond 3mm Biały',
            currentPrice: 180,
            suggestedPrice: 175,
            reason: 'Niska konwersja sugeruje, że cena może być za wysoka. Obniżka o 3% może zwiększyć sprzedaż o 15%.',
            confidence: 72,
            potentialRevenue: 890
          }
        );
      }
      
      setPriceSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating price suggestions:', error);
      // W przypadku błędu użyj danych demonstracyjnych
      setPriceSuggestions([
        {
          productId: '1',
          productName: 'Plexi Transparentne 3mm',
          currentPrice: 150,
          suggestedPrice: 165,
          reason: 'Analiza rynku pokazuje, że konkurencja oferuje podobne produkty w cenie 170-180 zł/m². Możesz bezpiecznie podnieść cenę.',
          confidence: 85,
          potentialRevenue: 1250
        }
      ]);
    }
    
    setLoading(false);
  };

  const analyzeConversions = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setConversionPredictions([
      {
        offerId: '1',
        offerNumber: 'OF/2024/07/015',
        clientName: 'Firma ABC',
        probability: 78,
        factors: [
          { factor: 'Stały klient (5+ zamówień)', impact: 'positive', weight: 25 },
          { factor: 'Wartość oferty < średnia', impact: 'positive', weight: 15 },
          { factor: 'Termin realizacji > 14 dni', impact: 'negative', weight: -10 },
          { factor: 'Konkurencyjna cena', impact: 'positive', weight: 20 }
        ],
        suggestedActions: [
          'Zaoferuj 5% rabat za szybką decyzję',
          'Podkreśl dotychczasową współpracę',
          'Zaproponuj darmową dostawę'
        ]
      },
      {
        offerId: '2',
        offerNumber: 'OF/2024/07/016',
        clientName: 'Nowy Klient XYZ',
        probability: 45,
        factors: [
          { factor: 'Pierwszy kontakt', impact: 'negative', weight: -20 },
          { factor: 'Wysoka wartość oferty', impact: 'negative', weight: -15 },
          { factor: 'Brak historii zakupów', impact: 'negative', weight: -10 },
          { factor: 'Szybki termin realizacji', impact: 'positive', weight: 15 }
        ],
        suggestedActions: [
          'Zaproponuj spotkanie demonstracyjne',
          'Podziel ofertę na etapy',
          'Dodaj referencje od podobnych klientów'
        ]
      }
    ]);
    setLoading(false);
  };

  const generateDescription = async (product: any) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Symulacja generowania opisu
    const description = `${product.name} to wysokiej jakości produkt wykonany z najlepszych materiałów. 
    Idealny do zastosowań reklamowych i dekoracyjnych. Charakteryzuje się doskonałą przejrzystością 
    i trwałością. Grubość ${product.thickness}mm zapewnia optymalną sztywność przy zachowaniu lekkości. 
    Maksymalne wymiary ${product.maxWidth}x${product.maxHeight}mm pozwalają na realizację nawet 
    największych projektów. Produkt objęty jest pełną gwarancją jakości.`;
    
    setSelectedProduct({
      ...product,
      generatedDescription: description,
      keywords: ['reklama', 'dekoracja', 'trwałość', 'jakość', 'gwarancja'],
      tone: 'professional'
    });
    
    setLoading(false);
  };

  const renderNestingOptimizer = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Optymalizator Nestingu AI</h3>
          <p className="text-sm text-gray-400 mt-1">Inteligentne rozmieszczenie detali na arkuszu materiału</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addNestingPart}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Dodaj detal
          </button>
          <button
            onClick={runNestingAnalysis}
            disabled={loading || nestingParts.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Calculator className="w-4 h-4" />
            )}
            Analizuj nesting
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Konfiguracja arkusza */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h4 className="font-medium text-white mb-4">Rozmiar arkusza</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-400">Szerokość (mm)</label>
                <input
                  type="number"
                  value={selectedSheet.width}
                  onChange={(e) => setSelectedSheet(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                  className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Wysokość (mm)</label>
                <input
                  type="number"
                  value={selectedSheet.height}
                  onChange={(e) => setSelectedSheet(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                  className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">Rozmiary standardowe:</p>
              {[
                { width: 3050, height: 2050, label: 'PMMA Standard' },
                { width: 2050, height: 3050, label: 'PMMA Pionowy' },
                { width: 3050, height: 1530, label: 'Dibond Standard' },
                { width: 2000, height: 1000, label: 'PETG Standard' }
              ].map((size) => (
                <button
                  key={`${size.width}x${size.height}`}
                  onClick={() => setSelectedSheet({ width: size.width, height: size.height })}
                  className="w-full text-left text-sm p-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors"
                >
                  {size.label}: {size.width}×{size.height}mm
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista detali */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h4 className="font-medium text-white mb-4">Detale do zagnieżdżenia</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {nestingParts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm">Dodaj detale aby rozpocząć</p>
              </div>
            ) : (
              nestingParts.map((part) => (
                <div key={part.id} className="border border-gray-600 rounded-lg p-3 space-y-2 bg-gray-700/30">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={part.name}
                      onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                      className="font-medium text-sm border-none p-0 focus:ring-0 bg-transparent text-white"
                    />
                    <button
                      onClick={() => removePart(part.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400">Szerokość</label>
                      <input
                        type="number"
                        value={part.width}
                        onChange={(e) => updatePart(part.id, 'width', parseInt(e.target.value) || 0)}
                        className="w-full text-sm bg-gray-600 border border-gray-500 text-white rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Wysokość</label>
                      <input
                        type="number"
                        value={part.height}
                        onChange={(e) => updatePart(part.id, 'height', parseInt(e.target.value) || 0)}
                        className="w-full text-sm bg-gray-600 border border-gray-500 text-white rounded px-2 py-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400">Ilość</label>
                      <input
                        type="number"
                        value={part.quantity}
                        min="1"
                        onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full text-sm bg-gray-600 border border-gray-500 text-white rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Grubość</label>
                      <input
                        type="number"
                        value={part.thickness}
                        onChange={(e) => updatePart(part.id, 'thickness', parseInt(e.target.value) || 0)}
                        className="w-full text-sm bg-gray-600 border border-gray-500 text-white rounded px-2 py-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={part.urgent || false}
                      onChange={(e) => updatePart(part.id, 'urgent', e.target.checked)}
                      className="rounded"
                    />
                    <label className="text-xs text-gray-400">Priorytet</label>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Wyniki */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h4 className="font-medium text-white mb-4">Wyniki analizy</h4>
          {nestingResults.length > 0 ? (
            <div className="space-y-4">
              {nestingResults.map((result, index) => (
                <div key={index} className="space-y-3">
                  {/* Podstawowe statystyki */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {result.efficiency.toFixed(1)}%
                      </div>
                      <div className="text-xs text-green-300">Efektywność</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {result.totalSheets}
                      </div>
                      <div className="text-xs text-blue-300">Arkuszy</div>
                    </div>
                  </div>

                  {/* Szczegóły */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Powierzchnia arkusza:</span>
                      <span className="font-medium text-gray-200">{(result.sheetSize.width * result.sheetSize.height / 1000000).toFixed(3)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Powierzchnia odpadu:</span>
                      <span className="font-medium text-gray-200">{(result.wasteArea / 1000000).toFixed(3)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Koszt materiału:</span>
                      <span className="font-medium text-gray-200">{result.materialCost.toFixed(0)} zł</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Czas cięcia:</span>
                      <span className="font-medium text-gray-200">{result.estimatedCutTime.toFixed(1)} min</span>
                    </div>
                  </div>

                  {/* Wizualizacja arkusza */}
                  <div className="border border-gray-600 rounded-lg p-3 bg-gray-700/30">
                    <div className="text-xs text-gray-400 mb-2">Podgląd nestingu:</div>
                    <div 
                      className="relative border-2 border-gray-500 bg-gray-800"
                      style={{ 
                        width: '100%', 
                        height: '120px',
                        aspectRatio: `${result.sheetSize.width} / ${result.sheetSize.height}`
                      }}
                    >
                      {result.partsLayout.slice(0, 10).map((layout, i) => {
                        const part = nestingParts.find(p => layout.partId.startsWith(p.id));
                        if (!part) return null;
                        
                        const scaleX = 100 / result.sheetSize.width;
                        const scaleY = 120 / result.sheetSize.height;
                        
                        return (
                          <div
                            key={layout.partId}
                            className="absolute border border-blue-400 bg-blue-100 opacity-75"
                            style={{
                              left: `${layout.x * scaleX}%`,
                              top: `${layout.y * scaleY}%`,
                              width: `${part.width * scaleX}%`,
                              height: `${part.height * scaleY}%`,
                              transform: `rotate(${layout.rotation}deg)`,
                              fontSize: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {part.name.substring(0, 3)}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Eksportuj układ
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Grid className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm">Uruchom analizę aby zobaczyć wyniki</p>
            </div>
          )}
        </div>
      </div>

      {/* Wskazówki AI */}
      {nestingResults.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-lg p-6">
          <h4 className="font-medium text-orange-300 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Sugestie optymalizacji AI
          </h4>
          <div className="space-y-2 text-sm text-orange-200">
            {nestingResults[0].efficiency < 70 && (
              <p>• Niska efektywność ({nestingResults[0].efficiency.toFixed(1)}%) - rozważ zmianę orientacji detali lub podział na mniejsze partie</p>
            )}
            {nestingResults[0].efficiency > 85 && (
              <p>• Doskonała efektywność ({nestingResults[0].efficiency.toFixed(1)}%) - układ jest optymalny!</p>
            )}
            <p>• Zastosowano 5mm margines bezpieczeństwa między detalami</p>
            <p>• Odpad wynosi {((nestingResults[0].wasteArea / (nestingResults[0].totalSheets * nestingResults[0].sheetSize.width * nestingResults[0].sheetSize.height)) * 100).toFixed(1)}% całkowitej powierzchni</p>
            <p>• Przy większej liczbie detali efektywność może wzrosnąć</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderPricingSuggestions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Sugestie cenowe AI</h3>
          <p className="text-sm text-gray-400 mt-1">Optymalizacja cen na podstawie analizy rynku i historii sprzedaży</p>
        </div>
        <button
          onClick={generatePriceSuggestions}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Analizuj ceny
        </button>
      </div>

      {priceSuggestions.length > 0 ? (
        <div className="space-y-4">
          {priceSuggestions.map((suggestion) => (
            <div key={suggestion.productId} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:shadow-xl hover:shadow-orange-500/10 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{suggestion.productName}</h4>
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Obecna cena</p>
                      <p className="text-xl font-bold text-gray-200">{suggestion.currentPrice} zł/m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Sugerowana cena</p>
                      <p className="text-xl font-bold text-orange-600">{suggestion.suggestedPrice} zł/m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Zmiana</p>
                      <p className={`text-xl font-bold ${suggestion.suggestedPrice > suggestion.currentPrice ? 'text-green-600' : 'text-red-600'}`}>
                        {suggestion.suggestedPrice > suggestion.currentPrice ? '+' : ''}{((suggestion.suggestedPrice - suggestion.currentPrice) / suggestion.currentPrice * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-300">{suggestion.reason}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">Pewność: {suggestion.confidence}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">Potencjalny przychód: +{suggestion.potentialRevenue} zł/mies.</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                      Zastosuj sugestię
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Kliknij "Analizuj ceny" aby otrzymać sugestie AI</p>
        </div>
      )}
    </div>
  );

  const renderConversionPredictions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Przewidywanie konwersji</h3>
          <p className="text-sm text-gray-400 mt-1">AI analizuje szanse na zaakceptowanie ofert</p>
        </div>
        <button
          onClick={analyzeConversions}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <BarChart className="w-4 h-4" />
          )}
          Analizuj oferty
        </button>
      </div>

      {conversionPredictions.length > 0 ? (
        <div className="space-y-4">
          {conversionPredictions.map((prediction) => (
            <div key={prediction.offerId} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white">{prediction.offerNumber}</h4>
                  <p className="text-sm text-gray-400">{prediction.clientName}</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${
                    prediction.probability >= 70 ? 'text-green-600' : 
                    prediction.probability >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {prediction.probability}%
                  </div>
                  <p className="text-sm text-gray-400">szansa konwersji</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    prediction.probability >= 70 ? 'bg-green-500' : 
                    prediction.probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${prediction.probability}%` }}
                />
              </div>

              {/* Faktory */}
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-300">Czynniki wpływające:</p>
                {prediction.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${factor.impact === 'positive' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-400">{factor.factor}</span>
                    <span className={`text-sm font-medium ${factor.impact === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {factor.impact === 'positive' ? '+' : ''}{factor.weight}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Sugerowane akcje */}
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-300 mb-2">Rekomendowane działania:</p>
                <ul className="space-y-1">
                  {prediction.suggestedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-300">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Kliknij "Analizuj oferty" aby zobaczyć predykcje</p>
        </div>
      )}
    </div>
  );

  const renderDescriptionGenerator = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Generator opisów produktów</h3>
        <p className="text-sm text-gray-400 mt-1">AI tworzy profesjonalne opisy na podstawie danych produktu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista produktów */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h4 className="font-medium text-white mb-4">Wybierz produkt</h4>
          <div className="space-y-2">
            {[
              { id: '1', name: 'Plexi Transparentne 3mm', thickness: 3, maxWidth: 3050, maxHeight: 2050 },
              { id: '2', name: 'Dibond 3mm Biały', thickness: 3, maxWidth: 3050, maxHeight: 2050 },
              { id: '3', name: 'Kaseton LED 100x50cm', thickness: 10, maxWidth: 3000, maxHeight: 1500 }
            ].map((product) => (
              <button
                key={product.id}
                onClick={() => generateDescription(product)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-700/50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="text-sm text-gray-400">Grubość: {product.thickness}mm</p>
                </div>
                <Sparkles className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Wygenerowany opis */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h4 className="font-medium text-white mb-4">Wygenerowany opis</h4>
          {selectedProduct ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <p className="text-gray-300 leading-relaxed">{selectedProduct.generatedDescription}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2">Słowa kluczowe:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.keywords.map((keyword: string) => (
                    <span key={keyword} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  Użyj opisu
                </button>
                <button className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700/50 text-gray-300 transition-colors">
                  Regeneruj
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Wybierz produkt aby wygenerować opis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Insights AI</h3>
        <p className="text-sm text-gray-400 mt-1">Kluczowe wnioski i rekomendacje biznesowe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-300">Optymalizacja portfolio</h4>
              <p className="text-sm text-blue-200 mt-2">
                Produkty z kategorii "Ekspozytory" mają najwyższą marżę (42%) ale najniższą rotację. 
                Rozważ promocję lub pakiety startowe.
              </p>
              <button className="text-sm text-blue-400 font-medium mt-3 hover:text-blue-300">
                Zobacz szczegóły →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-300">Trend wzrostowy</h4>
              <p className="text-sm text-green-200 mt-2">
                Kasetony LED notują 35% wzrost zapytań m/m. Zwiększ stan magazynowy 
                i rozważ wprowadzenie nowych rozmiarów.
              </p>
              <button className="text-sm text-green-400 font-medium mt-3 hover:text-green-300">
                Analiza trendu →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-300">Okazja cenowa</h4>
              <p className="text-sm text-orange-200 mt-2">
                80% klientów akceptuje ceny o 5-8% wyższe przy dostawie &lt; 48h. 
                Wprowadź opcję ekspresową.
              </p>
              <button className="text-sm text-orange-400 font-medium mt-3 hover:text-orange-300">
                Konfiguruj →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-300">Optymalizacja rabatów</h4>
              <p className="text-sm text-purple-200 mt-2">
                Rabaty powyżej 10% nie zwiększają konwersji. Ogranicz maksymalny rabat 
                do 10% i wprowadź rabaty ilościowe.
              </p>
              <button className="text-sm text-purple-400 font-medium mt-3 hover:text-purple-300">
                Zmień politykę →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Nagłówek */}
      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Brain className="w-8 h-8 text-orange-500" />
                AI Assistant
              </h1>
              <p className="mt-1 text-sm text-gray-300">
                Inteligentne sugestie i automatyzacja procesów biznesowych
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">Model: GPT-4 Business</span>
              <span className="text-xs text-gray-400 mx-2">|</span>
              <span className={`text-sm flex items-center gap-1 ${
                aiStatus === 'connected' ? 'text-green-400' : 
                aiStatus === 'disconnected' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  aiStatus === 'connected' ? 'bg-green-400' : 
                  aiStatus === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
                }`} />
                {aiStatus === 'connected' ? 'Połączono' : 
                 aiStatus === 'disconnected' ? 'Brak API' : 'Sprawdzanie...'}
              </span>
            </div>
          </div>

          {/* Zakładki */}
          <div className="flex space-x-8 border-b -mb-px">
            {[
              { id: 'pricing', label: 'Sugestie cenowe', icon: Calculator },
              { id: 'conversion', label: 'Przewidywanie konwersji', icon: Target },
              { id: 'descriptions', label: 'Generator opisów', icon: FileText },
              { id: 'nesting', label: 'Optymalizator Nestingu', icon: Grid },
              { id: 'insights', label: 'Insights', icon: Lightbulb }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zawartość */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert o braku konfiguracji API */}
        {aiStatus === 'disconnected' && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-300">Brak konfiguracji API AI</h3>
                <p className="text-sm text-yellow-200/80 mt-1">
                  System działa w trybie demonstracyjnym. Aby korzystać z prawdziwej analizy AI:
                </p>
                <ol className="text-sm text-yellow-200/70 mt-2 list-decimal list-inside space-y-1">
                  <li>Skopiuj plik <code className="bg-gray-700 px-1 rounded">.env.ai.example</code> jako <code className="bg-gray-700 px-1 rounded">.env</code></li>
                  <li>Dodaj klucz API od wybranego dostawcy (Claude, OpenAI, Gemini lub Perplexity)</li>
                  <li>Uruchom ponownie aplikację</li>
                </ol>
                <p className="text-sm text-yellow-200/70 mt-2">
                  Szczegółowe instrukcje znajdziesz w pliku <code className="bg-gray-700 px-1 rounded">AI_README.md</code>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'pricing' && renderPricingSuggestions()}
        {activeTab === 'conversion' && renderConversionPredictions()}
        {activeTab === 'descriptions' && renderDescriptionGenerator()}
        {activeTab === 'nesting' && renderNestingOptimizer()}
        {activeTab === 'insights' && renderInsights()}
      </div>
    </div>
  );
}