import React, { useState } from 'react';
import { ShoppingCart, Star, Clock, Package, Eye, Edit, Heart, TrendingUp, Award, Filter, Search, Palette, Shield, ClipboardList, Coffee, Briefcase, HardHat, Megaphone, Box, Sparkles, Hand, Utensils, Cake, Grid3x3, Table2, Factory, Cpu, Building, Lightbulb, Mail, FileText, Gift } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  icon: React.ReactNode;
  soldCount: number;
  rating: number;
  deliveryDays: number;
  description: string;
  features: string[];
  customizable: boolean;
  bestseller?: boolean;
  materials?: string;
  dimensions?: string;
}

// Komponenty ikon dla produktów
const ProductIcons = {
  NailDisplay: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-8">
      <div className="relative">
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`w-8 h-12 rounded-full ${['bg-pink-400', 'bg-purple-400', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-indigo-400', 'bg-violet-400'][i]}`} />
          ))}
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />
      </div>
    </div>
  ),
  
  CosmeticsOrganizer: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 p-8">
      <div className="relative">
        <div className="bg-white/80 p-4 rounded-lg shadow-lg">
          <div className="grid grid-cols-3 gap-2">
            <div className="w-8 h-8 bg-pink-300 rounded" />
            <div className="w-8 h-8 bg-rose-300 rounded-full" />
            <div className="w-8 h-8 bg-purple-300 rounded" />
            <div className="w-8 h-10 bg-red-300 rounded" />
            <div className="w-8 h-10 bg-pink-400 rounded" />
            <div className="w-8 h-10 bg-rose-400 rounded" />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-12 h-8 bg-gray-300 rounded" />
      </div>
    </div>
  ),
  
  ReceptionShield: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 p-8">
      <div className="relative">
        <Shield className="w-24 h-24 text-blue-500" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-white rounded border-2 border-blue-400" />
      </div>
    </div>
  ),
  
  Dispenser: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-100 p-8">
      <div className="relative">
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="w-16 h-20 bg-teal-400 rounded-t-lg" />
          <div className="w-16 h-4 bg-teal-600 rounded-b-lg" />
          <Hand className="absolute -right-2 top-4 w-8 h-8 text-teal-600" />
        </div>
      </div>
    </div>
  ),
  
  MenuLED: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 p-8">
      <div className="relative">
        <ClipboardList className="w-20 h-20 text-orange-500" />
        <div className="absolute inset-0 animate-pulse">
          <div className="w-full h-full border-4 border-yellow-400 rounded-lg opacity-50" />
        </div>
      </div>
    </div>
  ),
  
  TableSeparator: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-100 p-8">
      <div className="relative">
        <div className="flex space-x-4">
          <Table2 className="w-12 h-12 text-amber-600" />
          <div className="w-1 h-20 bg-amber-800 rounded" />
          <Table2 className="w-12 h-12 text-amber-600" />
        </div>
      </div>
    </div>
  ),
  
  DessertDisplay: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-yellow-100 p-8">
      <div className="relative">
        <div className="space-y-2">
          <Cake className="w-16 h-8 text-pink-500" />
          <Cake className="w-16 h-8 text-yellow-500" />
          <Cake className="w-16 h-8 text-orange-500" />
        </div>
        <div className="absolute inset-0 border-2 border-gray-400 rounded-lg" />
      </div>
    </div>
  ),
  
  OfficeOrganizer: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-8">
      <div className="grid grid-cols-2 gap-2">
        <Briefcase className="w-10 h-10 text-gray-600" />
        <FileText className="w-10 h-10 text-blue-600" />
        <Mail className="w-10 h-10 text-gray-600" />
        <Grid3x3 className="w-10 h-10 text-blue-600" />
      </div>
    </div>
  ),
  
  KanbanBoard: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 p-8">
      <div className="grid grid-cols-4 gap-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`w-6 h-8 rounded ${i % 3 === 0 ? 'bg-purple-400' : i % 3 === 1 ? 'bg-indigo-400' : 'bg-blue-400'}`} />
        ))}
      </div>
    </div>
  ),
  
  MachineShield: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 p-8">
      <div className="relative">
        <Factory className="w-20 h-20 text-gray-700" />
        <Shield className="absolute -top-2 -right-2 w-12 h-12 text-blue-600" />
      </div>
    </div>
  ),
  
  PLCEnclosure: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-green-100 p-8">
      <div className="relative">
        <div className="bg-gray-300 p-4 rounded-lg">
          <Cpu className="w-16 h-16 text-green-600" />
        </div>
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs px-2 py-1 rounded">IP65</div>
      </div>
    </div>
  ),
  
  Letters3D: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="relative">
        <div className="text-6xl font-bold text-purple-600 transform perspective-100 rotate-y-12">ABC</div>
        <Lightbulb className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 text-yellow-500 animate-pulse" />
      </div>
    </div>
  ),
  
  DibondSign: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-black p-8">
      <div className="relative">
        <Building className="w-20 h-20 text-gray-700" />
        <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-gray-600 to-gray-800" />
      </div>
    </div>
  ),
  
  VotingBox: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100 p-8">
      <div className="relative">
        <Box className="w-20 h-20 text-gray-600" />
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800" />
        <Mail className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 text-blue-600" />
      </div>
    </div>
  ),
  
  BrochureStand: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-8">
      <div className="relative">
        <div className="space-y-1">
          {[...Array(4)].map((_, i) => (
            <FileText key={i} className="w-12 h-8 text-blue-500" style={{ marginLeft: `${i * 4}px` }} />
          ))}
        </div>
      </div>
    </div>
  ),
  
  GiftBox: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-100 p-8">
      <div className="relative">
        <Gift className="w-20 h-20 text-red-500" />
        <div className="absolute top-0 right-0 text-2xl">🎀</div>
      </div>
    </div>
  )
};

