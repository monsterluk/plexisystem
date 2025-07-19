// Baza danych parametrów frezowania dla PlexiSystem
// Na podstawie instrukcji dla frezerów

export interface MachiningParameter {
  material: string;
  materialCategory: string;
  toolDiameter: number; // mm
  rpm: { min: number; max: number };
  feedRate: { min: number; max: number }; // mm/min
  toolType: string;
  notes: string;
}

export interface SpecialTool {
  material: string;
  toolType: string;
  rpm: { min: number; max: number };
  feedRate: { min: number; max: number };
  application: string;
}

// Główna baza parametrów frezowania
export const MACHINING_PARAMETERS: MachiningParameter[] = [
  // TWORZYWA SZTUCZNE - PMMA (Pleksi)
  {
    material: "PMMA (Pleksi)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 2,
    rpm: { min: 20000, max: 24000 },
    feedRate: { min: 500, max: 1500 },
    toolType: "1-ostrzowy",
    notes: "Do konturów i drobnych detali"
  },
  {
    material: "PMMA (Pleksi)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 3,
    rpm: { min: 20000, max: 24000 },
    feedRate: { min: 500, max: 1200 },
    toolType: "1-ostrzowy",
    notes: "Delikatne detale, czysta krawędź"
  },
  {
    material: "PMMA (Pleksi)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 4,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 1200, max: 2500 },
    toolType: "1-ostrzowy",
    notes: "Standardowe kontury"
  },
  {
    material: "PMMA (Pleksi)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 6,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 1200, max: 2500 },
    toolType: "1-ostrzowy",
    notes: "Czysta krawędź, dobra przejrzystość"
  },
  {
    material: "PMMA (Pleksi)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 8,
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 2000, max: 3000 },
    toolType: "1-ostrzowy",
    notes: "Do grubszych formatów"
  },
  {
    material: "PMMA (Pleksi)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 10,
    rpm: { min: 12000, max: 16000 },
    feedRate: { min: 2000, max: 3500 },
    toolType: "1-ostrzowy lub MCD",
    notes: "Gładkie krawędzie, wolniejsze wykańczanie"
  },
  {
    material: "PMMA (Pleksi)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 12,
    rpm: { min: 10000, max: 16000 },
    feedRate: { min: 2400, max: 4000 },
    toolType: "MCD/PCD",
    notes: "Bardzo długa żywotność ostrza"
  },

  // PET-G
  {
    material: "PET-G",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 2,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 400, max: 1000 },
    toolType: "1-ostrzowy",
    notes: "Wolniejsze posunięcia, ostrożnie z temperaturą"
  },
  {
    material: "PET-G",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 3,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 600, max: 1200 },
    toolType: "1-ostrzowy",
    notes: "Kontrola temperatury"
  },
  {
    material: "PET-G",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 4,
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 1000, max: 2000 },
    toolType: "1-ostrzowy",
    notes: "Dobre odprowadzanie wiórów"
  },
  {
    material: "PET-G",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 6,
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 1000, max: 2000 },
    toolType: "1-ostrzowy",
    notes: "Lekka tendencja do topienia"
  },
  {
    material: "PET-G",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 8,
    rpm: { min: 12000, max: 16000 },
    feedRate: { min: 1800, max: 2700 },
    toolType: "1-ostrzowy",
    notes: "Stabilna praca"
  },
  {
    material: "PET-G",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 10,
    rpm: { min: 10000, max: 14000 },
    feedRate: { min: 1800, max: 2700 },
    toolType: "1-2 ostrzowy",
    notes: "Możliwe 2-ostrzowe przy dobrym chłodzeniu"
  },
  {
    material: "PET-G",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 12,
    rpm: { min: 10000, max: 14000 },
    feedRate: { min: 2200, max: 3200 },
    toolType: "1-2 ostrzowy",
    notes: "Duże formaty"
  },

  // PC (Poliwęglan)
  {
    material: "PC (Poliwęglan)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 2,
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 300, max: 800 },
    toolType: "1-ostrzowy",
    notes: "Materiał trudny, wolne posuwy"
  },
  {
    material: "PC (Poliwęglan)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 3,
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 500, max: 1000 },
    toolType: "1-ostrzowy",
    notes: "Ostre narzędzie konieczne"
  },
  {
    material: "PC (Poliwęglan)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 4,
    rpm: { min: 12000, max: 16000 },
    feedRate: { min: 800, max: 1600 },
    toolType: "1-ostrzowy",
    notes: "Częste sprawdzanie ostrza"
  },
  {
    material: "PC (Poliwęglan)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 6,
    rpm: { min: 12000, max: 16000 },
    feedRate: { min: 800, max: 1600 },
    toolType: "1-ostrzowy",
    notes: "Powolne wcinanie"
  },
  {
    material: "PC (Poliwęglan)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 8,
    rpm: { min: 10000, max: 14000 },
    feedRate: { min: 1400, max: 2100 },
    toolType: "1-ostrzowy",
    notes: "Stabilne parametry"
  },
  {
    material: "PC (Poliwęglan)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 10,
    rpm: { min: 8000, max: 12000 },
    feedRate: { min: 1400, max: 2100 },
    toolType: "1-ostrzowy lub MCD",
    notes: "MCD zalecane dla długich serii"
  },
  {
    material: "PC (Poliwęglan)",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 12,
    rpm: { min: 8000, max: 12000 },
    feedRate: { min: 1800, max: 2600 },
    toolType: "MCD/PCD",
    notes: "Najlepsza jakość krawędzi"
  },

  // HIPS
  {
    material: "HIPS",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 2,
    rpm: { min: 18000, max: 20000 },
    feedRate: { min: 600, max: 1200 },
    toolType: "1-ostrzowy",
    notes: "Dobre chłodzenie powietrzem"
  },
  {
    material: "HIPS",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 3,
    rpm: { min: 18000, max: 20000 },
    feedRate: { min: 900, max: 1800 },
    toolType: "1-ostrzowy",
    notes: "Łatwa obróbka"
  },
  {
    material: "HIPS",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 4,
    rpm: { min: 16000, max: 18000 },
    feedRate: { min: 1500, max: 3000 },
    toolType: "1-ostrzowy",
    notes: "Szybkie posuwy możliwe"
  },
  {
    material: "HIPS",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 6,
    rpm: { min: 15000, max: 18000 },
    feedRate: { min: 2700, max: 3600 },
    toolType: "1-ostrzowy",
    notes: "Płynna praca, mało zadziorów"
  },
  {
    material: "HIPS",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 8,
    rpm: { min: 14000, max: 16000 },
    feedRate: { min: 3600, max: 4500 },
    toolType: "1-2 ostrzowy",
    notes: "Wysoka wydajność"
  },
  {
    material: "HIPS",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 10,
    rpm: { min: 12000, max: 15000 },
    feedRate: { min: 4200, max: 5400 },
    toolType: "1-2 ostrzowy",
    notes: "Duże przekroje"
  },
  {
    material: "HIPS",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 12,
    rpm: { min: 12000, max: 15000 },
    feedRate: { min: 4800, max: 6000 },
    toolType: "1-2 ostrzowy",
    notes: "Do cięć długich formatów"
  },

  // PCW spienione
  {
    material: "PCW spienione",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 2,
    rpm: { min: 20000, max: 24000 },
    feedRate: { min: 800, max: 1600 },
    toolType: "1-ostrzowy",
    notes: "Bardzo szybka obróbka możliwa"
  },
  {
    material: "PCW spienione",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 3,
    rpm: { min: 20000, max: 24000 },
    feedRate: { min: 1200, max: 2400 },
    toolType: "1-ostrzowy",
    notes: "Minimalne opory skrawania"
  },
  {
    material: "PCW spienione",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 4,
    rpm: { min: 18000, max: 22000 },
    feedRate: { min: 2000, max: 4000 },
    toolType: "1-ostrzowy",
    notes: "Lekki materiał"
  },
  {
    material: "PCW spienione",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 6,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 3600, max: 5400 },
    toolType: "1-2 ostrzowy",
    notes: "Bardzo wysokie posuwy"
  },
  {
    material: "PCW spienione",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 8,
    rpm: { min: 15000, max: 18000 },
    feedRate: { min: 4800, max: 6400 },
    toolType: "2-ostrzowy",
    notes: "Efektywne usuwanie wiórów"
  },
  {
    material: "PCW spienione",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 10,
    rpm: { min: 14000, max: 16000 },
    feedRate: { min: 5600, max: 7200 },
    toolType: "2-ostrzowy",
    notes: "Maksymalna wydajność"
  },
  {
    material: "PCW spienione",
    materialCategory: "Tworzywa sztuczne",
    toolDiameter: 12,
    rpm: { min: 12000, max: 15000 },
    feedRate: { min: 6400, max: 8000 },
    toolType: "2-3 ostrzowy",
    notes: "Do dużych formatów"
  },

  // MATERIAŁY KOMPOZYTOWE - Dibond
  {
    material: "Dibond",
    materialCategory: "Materiały kompozytowe",
    toolDiameter: 2,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 600, max: 1200 },
    toolType: "1-ostrzowy",
    notes: "Ostrożnie z rdzeniem PE"
  },
  {
    material: "Dibond",
    materialCategory: "Materiały kompozytowe",
    toolDiameter: 3,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 900, max: 1800 },
    toolType: "1-ostrzowy",
    notes: "Kontrola głębokości"
  },
  {
    material: "Dibond",
    materialCategory: "Materiały kompozytowe",
    toolDiameter: 4,
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 1500, max: 3000 },
    toolType: "1-ostrzowy",
    notes: "Dobra ewakuacja wiórów"
  },
  {
    material: "Dibond",
    materialCategory: "Materiały kompozytowe",
    toolDiameter: 6,
    rpm: { min: 12000, max: 16000 },
    feedRate: { min: 2700, max: 4050 },
    toolType: "1-2 ostrzowy",
    notes: "Uwaga na delaminację"
  },
  {
    material: "Dibond",
    materialCategory: "Materiały kompozytowe",
    toolDiameter: 8,
    rpm: { min: 12000, max: 15000 },
    feedRate: { min: 3600, max: 5000 },
    toolType: "2-ostrzowy",
    notes: "Stabilne cięcie"
  },
  {
    material: "Dibond",
    materialCategory: "Materiały kompozytowe",
    toolDiameter: 10,
    rpm: { min: 10000, max: 14000 },
    feedRate: { min: 4200, max: 5600 },
    toolType: "2-ostrzowy",
    notes: "Do dużych konturów"
  },
  {
    material: "Dibond",
    materialCategory: "Materiały kompozytowe",
    toolDiameter: 12,
    rpm: { min: 10000, max: 12000 },
    feedRate: { min: 4800, max: 6400 },
    toolType: "2-3 ostrzowy",
    notes: "Maksymalna wydajność"
  },

  // MATERIAŁY DREWNOPOCHODNE - Sklejka
  {
    material: "Sklejka",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 2,
    rpm: { min: 18000, max: 22000 },
    feedRate: { min: 800, max: 1600 },
    toolType: "2-ostrzowy",
    notes: "Małe detale, możliwe wyrwania"
  },
  {
    material: "Sklejka",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 3,
    rpm: { min: 18000, max: 22000 },
    feedRate: { min: 1200, max: 2400 },
    toolType: "2-ostrzowy",
    notes: "Ostrożnie przy krawędziach"
  },
  {
    material: "Sklejka",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 4,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 2000, max: 4000 },
    toolType: "2-ostrzowy",
    notes: "Standardowe kontury"
  },
  {
    material: "Sklejka",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 6,
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 3600, max: 5400 },
    toolType: "2-3 ostrzowy",
    notes: "Dobra jakość krawędzi"
  },
  {
    material: "Sklejka",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 8,
    rpm: { min: 12000, max: 16000 },
    feedRate: { min: 4800, max: 6400 },
    toolType: "3-ostrzowy",
    notes: "Szybka obróbka"
  },
  {
    material: "Sklejka",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 10,
    rpm: { min: 10000, max: 14000 },
    feedRate: { min: 5600, max: 7200 },
    toolType: "3-ostrzowy lub kompresyjny",
    notes: "Kompresyjny = czyste krawędzie"
  },
  {
    material: "Sklejka",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 12,
    rpm: { min: 8000, max: 12000 },
    feedRate: { min: 6400, max: 8000 },
    toolType: "3-4 ostrzowy",
    notes: "Maksymalna wydajność"
  },

  // MDF
  {
    material: "MDF",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 2,
    rpm: { min: 20000, max: 24000 },
    feedRate: { min: 1000, max: 2000 },
    toolType: "2-ostrzowy",
    notes: "Dużo pyłu, odsysanie konieczne"
  },
  {
    material: "MDF",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 3,
    rpm: { min: 20000, max: 24000 },
    feedRate: { min: 1500, max: 3000 },
    toolType: "2-ostrzowy",
    notes: "Łatwa obróbka"
  },
  {
    material: "MDF",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 4,
    rpm: { min: 18000, max: 22000 },
    feedRate: { min: 2500, max: 5000 },
    toolType: "2-ostrzowy",
    notes: "Wysokie posuwy możliwe"
  },
  {
    material: "MDF",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 6,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 4500, max: 6750 },
    toolType: "2-3 ostrzowy",
    notes: "Stabilna praca"
  },
  {
    material: "MDF",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 8,
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 6000, max: 8000 },
    toolType: "3-ostrzowy",
    notes: "Efektywne odprowadzanie wiórów"
  },
  {
    material: "MDF",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 10,
    rpm: { min: 12000, max: 16000 },
    feedRate: { min: 7000, max: 9000 },
    toolType: "3-ostrzowy",
    notes: "Duża wydajność"
  },
  {
    material: "MDF",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 12,
    rpm: { min: 10000, max: 14000 },
    feedRate: { min: 8000, max: 10000 },
    toolType: "3-4 ostrzowy",
    notes: "Maksymalne posuwy"
  },

  // Płyta meblowa
  {
    material: "Płyta meblowa",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 2,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 600, max: 1200 },
    toolType: "2-ostrzowy",
    notes: "Uwaga na laminat"
  },
  {
    material: "Płyta meblowa",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 3,
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 900, max: 1800 },
    toolType: "2-ostrzowy",
    notes: "Ryzyko odpryskiwania"
  },
  {
    material: "Płyta meblowa",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 4,
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 1500, max: 3000 },
    toolType: "2-ostrzowy",
    notes: "Ostrożne wcinanie"
  },
  {
    material: "Płyta meblowa",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 6,
    rpm: { min: 12000, max: 16000 },
    feedRate: { min: 2700, max: 4050 },
    toolType: "kompresyjny",
    notes: "Najlepsza jakość krawędzi"
  },
  {
    material: "Płyta meblowa",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 8,
    rpm: { min: 12000, max: 15000 },
    feedRate: { min: 3600, max: 4800 },
    toolType: "kompresyjny",
    notes: "Bez wyrwań laminatu"
  },
  {
    material: "Płyta meblowa",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 10,
    rpm: { min: 10000, max: 14000 },
    feedRate: { min: 4200, max: 5400 },
    toolType: "kompresyjny",
    notes: "Do formatowania"
  },
  {
    material: "Płyta meblowa",
    materialCategory: "Materiały drewnopochodne",
    toolDiameter: 12,
    rpm: { min: 8000, max: 12000 },
    feedRate: { min: 4800, max: 6000 },
    toolType: "kompresyjny",
    notes: "Duże formaty"
  }
];

