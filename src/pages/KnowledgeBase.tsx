import React, { useState } from 'react';
import { Book, ChevronRight, Search, FileText, Tool, Wrench, Layers, Package, Info } from 'lucide-react';

interface KnowledgeCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: KnowledgeItem[];
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  details?: string[];
  specifications?: Record<string, string>;
}

const knowledgeData: KnowledgeCategory[] = [
  {
    id: 'materials',
    title: 'Tworzywa',
    icon: <Layers className="w-5 h-5" />,
    items: [
      {
        id: 'plexi-clear',
        title: 'Plexi bezbarwna (PMMA)',
        content: 'Polimetakrylan metylu - termoplastyczny polimer o doskonałej przezroczystości optycznej.',
        details: [
          'Przepuszczalność światła: 92%',
          'Odporność na UV: dobra (z dodatkami stabilizatorów)',
          'Temperatura użytkowania: -40°C do +80°C',
          'Temperatura mięknienia: ~100°C',
          'Gęstość: 1.19 g/cm³'
        ],
        specifications: {
          'Wytrzymałość na rozciąganie': '70-80 MPa',
          'Moduł Younga': '3300 MPa',
          'Wydłużenie przy zerwaniu': '4-5%',
          'Twardość': '90 HRM'
        }
      },
      {
        id: 'plexi-white',
        title: 'Plexi mleczna',
        content: 'PMMA z dodatkiem pigmentów rozpraszających światło, idealna do podświetleń LED.',
        details: [
          'Przepuszczalność światła: 30-70% (zależnie od grubości)',
          'Równomierne rozproszenie światła',
          'Idealna do kaset świetlnych',
          'Maskuje źródła światła LED'
        ]
      },
      {
        id: 'petg',
        title: 'PET-G',
        content: 'Glikol politereftalanu etylenu - bardzo wytrzymały termoplast z doskonałą odpornością chemiczną.',
        details: [
          'Wysoka odporność na uderzenia',
          'Odporność chemiczna lepsza niż PMMA',
          'Łatwa obróbka i termoformowanie',
          'Temperatura użytkowania: -40°C do +70°C',
          'Gęstość: 1.27 g/cm³'
        ],
        specifications: {
          'Wytrzymałość na rozciąganie': '50 MPa',
          'Moduł Younga': '2000 MPa',
          'Wydłużenie przy zerwaniu': '120%',
          'Odporność na uderzenia': 'Bardzo wysoka'
        }
      },
      {
        id: 'hips',
        title: 'HIPS',
        content: 'Polistyren wysokoudarowy - ekonomiczny materiał do zastosowań wewnętrznych.',
        details: [
          'Dobra sztywność',
          'Łatwa obróbka mechaniczna',
          'Niska cena',
          'Ograniczona odporność UV',
          'Gęstość: 1.05 g/cm³'
        ]
      },
      {
        id: 'pc',
        title: 'Poliwęglan (PC)',
        content: 'Najwyższa odporność na uderzenia wśród tworzyw przezroczystych.',
        details: [
          'Praktycznie niezniszczalny',
          'Temperatura użytkowania: -40°C do +120°C',
          'Odporność ogniowa',
          'Gęstość: 1.20 g/cm³',
          'Wymagana suszenie przed obróbką'
        ],
        specifications: {
          'Wytrzymałość na rozciąganie': '60-70 MPa',
          'Moduł Younga': '2300 MPa',
          'Wydłużenie przy zerwaniu': '100-150%',
          'Odporność na uderzenia Izod': '600-850 J/m'
        }
      },
      {
        id: 'dibond',
        title: 'Dibond',
        content: 'Płyta kompozytowa składająca się z rdzenia PE i okładzin aluminiowych.',
        details: [
          'Sztywność przy niskiej wadze',
          'Doskonała płaskość powierzchni',
          'Łatwe frezowanie kształtów',
          'Odporność na warunki atmosferyczne',
          'Grubości: 3mm, 4mm'
        ]
      }
    ]
  },
  {
    id: 'tools',
    title: 'Narzędzia i frezy',
    icon: <Tool className="w-5 h-5" />,
    items: [
      {
        id: 'mill-single-flute',
        title: 'Frez jednozębny',
        content: 'Podstawowy frez do tworzyw sztucznych, zapewnia dobre odprowadzanie wiórów.',
        details: [
          'Średnice: 3, 4, 6, 8, 10 mm',
          'Prędkość skrawania: 100-200 m/min',
          'Posuw: 0.1-0.3 mm/ząb',
          'Idealne do konturów i wycinania'
        ],
        specifications: {
          'Materiał': 'Węglik spiekany',
          'Kąt spirali': '0-10°',
          'Powłoka': 'Bez powłoki lub TiN',
          'Zastosowanie': 'PMMA, PET-G, HIPS'
        }
      },
      {
        id: 'mill-two-flute',
        title: 'Frez dwuzębny',
        content: 'Uniwersalny frez do większości tworzyw, dobry kompromis między jakością a wydajnością.',
        details: [
          'Lepsza jakość powierzchni niż jednozębny',
          'Szybsze posuwy robocze',
          'Wymaga dobrego odprowadzania wiórów',
          'Średnice: 2-12 mm'
        ]
      },
      {
        id: 'mill-oring',
        title: 'Frez O-ring',
        content: 'Specjalny frez z jednym ostrzem tnącym, idealny do tworzyw miękkich i lepkich.',
        details: [
          'Brak zatykania się wiórami',
          'Doskonały do PC i PET-G',
          'Niskie siły skrawania',
          'Minimalne nagrzewanie materiału'
        ]
      },
      {
        id: 'mill-diamond',
        title: 'Frez diamentowy',
        content: 'Najwyższa jakość krawędzi, szczególnie przy PMMA.',
        details: [
          'Polerowana jakość krawędzi',
          'Długa żywotność narzędzia',
          'Wysoki koszt początkowy',
          'Tylko do PMMA i PC'
        ],
        specifications: {
          'Powłoka': 'Diament polikrystaliczny',
          'Trwałość': '50x dłuższa niż węglik',
          'Prędkość skrawania': '300-500 m/min',
          'Jakość Ra': '<0.4 μm'
        }
      }
    ]
  },
  {
    id: 'processing',
    title: 'Obróbka i technologie',
    icon: <Wrench className="w-5 h-5" />,
    items: [
      {
        id: 'cnc-routing',
        title: 'Frezowanie CNC',
        content: 'Podstawowa technologia obróbki tworzyw sztucznych.',
        details: [
          'Dokładność pozycjonowania: ±0.05 mm',
          'Powtarzalność: ±0.02 mm',
          'Maksymalne obroty: 24000 RPM',
          'Chłodzenie: sprężone powietrze lub mgła olejowa'
        ],
        specifications: {
          'Obszar roboczy': '2500 x 1300 mm',
          'Grubość materiału': 'do 50 mm',
          'Prędkość posuwu': 'do 50 m/min',
          'System mocowania': 'Vacuum lub zaciski'
        }
      },
      {
        id: 'laser-cutting',
        title: 'Cięcie laserowe',
        content: 'Precyzyjne cięcie z polerowaną krawędzią.',
        details: [
          'Idealne do PMMA',
          'Krawędź gotowa optycznie',
          'Ograniczone do 20-25mm grubości',
          'Nie nadaje się do PVC (toksyczne opary)'
        ]
      },
      {
        id: 'bending',
        title: 'Gięcie na gorąco',
        content: 'Formowanie kątów i krzywizn w tworzywach termoplastycznych.',
        details: [
          'Temperatura gięcia PMMA: 150-170°C',
          'Temperatura gięcia PET-G: 120-140°C',
          'Minimalny promień: 1.5x grubość materiału',
          'Czas nagrzewania: 1 min/mm grubości'
        ]
      },
      {
        id: 'gluing',
        title: 'Klejenie',
        content: 'Łączenie elementów z tworzyw sztucznych.',
        details: [
          'PMMA: kleje polimeryzujące (Acrifix)',
          'PET-G: kleje dwuskładnikowe',
          'PC: kleje strukturalne',
          'Czas utwardzania: 24-48h do pełnej wytrzymałości'
        ]
      }
    ]
  },
  {
    id: 'applications',
    title: 'Zastosowania',
    icon: <Package className="w-5 h-5" />,
    items: [
      {
        id: 'pos-displays',
        title: 'Ekspozytory POS',
        content: 'Materiały reklamowe w punktach sprzedaży.',
        details: [
          'Stojaki na ulotki',
          'Ekspozytory kosmetyczne',
          'Standy produktowe',
          'Displaye ladowe'
        ],
        specifications: {
          'Typowe materiały': 'PMMA 3-5mm, PET-G 2-3mm',
          'Wykończenie': 'Polerowanie, druk UV',
          'Mocowanie': 'Magnesy, taśma VHB',
          'Trwałość': '2-5 lat'
        }
      },
      {
        id: 'signage',
        title: 'Oznakowanie',
        content: 'Tablice informacyjne, szyldy, oznaczenia.',
        details: [
          'Litery przestrzenne',
          'Kasetony świetlne',
          'Tablice kierunkowe',
          'Oznakowanie bezpieczeństwa'
        ]
      },
      {
        id: 'protective',
        title: 'Osłony ochronne',
        content: 'Zabezpieczenia maszyn, osłony przeciwwirusowe.',
        details: [
          'Osłony maszyn CNC',
          'Ekrany ochronne COVID',
          'Obudowy urządzeń',
          'Osłony przeciwbryzgowe'
        ]
      }
    ]
  }
];

