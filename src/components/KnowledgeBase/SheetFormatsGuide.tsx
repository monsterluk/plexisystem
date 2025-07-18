import React, { useState } from 'react';
import { Ruler, Package, Info, AlertTriangle, CheckCircle, Clock, Truck, Calculator } from 'lucide-react';

const SheetFormatsGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');

  // Dane arkuszy według dystrybutora Tuplex
  const sheetFormats = [
    // PMMA (Plexi)
    {
      id: 'pmma_3050_2050_2',
      material: 'PMMA',
      materialName: 'Plexi Cast',
      width: 3050,
      height: 2050,
      thickness: 2,
      weight: 2.4,
      availability: 'stock',
      priceRange: '35-45',
      category: 'standard',
      colors: ['transparentny', 'opal', 'biały', 'czarny'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 15
    },
    {
      id: 'pmma_3050_2050_3',
      material: 'PMMA',
      materialName: 'Plexi Cast',
      width: 3050,
      height: 2050,
      thickness: 3,
      weight: 3.6,
      availability: 'stock',
      priceRange: '45-65',
      category: 'standard',
      colors: ['transparentny', 'opal', 'biały', 'czarny', 'czerwony', 'żółty', 'niebieski', 'zielony'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 15
    },
    {
      id: 'pmma_3050_2050_4',
      material: 'PMMA',
      materialName: 'Plexi Cast',
      width: 3050,
      height: 2050,
      thickness: 4,
      weight: 4.8,
      availability: 'stock',
      priceRange: '65-85',
      category: 'standard',
      colors: ['transparentny', 'opal', 'biały', 'czarny'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 20
    },
    {
      id: 'pmma_3050_2050_5',
      material: 'PMMA',
      materialName: 'Plexi Cast',
      width: 3050,
      height: 2050,
      thickness: 5,
      weight: 6.0,
      availability: 'stock',
      priceRange: '85-110',
      category: 'standard',
      colors: ['transparentny', 'opal', 'biały', 'czarny'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 20
    },
    {
      id: 'pmma_3050_2050_6',
      material: 'PMMA',
      materialName: 'Plexi Cast',
      width: 3050,
      height: 2050,
      thickness: 6,
      weight: 7.2,
      availability: 'stock',
      priceRange: '110-140',
      category: 'standard',
      colors: ['transparentny', 'opal', 'biały', 'czarny'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 25
    },
    {
      id: 'pmma_3050_2050_8',
      material: 'PMMA',
      materialName: 'Plexi Cast',
      width: 3050,
      height: 2050,
      thickness: 8,
      weight: 9.6,
      availability: 'stock',
      priceRange: '140-180',
      category: 'thick',
      colors: ['transparentny', 'opal', 'biały', 'czarny'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 30
    },
    {
      id: 'pmma_3050_2050_10',
      material: 'PMMA',
      materialName: 'Plexi Cast',
      width: 3050,
      height: 2050,
      thickness: 10,
      weight: 12.0,
      availability: 'stock',
      priceRange: '180-230',
      category: 'thick',
      colors: ['transparentny', 'opal', 'biały', 'czarny'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 35
    },
    {
      id: 'pmma_2050_3050_3',
      material: 'PMMA',
      materialName: 'Plexi Cast',
      width: 2050,
      height: 3050,
      thickness: 3,
      weight: 3.6,
      availability: 'stock',
      priceRange: '45-65',
      category: 'vertical',
      colors: ['transparentny', 'opal', 'biały', 'czarny'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 15
    },

    // PETG
    {
      id: 'petg_2000_1000_3',
      material: 'PETG',
      materialName: 'PETG Clear',
      width: 2000,
      height: 1000,
      thickness: 3,
      weight: 3.8,
      availability: 'stock',
      priceRange: '25-35',
      category: 'standard',
      colors: ['transparentny', 'opal'],
      leadTime: '2-3 dni',
      minOrder: 1,
      cuttingFee: 12
    },
    {
      id: 'petg_2000_1000_4',
      material: 'PETG',
      materialName: 'PETG Clear',
      width: 2000,
      height: 1000,
      thickness: 4,
      weight: 5.0,
      availability: 'stock',
      priceRange: '35-45',
      category: 'standard',
      colors: ['transparentny', 'opal'],
      leadTime: '2-3 dni',
      minOrder: 1,
      cuttingFee: 15
    },
    {
      id: 'petg_2000_1000_5',
      material: 'PETG',
      materialName: 'PETG Clear',
      width: 2000,
      height: 1000,
      thickness: 5,
      weight: 6.3,
      availability: 'stock',
      priceRange: '45-60',
      category: 'standard',
      colors: ['transparentny', 'opal'],
      leadTime: '2-3 dni',
      minOrder: 1,
      cuttingFee: 18
    },

    // PC Lity
    {
      id: 'pc_2050_1250_2',
      material: 'PC',
      materialName: 'Poliwęglan Lity',
      width: 2050,
      height: 1250,
      thickness: 2,
      weight: 2.4,
      availability: 'order',
      priceRange: '45-65',
      category: 'special',
      colors: ['transparentny', 'opal', 'brązowy', 'niebieski'],
      leadTime: '5-7 dni',
      minOrder: 2,
      cuttingFee: 20
    },
    {
      id: 'pc_2050_1250_3',
      material: 'PC',
      materialName: 'Poliwęglan Lity',
      width: 2050,
      height: 1250,
      thickness: 3,
      weight: 3.6,
      availability: 'order',
      priceRange: '65-85',
      category: 'special',
      colors: ['transparentny', 'opal', 'brązowy', 'niebieski'],
      leadTime: '5-7 dni',
      minOrder: 2,
      cuttingFee: 20
    },
    {
      id: 'pc_2050_1250_4',
      material: 'PC',
      materialName: 'Poliwęglan Lity',
      width: 2050,
      height: 1250,
      thickness: 4,
      weight: 4.8,
      availability: 'stock',
      priceRange: '85-110',
      category: 'special',
      colors: ['transparentny', 'opal', 'brązowy'],
      leadTime: '3-5 dni',
      minOrder: 1,
      cuttingFee: 25
    },
    {
      id: 'pc_2050_1250_5',
      material: 'PC',
      materialName: 'Poliwęglan Lity',
      width: 2050,
      height: 1250,
      thickness: 5,
      weight: 6.0,
      availability: 'stock',
      priceRange: '110-140',
      category: 'special',
      colors: ['transparentny', 'opal'],
      leadTime: '3-5 dni',
      minOrder: 1,
      cuttingFee: 25
    },
    {
      id: 'pc_2050_1250_6',
      material: 'PC',
      materialName: 'Poliwęglan Lity',
      width: 2050,
      height: 1250,
      thickness: 6,
      weight: 7.2,
      availability: 'stock',
      priceRange: '140-180',
      category: 'special',
      colors: ['transparentny', 'opal'],
      leadTime: '3-5 dni',
      minOrder: 1,
      cuttingFee: 30
    },

    // Dibond
    {
      id: 'dibond_3050_1530_3',
      material: 'Dibond',
      materialName: 'Dibond 3mm',
      width: 3050,
      height: 1530,
      thickness: 3,
      weight: 5.5,
      availability: 'stock',
      priceRange: '45-65',
      category: 'standard',
      colors: ['biały', 'srebrny szczotkowany', 'złoty szczotkowany', 'czarny mat', 'czerwony'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 18
    },
    {
      id: 'dibond_3050_1530_4',
      material: 'Dibond',
      materialName: 'Dibond 4mm',
      width: 3050,
      height: 1530,
      thickness: 4,
      weight: 7.3,
      availability: 'stock',
      priceRange: '65-85',
      category: 'standard',
      colors: ['biały', 'srebrny szczotkowany', 'złoty szczotkowany', 'czarny mat'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 22
    },
    {
      id: 'dibond_1530_3050_3',
      material: 'Dibond',
      materialName: 'Dibond 3mm',
      width: 1530,
      height: 3050,
      thickness: 3,
      weight: 5.5,
      availability: 'stock',
      priceRange: '45-65',
      category: 'vertical',
      colors: ['biały', 'srebrny szczotkowany', 'czarny mat'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 18
    },

    // PCV Spienione
    {
      id: 'pvc_3050_2030_3',
      material: 'PVC',
      materialName: 'PCV Spienione',
      width: 3050,
      height: 2030,
      thickness: 3,
      weight: 1.8,
      availability: 'stock',
      priceRange: '15-25',
      category: 'foam',
      colors: ['biały', 'czarny', 'czerwony', 'niebieski', 'zielony', 'żółty'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 10
    },
    {
      id: 'pvc_3050_2030_5',
      material: 'PVC',
      materialName: 'PCV Spienione',
      width: 3050,
      height: 2030,
      thickness: 5,
      weight: 3.0,
      availability: 'stock',
      priceRange: '25-35',
      category: 'foam',
      colors: ['biały', 'czarny', 'czerwony', 'niebieski', 'zielony'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 12
    },
    {
      id: 'pvc_3050_2030_10',
      material: 'PVC',
      materialName: 'PCV Spienione',
      width: 3050,
      height: 2030,
      thickness: 10,
      weight: 6.0,
      availability: 'stock',
      priceRange: '35-50',
      category: 'foam',
      colors: ['biały', 'czarny'],
      leadTime: '1-2 dni',
      minOrder: 1,
      cuttingFee: 15
    }
  ];

  const materials = [
    { id: 'all', name: 'Wszystkie materiały' },
    { id: 'PMMA', name: 'PMMA (Plexi)' },
    { id: 'PETG', name: 'PETG' },
    { id: 'PC', name: 'PC Lity' },
    { id: 'Dibond', name: 'Dibond' },
    { id: 'PVC', name: 'PCV Spienione' }
  ];

  const categories = [
    { id: 'all', name: 'Wszystkie' },
    { id: 'standard', name: 'Standardowe' },
    { id: 'thick', name: 'Grube (8mm+)' },
    { id: 'vertical', name: 'Orientacja pionowa' },
    { id: 'special', name: 'Specjalne' },
    { id: 'foam', name: 'Spienione' }
  ];

  const filteredSheets = sheetFormats.filter(sheet => {
    const matchesMaterial = selectedMaterial === 'all' || sheet.material === selectedMaterial;
    const matchesCategory = selectedCategory === 'all' || sheet.category === selectedCategory;
    return matchesMaterial && matchesCategory;
  });

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'stock':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            <CheckCircle className="w-3 h-3" />
            Na stanie
          </span>
        );
      case 'order':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
            <Clock className="w-3 h-3" />
            Na zamówienie
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
            <AlertTriangle className="w-3 h-3" />
            Niedostępny
          </span>
        );
    }
  };

  const calculateSheetArea = (width: number, height: number) => {
    return ((width * height) / 1000000).toFixed(2);
  };

  const calculateOptimalCuts = (sheetWidth: number, sheetHeight: number, partWidth: number, partHeight: number) => {
    const cutsX = Math.floor(sheetWidth / partWidth);
    const cutsY = Math.floor(sheetHeight / partHeight);
    return cutsX * cutsY;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Ruler className="w-10 h-10" />
          Formaty Arkuszy Tworzyw - Tuplex
        </h1>
        <p className="text-xl">Kompletny katalog dostępnych formatów i rozmiarów</p>
      </div>

      {/* Filtry */}
      <div className="bg-zinc-800 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Materiał</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
            >
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Kategoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">{filteredSheets.length}</div>
          <div className="text-sm text-gray-400">Dostępnych formatów</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">
            {filteredSheets.filter(s => s.availability === 'stock').length}
          </div>
          <div className="text-sm text-gray-400">Na stanie</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-400">
            {new Set(filteredSheets.map(s => s.material)).size}
          </div>
          <div className="text-sm text-gray-400">Typów materiałów</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.min(...filteredSheets.map(s => parseInt(s.priceRange.split('-')[0])))} - {Math.max(...filteredSheets.map(s => parseInt(s.priceRange.split('-')[1])))} zł
          </div>
          <div className="text-sm text-gray-400">Zakres cen/m²</div>
        </div>
      </div>

      {/* Lista arkuszy */}
      <div className="space-y-4">
        {filteredSheets.map((sheet) => (
          <div key={sheet.id} className="bg-zinc-800 rounded-lg p-6 hover:bg-zinc-700 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
              {/* Podstawowe info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">{sheet.materialName}</h3>
                  {getAvailabilityBadge(sheet.availability)}
                </div>
                <div className="text-gray-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <span>{sheet.width}×{sheet.height}×{sheet.thickness}mm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-gray-400" />
                    <span>Powierzchnia: {calculateSheetArea(sheet.width, sheet.height)} m²</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Waga: {sheet.weight} kg/m²
                  </div>
                </div>
              </div>

              {/* Ceny i dostępność */}
              <div>
                <div className="text-sm text-gray-400 mb-1">Cena za m²</div>
                <div className="text-lg font-bold text-green-400">{sheet.priceRange} zł</div>
                <div className="text-sm text-gray-400 mt-2">
                  <div className="flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    {sheet.leadTime}
                  </div>
                  <div className="mt-1">Min. zamówienie: {sheet.minOrder} szt</div>
                  <div>Cięcie: +{sheet.cuttingFee} zł</div>
                </div>
              </div>

              {/* Kolory */}
              <div>
                <div className="text-sm text-gray-400 mb-2">Dostępne kolory</div>
                <div className="flex flex-wrap gap-1">
                  {sheet.colors.slice(0, 3).map((color) => (
                    <span
                      key={color}
                      className="px-2 py-1 bg-zinc-600 text-gray-300 rounded text-xs"
                    >
                      {color}
                    </span>
                  ))}
                  {sheet.colors.length > 3 && (
                    <span className="px-2 py-1 bg-zinc-600 text-gray-300 rounded text-xs">
                      +{sheet.colors.length - 3} więcej
                    </span>
                  )}
                </div>
              </div>

              {/* Przykładowe cięcia */}
              <div>
                <div className="text-sm text-gray-400 mb-2">Przykładowe cięcia</div>
                <div className="space-y-1 text-sm text-gray-300">
                  <div>A4 (210×297): {calculateOptimalCuts(sheet.width, sheet.height, 210, 297)} szt</div>
                  <div>A3 (297×420): {calculateOptimalCuts(sheet.width, sheet.height, 297, 420)} szt</div>
                  <div>50×50cm: {calculateOptimalCuts(sheet.width, sheet.height, 500, 500)} szt</div>
                </div>
              </div>

              {/* Akcje */}
              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                  Dodaj do oferty
                </button>
                <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-zinc-600 transition-colors text-sm">
                  Kalkulator cięcia
                </button>
              </div>
            </div>

            {/* Rozszerzone informacje */}
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Zastosowania</div>
                  <div className="text-gray-300">
                    {sheet.material === 'PMMA' && 'Szyłdy, gabloty, ekspozytory, przeszkłenia'}
                    {sheet.material === 'PETG' && 'Osłony maszyn, displayy POS, termoformowanie'}
                    {sheet.material === 'PC' && 'Osłony przemysłowe, szyby bezpieczne, świetliki'}
                    {sheet.material === 'Dibond' && 'Szyłdy zewnętrzne, fasady, tablice reklamowe'}
                    {sheet.material === 'PVC' && 'Tablice informacyjne, displayy, modele'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Zalety materiału</div>
                  <div className="text-gray-300">
                    {sheet.material === 'PMMA' && 'Wysoka przezroczystość, odporność UV'}
                    {sheet.material === 'PETG' && 'Wysoka udarność, bezpieczny przy łamaniu'}
                    {sheet.material === 'PC' && 'Ekstremalna wytrzymałość, szeroki zakres temp.'}
                    {sheet.material === 'Dibond' && 'Płaskość, stabilność wymiarowa, lekkość'}
                    {sheet.material === 'PVC' && 'Niska waga, łatwość obróbki, ekonomiczny'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Uwagi techniczne</div>
                  <div className="text-gray-300">
                    {sheet.thickness <= 3 && 'Idealne do grawerowania i cięcia laserem'}
                    {sheet.thickness > 3 && sheet.thickness <= 6 && 'Optymalne do frezowania CNC'}
                    {sheet.thickness > 6 && 'Wymaga profesjonalnej obróbki'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Informacje dodatkowe */}
      <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <Info className="w-6 h-6" />
          Ważne informacje o formatach
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
          <div>
            <h4 className="font-semibold text-white mb-2">Tolerancje wymiarowe</h4>
            <ul className="space-y-1 text-sm">
              <li>• PMMA: ±0.2mm na grubość, ±2mm na wymiary</li>
              <li>• PETG: ±0.3mm na grubość, ±3mm na wymiary</li>
              <li>• PC: ±0.2mm na grubość, ±2mm na wymiary</li>
              <li>• Dibond: ±0.1mm na grubość, ±2mm na wymiary</li>
              <li>• PVC: ±0.3mm na grubość, ±3mm na wymiary</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Warunki dostawy</h4>
            <ul className="space-y-1 text-sm">
              <li>• Dostawa w folii ochronnej (PMMA, PC, PETG)</li>
              <li>• Transport dedykowany dla arkuszy &gt;2m</li>
              <li>• Możliwość cięcia na wymiar (+opłata)</li>
              <li>• Rabaty ilościowe od 10 arkuszy tego samego typu</li>
              <li>• Próbki materiałów dostępne na życzenie</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Kalkulator szybki */}
      <div className="mt-8 bg-zinc-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-orange-400" />
          Szybki kalkulator
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Szerokość detalu (mm)</label>
            <input type="number" placeholder="210" className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Wysokość detalu (mm)</label>
            <input type="number" placeholder="297" className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ilość sztuk</label>
            <input type="number" placeholder="100" className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white" />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
              Oblicz optymalny arkusz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetFormatsGuide;