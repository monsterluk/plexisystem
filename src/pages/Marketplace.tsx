import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Star, Clock, ShoppingCart, Eye, Heart, Share2,
  Package, Sparkles, Zap, Award, TrendingUp, Users, Download,
  ChevronRight, Check, X, Info, Tag, Layers, Calculator
} from 'lucide-react';
import { PageWrapper, Card, SectionTitle, EmptyState, StatCard } from '@/components/ui/PageWrapper';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { productTypes, expositorTypes, materials } from '@/constants/materials';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  productType: string;
  material: string;
  thickness?: number;
  rating: number;
  downloads: number;
  tags: string[];
  features: string[];
  isNew: boolean;
  isFeatured: boolean;
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
  };
}

// Generujemy produkty na podstawie naszych typów produktów
const generateMarketplaceItems = (): MarketplaceItem[] => {
  const items: MarketplaceItem[] = [];
  
  // Przykładowe produkty dla każdego typu
  const sampleProducts = [
    {
      productType: 'ekspozytor',
      subType: 'kosmetyczny',
      name: 'Display Kosmetyków Premium',
      description: 'Profesjonalny ekspozytor na kosmetyki z 5 półkami i podświetleniem LED',
      material: 'plexi_clear',
      thickness: 5,
      dimensions: { width: 600, height: 1800, depth: 400 },
      basePrice: 2500,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      tags: ['kosmetyki', 'LED', 'premium', '5 półek'],
      features: ['Podświetlenie LED', '5 półek regulowanych', 'Plexi 5mm', 'Wymiary: 60x40x180cm', 'Ograniczniki na półkach'],
      isNew: true,
      isFeatured: true,
      rating: 4.8,
      downloads: 234
    },
    {
      productType: 'kaseton',
      name: 'Kaseton LED 100x50cm',
      description: 'Kaseton reklamowy dwustronny z podświetleniem LED',
      material: 'dibond',
      thickness: 3,
      dimensions: { width: 1000, height: 500, depth: 100 },
      basePrice: 850,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      tags: ['LED', 'zewnętrzne', 'dwustronny'],
      features: ['Format 100x50cm', 'Dwustronny', 'Wodoodporny IP65', 'Montaż ścienny/wysięgnik', 'Dibond + plexi'],
      isNew: false,
      isFeatured: true,
      rating: 4.6,
      downloads: 156
    },
    {
      productType: 'ekspozytor',
      subType: 'schodkowy',
      name: 'Ekspozytor Schodkowy 5-poziomowy',
      description: 'Uniwersalny ekspozytor schodkowy z 5 poziomami',
      material: 'plexi_clear',
      thickness: 3,
      dimensions: { width: 400, height: 500, depth: 300 },
      basePrice: 650,
      image: 'https://images.unsplash.com/photo-1586023492125-27b3c0e64c6f?w=400',
      tags: ['uniwersalny', 'schodkowy', '5 poziomów'],
      features: ['5 poziomów ekspozycji', 'Plexi 3mm', 'Stabilna konstrukcja', 'Wymiary: 40x30x50cm'],
      isNew: false,
      isFeatured: false,
      rating: 4.5,
      downloads: 312
    },
    {
      productType: 'pojemnik',
      name: 'Organizer Biurowy Crystal',
      description: 'Elegancki organizer na biurko z 6 przegródkami',
      material: 'plexi_clear',
      thickness: 3,
      dimensions: { width: 300, height: 150, depth: 200 },
      basePrice: 180,
      image: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=400',
      tags: ['biuro', 'organizer', 'crystal'],
      features: ['6 przegródek', 'Plexi 3mm', 'Antypoślizgowa podstawa', '30x20x15cm'],
      isNew: true,
      isFeatured: false,
      rating: 4.5,
      downloads: 412
    },
    {
      productType: 'ledon',
      name: 'Neon LED "OPEN" 60x30cm',
      description: 'Neon LED z napisem OPEN, idealny do witryn sklepowych',
      material: 'plexi_white',
      thickness: 10,
      dimensions: { width: 600, height: 300 },
      basePrice: 450,
      image: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=400',
      tags: ['LED', 'OPEN', 'witryna'],
      features: ['Napis OPEN', 'Plexi mleczna 10mm', 'LED RGB', 'Pilot w zestawie'],
      isNew: false,
      isFeatured: false,
      rating: 4.7,
      downloads: 189
    },
    {
      productType: 'gablota',
      name: 'Gablota Informacyjna A3',
      description: 'Gablota wisząca na dokumenty formatu A3',
      material: 'plexi_clear',
      thickness: 4,
      dimensions: { width: 420, height: 297, depth: 30 },
      basePrice: 320,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      tags: ['A3', 'wisząca', 'dokumenty'],
      features: ['Format A3', 'Zamykana na klucz', 'Plexi 4mm', 'Montaż ścienny'],
      isNew: false,
      isFeatured: false,
      rating: 4.4,
      downloads: 98
    },
    {
      productType: 'obudowa',
      name: 'Osłona Ochronna Recepcji',
      description: 'Osłona ochronna na ladę recepcyjną z otworem podawczym',
      material: 'plexi_clear',
      thickness: 5,
      dimensions: { width: 1000, height: 700, depth: 300 },
      basePrice: 420,
      image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400',
      tags: ['ochrona', 'recepcja', 'COVID'],
      features: ['Otwór podawczy', 'Plexi 5mm', 'Stabilne nóżki', '100x70cm'],
      isNew: false,
      isFeatured: false,
      rating: 4.8,
      downloads: 567
    },
    {
      productType: 'impuls',
      name: 'Impuls Kasowy na Batony',
      description: 'Ekspozytor przykasowyniczy na batony i przekąski',
      material: 'plexi_clear',
      thickness: 3,
      dimensions: { width: 200, height: 400, depth: 150 },
      basePrice: 280,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      tags: ['kasa', 'batony', 'impuls'],
      features: ['3 poziomy', 'Plexi 3mm', 'Kompaktowy rozmiar', '20x15x40cm'],
      isNew: true,
      isFeatured: false,
      rating: 4.6,
      downloads: 145
    }
  ];

  // Dodajemy produkty do listy
  sampleProducts.forEach((product, index) => {
    const productTypeInfo = productTypes.find(p => p.id === product.productType);
    
    items.push({
      id: (index + 1).toString(),
      name: product.name,
      description: product.description,
      category: product.productType,
      basePrice: product.basePrice,
      image: product.image,
      productType: product.productType,
      material: product.material,
      thickness: product.thickness,
      rating: product.rating,
      downloads: product.downloads,
      tags: product.tags,
      features: product.features,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      dimensions: product.dimensions
    });
  });

  return items;
};