const projects: Project[] = [
  // Beauty & Kosmetyka
  {
    id: '1',
    name: 'Display Lakierów RAINBOW 60',
    category: 'beauty',
    price: 549,
    oldPrice: 649,
    icon: <ProductIcons.NailDisplay />,
    soldCount: 523,
    rating: 4.8,
    deliveryDays: 3,
    description: 'Elegancki, schodkowy ekspozytor na 60 butelek lakieru.',
    features: ['6 poziomów po 10 miejsc', 'Antypoślizgowe rowki', 'Możliwość stackowania'],
    materials: 'PMMA 5mm crystal clear',
    dimensions: '40x30x35cm',
    customizable: true,
    bestseller: true
  },
  {
    id: '15',
    name: 'Organizer Kosmetyków GLAM',
    category: 'beauty',
    price: 380,
    icon: <ProductIcons.CosmeticsOrganizer />,
    soldCount: 234,
    rating: 4.7,
    deliveryDays: 3,
    description: 'Luksusowy organizer z lustrzanym tłem.',
    features: ['24 przegródki', 'Lustro w zestawie', '3 szufladki'],
    materials: 'PMMA + lustro akrylowe',
    dimensions: '30x20x25cm',
    customizable: true
  },
  
  // Medycyna
  {
    id: '2',
    name: 'Osłona Recepcji MEDICAL',
    category: 'medical',
    price: 450,
    icon: <ProductIcons.ReceptionShield />,
    soldCount: 156,
    rating: 4.9,
    deliveryDays: 5,
    description: 'Profesjonalna osłona dla przychodni z okienkiem podawczym.',
    features: ['Okienko 30x20cm', 'Półka na dokumenty', 'Stabilne nóżki'],
    materials: 'PMMA 5mm lub PETG 4mm',
    dimensions: '120x80cm (standard)',
    customizable: true
  },
  {
    id: '6',
    name: 'Dystrybutor Płynu TOUCH-FREE',
    category: 'medical',
    price: 180,
    icon: <ProductIcons.Dispenser />,
    soldCount: 678,
    rating: 4.9,
    deliveryDays: 2,
    description: 'Bezdotykowy dystrybutor na łokieć.',
    features: ['Mechanizm na łokieć', 'Pojemność 1L', 'Logo w cenie'],
    materials: 'PMMA + PETG',
    dimensions: '15x15x40cm',
    customizable: true,
    bestseller: true
  },
  
  // Gastronomia
  {
    id: '3',
    name: 'Menu LED Gastro PRO',
    category: 'gastro',
    price: 320,
    icon: <ProductIcons.MenuLED />,
    soldCount: 89,
    rating: 4.7,
    deliveryDays: 4,
    description: 'Podświetlane menu A4 dla restauracji i kawiarni.',
    features: ['Podświetlenie LED', 'Wymienne wkładki', 'Format A4'],
    materials: 'PMMA 5mm + LED',
    dimensions: 'A4 (21x29.7cm)',
    customizable: true
  },
  {
    id: '5',
    name: 'Separator Stolików ELEGANT',
    category: 'gastro',
    price: 280,
    icon: <ProductIcons.TableSeparator />,
    soldCount: 312,
    rating: 4.8,
    deliveryDays: 2,
    description: 'Elegancki separator dla restauracji.',
    features: ['Stabilna podstawa', '3 rozmiary', 'Łatwy montaż'],
    materials: 'PMMA 8mm przezroczysta',
    dimensions: '120x60cm, 150x60cm, 180x60cm',
    customizable: false
  },
  {
    id: '7',
    name: 'Ekspozytor Deserów SWEET 3',
    category: 'gastro',
    price: 420,
    icon: <ProductIcons.DessertDisplay />,
    soldCount: 45,
    rating: 4.5,
    deliveryDays: 4,
    description: '3-poziomowy ekspozytor z pokrywą.',
    features: ['3 poziomy', 'Pokrywa w zestawie', 'Łatwe czyszczenie'],
    materials: 'PMMA 5mm + PETG',
    dimensions: '40x30x40cm',
    customizable: false
  },
  
  // Biuro
  {
    id: '4',
    name: 'Organizer Biurowy OFFICE 5',
    category: 'office',
    price: 450,
    icon: <ProductIcons.OfficeOrganizer />,
    soldCount: 234,
    rating: 4.6,
    deliveryDays: 3,
    description: 'Modułowy system organizacji biurka - 5 elementów.',
    features: ['5 modułów', 'Możliwość stackowania', 'Grawer logo w cenie'],
    materials: 'PMMA 3mm satynowa',
    dimensions: 'Modułowy system',
    customizable: true
  },
  {
    id: '16',
    name: 'Tablica KANBAN Magnetic',
    category: 'office',
    price: 680,
    icon: <ProductIcons.KanbanBoard />,
    soldCount: 67,
    rating: 4.8,
    deliveryDays: 5,
    description: 'Magnetyczna tablica do zarządzania projektami.',
    features: ['4 kolumny', 'Magnesy w zestawie', 'Markery sucho ścieralne'],
    materials: 'PMMA 5mm + folia magnetyczna',
    dimensions: '100x70cm',
    customizable: true
  },
  
  // Przemysł
  {
    id: '9',
    name: 'Osłona Tokarki SHIELD PRO',
    category: 'industry',
    price: 890,
    icon: <ProductIcons.MachineShield />,
    soldCount: 45,
    rating: 5.0,
    deliveryDays: 7,
    description: 'Wytrzymała osłona z poliwęglanu 8mm.',
    features: ['PC 8mm', 'Zawiasy przemysłowe', 'Norma CE'],
    materials: 'Poliwęglan lity 8mm',
    dimensions: 'Na wymiar',
    customizable: true
  },
  {
    id: '10',
    name: 'Obudowa Sterownika PLC',
    category: 'industry',
    price: 320,
    icon: <ProductIcons.PLCEnclosure />,
    soldCount: 128,
    rating: 4.7,
    deliveryDays: 5,
    description: 'Szczelna obudowa IP65 dla elektroniki.',
    features: ['Szczelność IP65', 'Otwory kablowe', 'Montaż DIN'],
    materials: 'PETG 4mm lub PC 5mm',
    dimensions: '40x30x20cm',
    customizable: true
  },
  
  // Reklama
  {
    id: '11',
    name: 'Litery 3D LOGO Light',
    category: 'advertising',
    price: 1200,
    icon: <ProductIcons.Letters3D />,
    soldCount: 89,
    rating: 4.9,
    deliveryDays: 10,
    description: 'Podświetlane litery przestrzenne.',
    features: ['LED w cenie', 'Wysokość do 50cm', 'Montaż gratis'],
    materials: 'PMMA + PCV + LED',
    dimensions: 'Do 50cm wysokości',
    customizable: true,
    bestseller: true
  },
  {
    id: '12',
    name: 'Szyld Dibond PRESTIGE',
    category: 'advertising',
    price: 450,
    icon: <ProductIcons.DibondSign />,
    soldCount: 345,
    rating: 4.8,
    deliveryDays: 5,
    description: 'Elegancki szyld z dibondu szczotkowanego.',
    features: ['Dibond 3mm', 'Frezowanie CNC', 'Dystanse w zestawie'],
    materials: 'Dibond 3mm',
    dimensions: 'Do 200x100cm',
    customizable: true
  },
  
  // Uniwersalne
  {
    id: '8',
    name: 'Urna Konkursowa VOTE',
    category: 'universal',
    price: 180,
    icon: <ProductIcons.VotingBox />,
    soldCount: 445,
    rating: 4.7,
    deliveryDays: 2,
    description: 'Zamykana urna na ankiety i konkursy.',
    features: ['Zamek z kluczykiem', 'Przezroczysta', 'Logo gratis'],
    materials: 'PMMA 5mm',
    dimensions: '30x30x30cm',
    customizable: true
  },
  {
    id: '13',
    name: 'Stojak Ulotek A4 CASCADE',
    category: 'universal',
    price: 150,
    icon: <ProductIcons.BrochureStand />,
    soldCount: 890,
    rating: 4.6,
    deliveryDays: 2,
    description: 'Klasyczny stojak na ulotki.',
    features: ['4 kieszenie A4', 'Stabilna podstawa', 'Plexi 3mm'],
    materials: 'PMMA 3mm',
    dimensions: '24x32x15cm',
    customizable: false
  },
  {
    id: '14',
    name: 'Pudełko Prezentowe LUX',
    category: 'universal',
    price: 89,
    icon: <ProductIcons.GiftBox />,
    soldCount: 567,
    rating: 4.9,
    deliveryDays: 3,
    description: 'Eleganckie pudełko z grawerem.',
    features: ['Grawer dedykacji', 'Welurowa wkładka', '3 rozmiary'],
    materials: 'PMMA 5mm + welur',
    dimensions: 'S: 15x15x10cm, M: 20x20x15cm, L: 30x30x20cm',
    customizable: true
  }
];

