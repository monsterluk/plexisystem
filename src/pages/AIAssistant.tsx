import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Sparkles, Calculator, FileText, Lightbulb, BarChart, Target, Zap, RefreshCw, MessageSquare, ChevronRight, DollarSign, Percent, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { AIService } from '@/services/aiService';
import { formatDate } from '@/utils/dateHelpers';

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

export function AIAssistant() {
  const [activeTab, setActiveTab] = useState<'pricing' | 'conversion' | 'descriptions' | 'insights'>('pricing');
  const [loading, setLoading] = useState(false);
  const [priceSuggestions, setPriceSuggestions] = useState<PriceSuggestion[]>([]);
  const [conversionPredictions, setConversionPredictions] = useState<ConversionPrediction[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Symulacja AI - w rzeczywistości byłoby to API
  const generatePriceSuggestions = async () => {
    setLoading(true);
    // Symulacja opóźnienia API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPriceSuggestions([
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
      },
      {
        productId: '3',
        productName: 'Kaseton LED 100x50cm',
        currentPrice: 850,
        suggestedPrice: 920,
        reason: 'Produkt premium z wysoką marżą. Klienci B2B akceptują wyższe ceny za jakość.',
        confidence: 91,
        potentialRevenue: 3200
      }
    ]);
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

  const renderPricingSuggestions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sugestie cenowe AI</h3>
          <p className="text-sm text-gray-500 mt-1">Optymalizacja cen na podstawie analizy rynku i historii sprzedaży</p>
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
            <div key={suggestion.productId} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{suggestion.productName}</h4>
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Obecna cena</p>
                      <p className="text-xl font-bold text-gray-900">{suggestion.currentPrice} zł/m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sugerowana cena</p>
                      <p className="text-xl font-bold text-orange-600">{suggestion.suggestedPrice} zł/m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Zmiana</p>
                      <p className={`text-xl font-bold ${suggestion.suggestedPrice > suggestion.currentPrice ? 'text-green-600' : 'text-red-600'}`}>
                        {suggestion.suggestedPrice > suggestion.currentPrice ? '+' : ''}{((suggestion.suggestedPrice - suggestion.currentPrice) / suggestion.currentPrice * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">{suggestion.reason}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Pewność: {suggestion.confidence}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Potencjalny przychód: +{suggestion.potentialRevenue} zł/mies.</span>
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
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Kliknij "Analizuj ceny" aby otrzymać sugestie AI</p>
        </div>
      )}
    </div>
  );

  const renderConversionPredictions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Przewidywanie konwersji</h3>
          <p className="text-sm text-gray-500 mt-1">AI analizuje szanse na zaakceptowanie ofert</p>
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
            <div key={prediction.offerId} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{prediction.offerNumber}</h4>
                  <p className="text-sm text-gray-500">{prediction.clientName}</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${
                    prediction.probability >= 70 ? 'text-green-600' : 
                    prediction.probability >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {prediction.probability}%
                  </div>
                  <p className="text-sm text-gray-500">szansa konwersji</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
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
                <p className="text-sm font-medium text-gray-700">Czynniki wpływające:</p>
                {prediction.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${factor.impact === 'positive' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-600">{factor.factor}</span>
                    <span className={`text-sm font-medium ${factor.impact === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {factor.impact === 'positive' ? '+' : ''}{factor.weight}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Sugerowane akcje */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">Rekomendowane działania:</p>
                <ul className="space-y-1">
                  {prediction.suggestedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-800">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Kliknij "Analizuj oferty" aby zobaczyć predykcje</p>
        </div>
      )}
    </div>
  );

  const renderDescriptionGenerator = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Generator opisów produktów</h3>
        <p className="text-sm text-gray-500 mt-1">AI tworzy profesjonalne opisy na podstawie danych produktu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista produktów */}
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-medium text-gray-900 mb-4">Wybierz produkt</h4>
          <div className="space-y-2">
            {[
              { id: '1', name: 'Plexi Transparentne 3mm', thickness: 3, maxWidth: 3050, maxHeight: 2050 },
              { id: '2', name: 'Dibond 3mm Biały', thickness: 3, maxWidth: 3050, maxHeight: 2050 },
              { id: '3', name: 'Kaseton LED 100x50cm', thickness: 10, maxWidth: 3000, maxHeight: 1500 }
            ].map((product) => (
              <button
                key={product.id}
                onClick={() => generateDescription(product)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">Grubość: {product.thickness}mm</p>
                </div>
                <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Wygenerowany opis */}
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-medium text-gray-900 mb-4">Wygenerowany opis</h4>
          {selectedProduct ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{selectedProduct.generatedDescription}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Słowa kluczowe:</p>
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
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Regeneruj
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Wybierz produkt aby wygenerować opis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Insights AI</h3>
        <p className="text-sm text-gray-500 mt-1">Kluczowe wnioski i rekomendacje biznesowe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Optymalizacja portfolio</h4>
              <p className="text-sm text-blue-700 mt-2">
                Produkty z kategorii "Ekspozytory" mają najwyższą marżę (42%) ale najniższą rotację. 
                Rozważ promocję lub pakiety startowe.
              </p>
              <button className="text-sm text-blue-600 font-medium mt-3 hover:text-blue-700">
                Zobacz szczegóły →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">Trend wzrostowy</h4>
              <p className="text-sm text-green-700 mt-2">
                Kasetony LED notują 35% wzrost zapytań m/m. Zwiększ stan magazynowy 
                i rozważ wprowadzenie nowych rozmiarów.
              </p>
              <button className="text-sm text-green-600 font-medium mt-3 hover:text-green-700">
                Analiza trendu →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-900">Okazja cenowa</h4>
              <p className="text-sm text-orange-700 mt-2">
                80% klientów akceptuje ceny o 5-8% wyższe przy dostawie &lt; 48h. 
                Wprowadź opcję ekspresową.
              </p>
              <button className="text-sm text-orange-600 font-medium mt-3 hover:text-orange-700">
                Konfiguruj →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-900">Optymalizacja rabatów</h4>
              <p className="text-sm text-purple-700 mt-2">
                Rabaty powyżej 10% nie zwiększają konwersji. Ogranicz maksymalny rabat 
                do 10% i wprowadź rabaty ilościowe.
              </p>
              <button className="text-sm text-purple-600 font-medium mt-3 hover:text-purple-700">
                Zmień politykę →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nagłówek */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="w-8 h-8 text-orange-500" />
                AI Assistant
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Inteligentne sugestie i automatyzacja procesów biznesowych
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Model: GPT-4 Business</span>
            </div>
          </div>

          {/* Zakładki */}
          <div className="flex space-x-8 border-b -mb-px">
            {[
              { id: 'pricing', label: 'Sugestie cenowe', icon: Calculator },
              { id: 'conversion', label: 'Przewidywanie konwersji', icon: Target },
              { id: 'descriptions', label: 'Generator opisów', icon: FileText },
              { id: 'insights', label: 'Insights', icon: Lightbulb }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
        {activeTab === 'pricing' && renderPricingSuggestions()}
        {activeTab === 'conversion' && renderConversionPredictions()}
        {activeTab === 'descriptions' && renderDescriptionGenerator()}
        {activeTab === 'insights' && renderInsights()}
      </div>
    </div>
  );
}