const marketplaceItems = generateMarketplaceItems();

const categories = [
  { id: 'all', name: 'Wszystkie', icon: Package, count: marketplaceItems.length },
  { id: 'ekspozytor', name: 'Ekspozytory', icon: productTypes.find(p => p.id === 'ekspozytor')?.icon || Layers, count: marketplaceItems.filter(i => i.category === 'ekspozytor').length },
  { id: 'kaseton', name: 'Kasetony', icon: productTypes.find(p => p.id === 'kaseton')?.icon || Zap, count: marketplaceItems.filter(i => i.category === 'kaseton').length },
  { id: 'pojemnik', name: 'Organizery', icon: productTypes.find(p => p.id === 'pojemnik')?.icon || Package, count: marketplaceItems.filter(i => i.category === 'pojemnik').length },
  { id: 'ledon', name: 'Neony LED', icon: productTypes.find(p => p.id === 'ledon')?.icon || Zap, count: marketplaceItems.filter(i => i.category === 'ledon').length },
  { id: 'gablota', name: 'Gabloty', icon: productTypes.find(p => p.id === 'gablota')?.icon || Award, count: marketplaceItems.filter(i => i.category === 'gablota').length },
  { id: 'obudowa', name: 'Osłony', icon: productTypes.find(p => p.id === 'obudowa')?.icon || Sparkles, count: marketplaceItems.filter(i => i.category === 'obudowa').length },
  { id: 'impuls', name: 'Impulsy', icon: productTypes.find(p => p.id === 'impuls')?.icon || ShoppingCart, count: marketplaceItems.filter(i => i.category === 'impuls').length }
];

