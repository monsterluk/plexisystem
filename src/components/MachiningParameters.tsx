import React, { useState, useMemo } from 'react';
import { Search, Info, AlertCircle, Settings } from 'lucide-react';
import {
  MACHINING_PARAMETERS,
  SPECIAL_TOOLS,
  MACHINING_TIPS,
  getMachiningParameters,
  getMaterialsByCategory,
  getAvailableToolDiameters,
  calculateChipLoad,
  calculateOptimalFeedRate,
  getRecommendedDepthOfCut
} from '../data/machining/machiningDatabase';

export const MachiningParameters: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedToolDiameter, setSelectedToolDiameter] = useState<number>(0);
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Kalkulator
  const [calcRPM, setCalcRPM] = useState<number>(0);
  const [calcFeedRate, setCalcFeedRate] = useState<number>(0);
  const [calcFlutes, setCalcFlutes] = useState<number>(1);

  // Pobierz unikalne kategorie
  const categories = useMemo(() => {
    const cats = [...new Set(MACHINING_PARAMETERS.map(p => p.materialCategory))];
    return cats.sort();
  }, []);

  // Pobierz materiały dla wybranej kategorii
  const materials = useMemo(() => {
    if (!selectedCategory) return [];
    return getMaterialsByCategory(selectedCategory);
  }, [selectedCategory]);

  // Pobierz dostępne średnice dla wybranego materiału
  const toolDiameters = useMemo(() => {
    if (!selectedMaterial) return [];
    return getAvailableToolDiameters(selectedMaterial);
  }, [selectedMaterial]);

  // Pobierz parametry dla wybranych opcji
  const parameters = useMemo(() => {
    if (!selectedMaterial || !selectedToolDiameter) return null;
    return getMachiningParameters(selectedMaterial, selectedToolDiameter);
  }, [selectedMaterial, selectedToolDiameter]);

  // Oblicz posuw na ostrze
  const chipLoad = useMemo(() => {
    if (!calcRPM || !calcFeedRate || !calcFlutes) return 0;
    return calculateChipLoad(calcFeedRate, calcRPM, calcFlutes);
  }, [calcRPM, calcFeedRate, calcFlutes]);

  // Reset materiału przy zmianie kategorii
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedMaterial('');
    setSelectedToolDiameter(0);
  };

  // Reset średnicy przy zmianie materiału
  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);
    setSelectedToolDiameter(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Nagłówek */}
      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Settings className="w-8 h-8 text-orange-500" />
                Parametry Frezowania CNC
              </h1>
              <p className="mt-1 text-sm text-gray-300">
                Wyszukaj optymalne parametry obróbki dla różnych materiałów
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zawartość */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selektor materiału */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <Search className="h-5 w-5 text-orange-500" />
            Wybierz materiał
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kategoria */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kategoria materiału
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">-- Wybierz kategorię --</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Materiał */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Materiał
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => handleMaterialChange(e.target.value)}
                disabled={!selectedCategory}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-800 disabled:opacity-50"
              >
                <option value="">-- Wybierz materiał --</option>
                {materials.map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>

            {/* Średnica freza */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Średnica freza [mm]
              </label>
              <select
                value={selectedToolDiameter}
                onChange={(e) => setSelectedToolDiameter(Number(e.target.value))}
                disabled={!selectedMaterial}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-800 disabled:opacity-50"
              >
                <option value={0}>-- Wybierz średnicę --</option>
                {toolDiameters.map(diameter => (
                  <option key={diameter} value={diameter}>{diameter} mm</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Wyniki parametrów */}
        {parameters && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Zalecane parametry obróbki</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* RPM */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="text-sm text-blue-300 mb-1">Obroty wrzeciona [RPM]</div>
                <div className="text-2xl font-bold text-blue-400">
                  {parameters.rpm.min.toLocaleString()} - {parameters.rpm.max.toLocaleString()}
                </div>
              </div>

              {/* Posuw */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="text-sm text-green-300 mb-1">Posuw [mm/min]</div>
                <div className="text-2xl font-bold text-green-400">
                  {parameters.feedRate.min.toLocaleString()} - {parameters.feedRate.max.toLocaleString()}
                </div>
              </div>

              {/* Typ freza */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="text-sm text-purple-300 mb-1">Typ freza</div>
                <div className="text-xl font-bold text-purple-400">
                  {parameters.toolType}
                </div>
              </div>

              {/* Głębokość skrawania */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="text-sm text-orange-300 mb-1">Zalecana głębokość [mm]</div>
                <div className="text-2xl font-bold text-orange-400">
                  {getRecommendedDepthOfCut(parameters.material, parameters.toolDiameter).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Uwagi */}
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-yellow-300">Uwagi:</div>
                  <div className="text-yellow-200">{parameters.notes}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kalkulator posuwu */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Kalkulator posuwu na ostrze</h2>
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              {showCalculator ? 'Ukryj' : 'Pokaż'} kalkulator
            </button>
          </div>

          {showCalculator && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Obroty [RPM]
                  </label>
                  <input
                    type="number"
                    value={calcRPM}
                    onChange={(e) => setCalcRPM(Number(e.target.value))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="np. 18000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Posuw [mm/min]
                  </label>
                  <input
                    type="number"
                    value={calcFeedRate}
                    onChange={(e) => setCalcFeedRate(Number(e.target.value))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="np. 2400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Liczba ostrzy
                  </label>
                  <input
                    type="number"
                    value={calcFlutes}
                    onChange={(e) => setCalcFlutes(Number(e.target.value))}
                    min="1"
                    max="6"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="np. 1"
                  />
                </div>
              </div>

              {chipLoad > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                  <div className="text-sm text-blue-300 mb-1">Posuw na ostrze</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {chipLoad.toFixed(3)} mm/ostrze
                  </div>
                  <div className="text-sm text-blue-300 mt-2">
                    {chipLoad < 0.05 && 'Uwaga: Bardzo mały posuw - ryzyko tarcia i przegrzania'}
                    {chipLoad > 0.5 && 'Uwaga: Duży posuw - sprawdź sztywność maszyny'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wskazówki bezpieczeństwa */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Wskazówki bezpieczeństwa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MACHINING_TIPS.safety.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
                <p className="text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela rozwiązywania problemów */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Rozwiązywanie problemów</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Problem</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Przyczyna</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Rozwiązanie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {MACHINING_TIPS.troubleshooting.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-200">{item.problem}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.cause}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};