import React, { useState } from 'react';
import { ShoppingCart, Star, Clock, Package, Eye, Edit, Heart, TrendingUp, Award, Filter, Search } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  soldCount: number;
  rating: number;
  deliveryDays: number;
  description: string;
  features: string[];
  customizable: boolean;
  bestseller?: boolean;
}

const projects: Project[] = [
  // Beauty & Kosmetyka
  {
    id: '1',
    name: 'Display Lakierów RAINBOW 60',
    category: 'beauty',
    price: 549,
    oldPrice: 649,
    image: '/api/placeholder/300/300',
    soldCount: 523,
    rating: 4.8,
    deliveryDays: 3,
    description: 'Elegancki, schodkowy ekspozytor na 60 butelek lakieru.',
    features: ['6 poziomów po 10 miejsc', 'Antypoślizgowe rowki', 'Możliwość stackowania'],
    customizable: true,
    bestseller: true
  },
  {
    id: '15',
    name: 'Organizer Kosmetyków GLAM',
    category: 'beauty',
    price: 380,
    image: '/api/placeholder/300/300',
    soldCount: 234,
    rating: 4.7,
    deliveryDays: 3,
    description: 'Luksusowy organizer z lustrzanym tłem.',
    features: ['24 przegródki', 'Lustro w zestawie', '3 szufladki'],
    customizable: true
  },
  
  // Medycyna
  {
    id: '2',
    name: 'Osłona Recepcji MEDICAL',
    category: 'medical',
    price: 450,
    image: '/api/placeholder/300/300',
    soldCount: 156,
    rating: 4.9,
    deliveryDays: 5,
    description: 'Profesjonalna osłona dla przychodni z okienkiem podawczym.',
    features: ['Okienko 30x20cm', 'Półka na dokumenty', 'Stabilne nóżki'],
    customizable: true
  },
  {
    id: '6',
    name: 'Dystrybutor Płynu TOUCH-FREE',
    category: 'medical',
    price: 180,
    image: '/api/placeholder/300/300',
    soldCount: 678,
    rating: 4.9,
    deliveryDays: 2,
    description: 'Bezdotykowy dystrybutor na łokieć.',
    features: ['Mechanizm na łokieć', 'Pojemność 1L', 'Logo w cenie'],
    customizable: true,
    bestseller: true
  },
  
  // Gastronomia
  {
    id: '3',
    name: 'Menu LED Gastro PRO',
    category: 'gastro',
    price: 320,
    image: '/api/placeholder/300/300',
    soldCount: 89,
    rating: 4.7,
    deliveryDays: 4,
    description: 'Podświetlane menu A4 dla restauracji i kawiarni.',
    features: ['Podświetlenie LED', 'Wymienne wkładki', 'Format A4'],
    customizable: true
  },
  {
    id: '5',
    name: 'Separator Stolików ELEGANT',
    category: 'gastro',
    price: 280,
    image: '/api/placeholder/300/300',
    soldCount: 312,
    rating: 4.8,
    deliveryDays: 2,
    description: 'Elegancki separator dla restauracji.',
    features: ['Stabilna podstawa', '3 rozmiary', 'Łatwy montaż'],
    customizable: false
  },
  {
    id: '7',
    name: 'Ekspozytor Deserów SWEET 3',
    category: 'gastro',
    price: 420,
    image: '/api/placeholder/300/300',
    soldCount: 45,
    rating: 4.5,
    deliveryDays: 4,
    description: '3-poziomowy ekspozytor z pokrywą.',
    features: ['3 poziomy', 'Pokrywa w zestawie', 'Łatwe czyszczenie'],
    customizable: false
  },
  
  // Biuro
  {
    id: '4',
    name: 'Organizer Biurowy OFFICE 5',
    category: 'office',
    price: 450,
    image: '/api/placeholder/300/300',
    soldCount: 234,
    rating: 4.6,
    deliveryDays: 3,
    description: 'Modułowy system organizacji biurka - 5 elementów.',
    features: ['5 modułów', 'Możliwość stackowania', 'Grawer logo w cenie'],
    customizable: true
  },
  {
    id: '16',
    name: 'Tablica KANBAN Magnetic',
    category: 'office',
    price: 680,
    image: '/api/placeholder/300/300',
    soldCount: 67,
    rating: 4.8,
    deliveryDays: 5,
    description: 'Magnetyczna tablica do zarządzania projektami.',
    features: ['4 kolumny', 'Magnesy w zestawie', 'Markery sucho ścieralne'],
    customizable: true
  },
  
  // Przemysł
  {
    id: '9',
    name: 'Osłona Tokarki SHIELD PRO',
    category: 'industry',
    price: 890,
    image: '/api/placeholder/300/300',
    soldCount: 45,
    rating: 5.0,
    deliveryDays: 7,
    description: 'Wytrzymała osłona z poliwęglanu 8mm.',
    features: ['PC 8mm', 'Zawiasy przemysłowe', 'Norma CE'],
    customizable: true
  },
  {
    id: '10',
    name: 'Obudowa Sterownika PLC',
    category: 'industry',
    price: 320,
    image: '/api/placeholder/300/300',
    soldCount: 128,
    rating: 4.7,
    deliveryDays: 5,
    description: 'Szczelna obudowa IP65 dla elektroniki.',
    features: ['Szczelność IP65', 'Otwory kablowe', 'Montaż DIN'],
    customizable: true
  },
  
  // Reklama
  {
    id: '11',
    name: 'Litery 3D LOGO Light',
    category: 'advertising',
    price: 1200,
    image: '/api/placeholder/300/300',
    soldCount: 89,
    rating: 4.9,
    deliveryDays: 10,
    description: 'Podświetlane litery przestrzenne.',
    features: ['LED w cenie', 'Wysokość do 50cm', 'Montaż gratis'],
    customizable: true,
    bestseller: true
  },
  {
    id: '12',
    name: 'Szyld Dibond PRESTIGE',
    category: 'advertising',
    price: 450,
    image: '/api/placeholder/300/300',
    soldCount: 345,
    rating: 4.8,
    deliveryDays: 5,
    description: 'Elegancki szyld z dibondu szczotkowanego.',
    features: ['Dibond 3mm', 'Frezowanie CNC', 'Dystanse w zestawie'],
    customizable: true
  },
  
  // Uniwersalne
  {
    id: '8',
    name: 'Urna Konkursowa VOTE',
    category: 'universal',
    price: 180,
    image: '/api/placeholder/300/300',
    soldCount: 445,
    rating: 4.7,
    deliveryDays: 2,
    description: 'Zamykana urna na ankiety i konkursy.',
    features: ['Zamek z kluczykiem', 'Przezroczysta', 'Logo gratis'],
    customizable: true
  },
  {
    id: '13',
    name: 'Stojak Ulotek A4 CASCADE',
    category: 'universal',
    price: 150,
    image: '/api/placeholder/300/300',
    soldCount: 890,
    rating: 4.6,
    deliveryDays: 2,
    description: 'Klasyczny stojak na ulotki.',
    features: ['4 kieszenie A4', 'Stabilna podstawa', 'Plexi 3mm'],
    customizable: false
  },
  {
    id: '14',
    name: 'Pudełko Prezentowe LUX',
    category: 'universal',
    price: 89,
    image: '/api/placeholder/300/300',
    soldCount: 567,
    rating: 4.9,
    deliveryDays: 3,
    description: 'Eleganckie pudełko z grawerem.',
    features: ['Grawer dedykacji', 'Welurowa wkładka', '3 rozmiary'],
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
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
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
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000 })}
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
              {/* Image */}
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover bg-zinc-700"
                />
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
                setPriceRange({ min: 0, max: 1000 });
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