export function Marketplace() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredItems = marketplaceItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddToCalculator = (item: MarketplaceItem) => {
    // Przekieruj do kalkulatora z wypełnionymi danymi
    const calculatorState = {
      productType: item.productType,
      material: item.material,
      thickness: item.thickness,
      dimensions: item.dimensions,
      fromMarketplace: true
    };
    
    // Zapisz stan w localStorage żeby kalkulator mógł go odczytać
    localStorage.setItem('marketplaceProduct', JSON.stringify(calculatorState));
    navigate('/calculator');
  };

  return (
    <PageWrapper 
      title="Marketplace" 
      subtitle="Gotowe szablony produktów z naszego kalkulatora"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Package className="w-6 h-6" />}
          label="Dostępne szablony"
          value={marketplaceItems.length}
          color="purple"
        />
        <StatCard
          icon={<Star className="w-6 h-6" />}
          label="Średnia ocena"
          value="4.6"
          color="amber"
        />
        <StatCard
          icon={<Calculator className="w-6 h-6" />}
          label="Typy produktów"
          value={productTypes.length}
          color="emerald"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Popularność"
          value="892"
          trend={{ value: 15, isPositive: true }}
          color="blue"
        />
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Szukaj produktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-700/50 backdrop-blur rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
          <Button variant="secondary">
            <Filter className="w-5 h-5" />
            Filtry zaawansowane
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-zinc-800/50 hover:bg-zinc-800/70 text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
                <span className="text-sm opacity-70">({category.count})</span>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Featured Items */}
      {filteredItems.some(item => item.isFeatured) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SectionTitle icon={<Sparkles className="w-6 h-6" />}>
            Wyróżnione produkty
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems
              .filter(item => item.isFeatured)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden" gradient hover>
                    <div className="flex">
                      <div className="w-1/3 h-48 relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.isNew && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                            NOWOŚĆ
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFavorite(item.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                          >
                            <Heart 
                              className={`w-5 h-5 ${
                                favorites.includes(item.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-gray-400'
                              }`} 
                            />
                          </motion.button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs text-gray-400">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-white">{item.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400">
                              <Download className="w-4 h-4" />
                              <span className="text-sm">{item.downloads}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">{item.basePrice} zł</span>
                            <Button 
                              size="sm" 
                              variant="primary"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="w-4 h-4" />
                              Podgląd
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {/* All Items Grid */}
      <SectionTitle icon={<Package className="w-6 h-6" />}>
        Wszystkie produkty
      </SectionTitle>
      
      {filteredItems.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={<Package className="w-12 h-12" />}
            title="Brak produktów"
            description="Nie znaleziono produktów spełniających kryteria"
            action={
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }} variant="secondary">
                Wyczyść filtry
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const materialInfo = materials.find(m => m.id === item.material);
            const productTypeInfo = productTypes.find(p => p.id === item.productType);
            const Icon = productTypeInfo?.icon || Package;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden cursor-pointer h-full" hover>
                  <div 
                    className="h-48 relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900"
                    onClick={() => setSelectedItem(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                    />
                    {item.isNew && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        NEW
                      </div>
                    )}
                    <div className="absolute top-2 left-2 p-2 bg-black/50 backdrop-blur rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                      >
                        <Heart 
                          className={`w-5 h-5 ${
                            favorites.includes(item.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                      <span>{materialInfo?.name}</span>
                      {item.thickness && <span>• {item.thickness}mm</span>}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-zinc-800/50 rounded-full text-xs text-gray-400">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-white">{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Download className="w-3 h-3" />
                          <span className="text-xs">{item.downloads}</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-white">{item.basePrice} zł</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700"
            >
              <div className="sticky top-0 bg-zinc-800 border-b border-zinc-700 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{selectedItem.name}</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-zinc-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Gallery */}
                  <div>
                    <div className="h-96 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-xl overflow-hidden mb-4">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="secondary" size="sm">
                        <Share2 className="w-4 h-4" />
                        Udostępnij
                      </Button>
                      <Button 
                        variant={favorites.includes(selectedItem.id) ? "primary" : "secondary"} 
                        size="sm"
                        onClick={() => toggleFavorite(selectedItem.id)}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(selectedItem.id) ? 'fill-current' : ''}`} />
                        {favorites.includes(selectedItem.id) ? 'Zapisane' : 'Zapisz'}
                      </Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Opis</h3>
                      <p className="text-gray-300">{selectedItem.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Cechy produktu</h3>
                      <div className="space-y-2">
                        {selectedItem.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-emerald-400 mt-0.5" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Specyfikacja</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Typ produktu</p>
                          <p className="text-white font-medium">
                            {productTypes.find(p => p.id === selectedItem.productType)?.name}
                          </p>
                        </div>
                        <div className="bg-zinc-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Materiał</p>
                          <p className="text-white font-medium">
                            {materials.find(m => m.id === selectedItem.material)?.name}
                            {selectedItem.thickness && ` ${selectedItem.thickness}mm`}
                          </p>
                        </div>
                        {selectedItem.dimensions && (
                          <>
                            <div className="bg-zinc-700/50 rounded-lg p-4">
                              <p className="text-sm text-gray-400 mb-1">Wymiary</p>
                              <p className="text-white font-medium">
                                {selectedItem.dimensions.width} x {selectedItem.dimensions.height}
                                {selectedItem.dimensions.depth && ` x ${selectedItem.dimensions.depth}`} mm
                              </p>
                            </div>
                            <div className="bg-zinc-700/50 rounded-lg p-4">
                              <p className="text-sm text-gray-400 mb-1">Ocena</p>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white font-medium">{selectedItem.rating}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-zinc-700 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Cena bazowa</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            {selectedItem.basePrice} zł
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-1">Popularność</p>
                          <div className="flex items-center gap-1 text-emerald-400">
                            <Download className="w-4 h-4" />
                            <span className="text-sm">{selectedItem.downloads} pobrań</span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        variant="primary" 
                        className="w-full"
                        onClick={() => handleAddToCalculator(selectedItem)}
                      >
                        <Calculator className="w-5 h-5" />
                        Użyj w kalkulatorze
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center mt-3">
                        Produkt zostanie automatycznie skonfigurowany w kalkulatorze
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}