export const KnowledgeBase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = knowledgeData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Book className="w-8 h-8 text-orange-500" />
          Baza Wiedzy Technicznej
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kompendium wiedzy o tworzywach sztucznych, narzędziach i technologiach obróbki
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Szukaj w bazie wiedzy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories list */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Kategorie</h2>
            <div className="space-y-2">
              {filteredCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedItem(null);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    selectedCategory?.id === category.id
                      ? 'bg-orange-500 text-white'
                      : 'hover:bg-zinc-700'
                  }`}
                >
                  {category.icon}
                  <span className="flex-1 text-left">{category.title}</span>
                  <span className="text-sm opacity-70">({category.items.length})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items list */}
        {selectedCategory && (
          <div className="lg:col-span-1">
            <div className="bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{selectedCategory.title}</h2>
              <div className="space-y-2">
                {selectedCategory.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedItem?.id === item.id
                        ? 'bg-zinc-700 border border-orange-500'
                        : 'hover:bg-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.content}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detail view */}
        {selectedItem && (
          <div className="lg:col-span-1">
            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-6 h-6 text-orange-500 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold">{selectedItem.title}</h2>
                  <p className="text-gray-400 mt-2">{selectedItem.content}</p>
                </div>
              </div>

              {selectedItem.details && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Szczegóły
                  </h3>
                  <ul className="space-y-2">
                    {selectedItem.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedItem.specifications && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Specyfikacja techniczna
                  </h3>
                  <div className="bg-zinc-700 rounded-lg p-4">
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(selectedItem.specifications).map(([key, value], index) => (
                          <tr key={key} className={index > 0 ? 'border-t border-zinc-600' : ''}>
                            <td className="py-2 text-gray-400">{key}:</td>
                            <td className="py-2 text-right font-medium">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">💡 Szybkie wskazówki</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Wybór materiału:</strong> PMMA dla przezroczystości, PET-G dla wytrzymałości, 
            PC dla ekstremalnych obciążeń, HIPS dla ekonomicznych rozwiązań.
          </div>
          <div>
            <strong>Parametry obróbki:</strong> Zawsze rozpoczynaj od zalecanych parametrów i 
            dostosowuj w zależności od konkretnej maszyny i materiału.
          </div>
        </div>
      </div>
    </div>
  );
};