const categories = [
  { id: 'all', name: 'Wszystkie', icon: '🏪' },
  { id: 'medical', name: 'Medycyna', icon: '🏥' },
  { id: 'gastro', name: 'Gastronomia', icon: '🍽️' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'office', name: 'Biuro', icon: '🏢' },
  { id: 'industry', name: 'Przemysł', icon: '🏭' },
  { id: 'advertising', name: 'Reklama', icon: '📢' },
  { id: 'universal', name: 'Uniwersalne', icon: '🎯' }
];

const Marketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = project.price >= priceRange.min && project.price <= priceRange.max;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">🏪 Marketplace - Gotowe Projekty</h1>
          <p className="text-xl text-purple-200">
            Wybierz, dostosuj i zamów w 5 minut! Ponad 1000 zadowolonych klientów.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj projektów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-4 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-zinc-700 text-gray-300 rounded-lg hover:bg-zinc-600"
            >
              <Filter className="w-5 h-5" />
              <span>Filtry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-800 p-4 rounded-lg flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Sprzedanych projektów</p>
              <p className="text-white text-xl font-bold">3,847</p>
            </div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-400 text-sm">Średnia ocena</p>
              <p className="text-white text-xl font-bold">4.8/5.0</p>
            </div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg flex items-center space-x-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Śr. czas realizacji</p>
              <p className="text-white text-xl font-bold">3-5 dni</p>
            </div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg flex items-center space-x-3">
            <Package className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-400 text-sm">Dostępnych wzorów</p>
              <p className="text-white text-xl font-bold">127</p>
            </div>
          </div>
        </div>

        {/* Filters (if shown) */}
        {showFilters && (
          <div className="mb-8 bg-zinc-800 p-6 rounded-lg">
            <h3 className="text-white font-bold mb-4">Filtry zaawansowane</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-400 text-sm">Zakres cenowy</label>
                <div className="flex items-center space-x-4 mt-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-1 bg-zinc-700 text-white rounded"
                    placeholder="Od"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 2000 })}
                    className="w-24 px-3 py-1 bg-zinc-700 text-white rounded"
                    placeholder="Do"
                  />
                  <span className="text-gray-400">zł</span>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Czas realizacji</label>
                <select className="w-full mt-2 px-3 py-2 bg-zinc-700 text-white rounded">
                  <option>Dowolny</option>
                  <option>Do 2 dni</option>
                  <option>Do 5 dni</option>
                  <option>Do 7 dni</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Sortuj po</label>
                <select className="w-full mt-2 px-3 py-2 bg-zinc-700 text-white rounded">
                  <option>Popularności</option>
                  <option>Cenie rosnąco</option>
                  <option>Cenie malejąco</option>
                  <option>Najnowsze</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-zinc-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image/Icon */}
              <div className="relative h-48 bg-white">
                {project.icon}
                {project.bestseller && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    BESTSELLER
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(project.id)}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      favorites.includes(project.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-white'
                    }`} 
                  />
                </button>
                {project.oldPrice && (
                  <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{Math.round((1 - project.price / project.oldPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-1">{project.name}</h3>
                
                {/* Rating and sold */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">{project.rating}</span>
                    <span className="text-gray-500 text-sm">({project.soldCount} sprzedanych)</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-3">{project.description}</p>

                {/* Materials & Dimensions */}
                {project.materials && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Materiał: </span>
                    <span className="text-xs text-blue-400">{project.materials}</span>
                  </div>
                )}
                {project.dimensions && (
                  <div className="mb-3">
                    <span className="text-xs text-gray-500">Wymiary: </span>
                    <span className="text-xs text-green-400">{project.dimensions}</span>
                  </div>
                )}

                {/* Features */}
                <ul className="text-xs text-gray-500 space-y-1 mb-3">
                  {project.features.slice(0, 2).map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>

                {/* Price */}
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-white">{project.price} zł</span>
                    {project.oldPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">{project.oldPrice} zł</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {project.deliveryDays} dni
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Zamów
                  </button>
                  {project.customizable && (
                    <button className="bg-zinc-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-zinc-600 transition-colors flex items-center justify-center">
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button className="bg-zinc-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-zinc-600 transition-colors flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nie znaleziono projektów spełniających kryteria</p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                setPriceRange({ min: 0, max: 2000 });
              }}
              className="mt-4 text-purple-400 hover:text-purple-300"
            >
              Wyczyść filtry
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Nie znalazłeś tego, czego szukasz?
          </h2>
          <p className="text-gray-300 mb-6">
            Nasi eksperci przygotują projekt specjalnie dla Ciebie!
          </p>
          <button className="bg-white text-purple-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Zapytaj o projekt indywidualny
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;