// Frezy specjalne
export const SPECIAL_TOOLS: SpecialTool[] = [
  {
    material: "PMMA / Dibond",
    toolType: "V 3–6 (stożkowy 45°)",
    rpm: { min: 16000, max: 20000 },
    feedRate: { min: 800, max: 1500 },
    application: "Fazowanie krawędzi, do składania 45°"
  },
  {
    material: "PMMA / PC",
    toolType: "2mm rowkowy prosty",
    rpm: { min: 20000, max: 24000 },
    feedRate: { min: 500, max: 1200 },
    application: "Rowek pod taśmę LED, gł. 2–4 mm"
  },
  {
    material: "PMMA / PC",
    toolType: "3mm rowkowy półokrągły",
    rpm: { min: 18000, max: 22000 },
    feedRate: { min: 800, max: 1500 },
    application: "Pod profil LED Ø 5 mm, LEDON dekor"
  },
  {
    material: "MDF / Sklejka / PC",
    toolType: "6mm płaski spiralny",
    rpm: { min: 14000, max: 18000 },
    feedRate: { min: 2000, max: 3500 },
    application: "Kieszenie, rowki płaskodenne"
  },
  {
    material: "MDF / Sklejka / PC",
    toolType: "V-frez 90° x 12",
    rpm: { min: 12000, max: 16000 },
    feedRate: { min: 1500, max: 2500 },
    application: "Grawerowanie V, napisy"
  }
];

// Wskazówki i zalecenia
export const MACHINING_TIPS = {
  cooling: {
    plastics: "Chłodzenie powietrzem 4-6 bar, nigdy nie używaj chłodziwa na bazie wody dla pleksi",
    composites: "Dobre odsysanie wiórów konieczne",
    wood: "Odsysanie pyłu obowiązkowe, szczególnie dla MDF"
  },
  toolSelection: {
    singleFlute: "Idealne do pleksi - minimalne ryzyko topienia",
    doubleFlute: "Do szybszej obróbki grubszych materiałów",
    compression: "Najlepsze dla płyt laminowanych - czyste krawędzie"
  },
  safety: [
    "Noś okulary ochronne - wióry pleksi są ostre",
    "Używaj osłon na frezarkę",
    "Zapewnij dobrą wentylację stanowiska",
    "Regularnie usuwaj wióry z obszaru pracy",
    "Nie dotykaj gorących elementów po obróbce"
  ],
  troubleshooting: [
    {
      problem: "Topienie materiału",
      cause: "Za wysokie obroty lub za wolny posuw",
      solution: "Zmniejsz obroty, zwiększ posuw, popraw chłodzenie"
    },
    {
      problem: "Chropowate krawędzie",
      cause: "Tępe narzędzie lub nieprawidłowe parametry",
      solution: "Wymień frez, dostosuj parametry skrawania"
    },
    {
      problem: "Pękanie materiału",
      cause: "Za duża głębokość skrawania",
      solution: "Zmniejsz głębokość, wykonuj więcej przejść"
    },
    {
      problem: "Wibracje podczas cięcia",
      cause: "Słabe mocowanie lub za długie narzędzie",
      solution: "Popraw mocowanie, użyj krótszego freza"
    }
  ]
};

// Funkcje pomocnicze
export function getMachiningParameters(material: string, toolDiameter: number): MachiningParameter | undefined {
  return MACHINING_PARAMETERS.find(
    param => param.material === material && param.toolDiameter === toolDiameter
  );
}

export function getMaterialsByCategory(category: string): string[] {
  const materials = MACHINING_PARAMETERS
    .filter(param => param.materialCategory === category)
    .map(param => param.material);
  return [...new Set(materials)];
}

export function getAvailableToolDiameters(material: string): number[] {
  return MACHINING_PARAMETERS
    .filter(param => param.material === material)
    .map(param => param.toolDiameter)
    .sort((a, b) => a - b);
}

export function calculateChipLoad(feedRate: number, rpm: number, flutes: number): number {
  // Posuw na ostrze [mm/ostrze]
  return feedRate / (rpm * flutes);
}

export function calculateOptimalFeedRate(chipLoad: number, rpm: number, flutes: number): number {
  // Prędkość posuwu [mm/min] = posuw na ostrze × RPM × liczba ostrzy
  return chipLoad * rpm * flutes;
}

export function getRecommendedDepthOfCut(material: string, toolDiameter: number): number {
  // Głębokość skrawania zależy od materiału i średnicy narzędzia
  const depthFactors: Record<string, number> = {
    "PMMA (Pleksi)": 0.5, // 50% średnicy narzędzia
    "PET-G": 0.4,
    "PC (Poliwęglan)": 0.3,
    "HIPS": 0.7,
    "PCW spienione": 1.0,
    "Dibond": 0.6,
    "Sklejka": 0.8,
    "MDF": 1.0,
    "Płyta meblowa": 0.5
  };
  
  const factor = depthFactors[material] || 0.5;
  return toolDiameter * factor;
}