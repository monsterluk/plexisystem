import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Star, Clock, ShoppingCart, Eye, Heart, Share2,
  Package, Sparkles, Zap, Award, TrendingUp, Users, Download,
  ChevronRight, Check, X, Info, Tag, Layers
} from 'lucide-react';
import { PageWrapper, Card, SectionTitle, EmptyState, StatCard } from '@/components/ui/PageWrapper';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  author: string;
  rating: number;
  downloads: number;
  tags: string[];
  features: string[];
  isNew: boolean;
  isFeatured: boolean;
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Display Kosmetyków Premium',
    description: 'Profesjonalny ekspozytor na kosmetyki z podświetleniem LED i regulowanymi półkami',
    category: 'display',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    author: 'PlexiSystem Team',
    rating: 4.8,
    downloads: 234,
    tags: ['kosmetyki', 'LED', 'premium'],
    features: ['Podświetlenie LED', '5 półek', 'Plexi 5mm', 'Wymiary: 60x40x180cm'],
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Menu Restauracyjne LED',
    description: 'Eleganckie menu podświetlane dla restauracji i kawiarni',
    category: 'signage',
    price: 850,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    author: 'Design Studio Pro',
    rating: 4.6,
    downloads: 156,
    tags: ['gastronomia', 'LED', 'menu'],
    features: ['Format A1', 'Zmiana grafiki', 'Wodoodporne', 'Montaż ścienny'],
    isNew: false,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Stand Targowy Modułowy',
    description: 'System modułowych ścianek targowych z opcją brandingu',
    category: 'exhibition',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    author: 'ExpoDesign',
    rating: 4.9,
    downloads: 89,
    tags: ['targi', 'modułowy', 'branding'],
    features: ['Modułowa konstrukcja', 'Torba transportowa', 'Grafika 3x2m', 'Montaż 15min'],
    isNew: false,
    isFeatured: false
  },
  {
    id: '4',
    name: 'Organizer Biurowy Crystal',
    description: 'Stylowy organizer na biurko z przezroczystej plexi',
    category: 'office',
    price: 180,
    image: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=400',
    author: 'Office Solutions',
    rating: 4.5,
    downloads: 412,
    tags: ['biuro', 'organizer', 'crystal'],
    features: ['6 przegródek', 'Plexi 3mm', 'Antypoślizgowa podstawa', '30x20x15cm'],
    isNew: true,
    isFeatured: false
  }
];

const categories = [
  { id: 'all', name: 'Wszystkie', icon: <Package />, count: 24 },
  { id: 'display', name: 'Ekspozytory', icon: <Layers />, count: 8 },
  { id: 'signage', name: 'Oznakowanie', icon: <Zap />, count: 6 },
  { id: 'exhibition', name: 'Targi', icon: <Award />, count: 5 },
  { id: 'office', name: 'Biuro', icon: <Sparkles />, count: 5 }
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

  const handleAddToOffer = (item: MarketplaceItem) => {
    // Navigate to offer creation with template
    navigate('/offer/new', { state: { template: item } });
  };

  return (
    <PageWrapper 
      title="Marketplace" 
      subtitle="Gotowe szablony produktów do szybkiego wykorzystania"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Package className="w-6 h-6" />}
          label="Dostępne szablony"
          value="24"
          color="purple"
        />
        <StatCard
          icon={<Star className="w-6 h-6" />}
          label="Średnia ocena"
          value="4.7"
          color="amber"
        />
        <StatCard
          icon={<Download className="w-6 h-6" />}
          label="Pobrania"
          value="891"
          trend={{ value: 15, isPositive: true }}
          color="emerald"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Autorzy"
          value="12"
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
              placeholder="Szukaj szablonów..."
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
          {categories.map((category) => (
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
              {category.icon}
              <span>{category.name}</span>
              <span className="text-sm opacity-70">({category.count})</span>
            </motion.button>
          ))}
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
            Wyróżnione szablony
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
                            <span className="text-2xl font-bold text-white">{item.price} zł</span>
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
        Wszystkie szablony
      </SectionTitle>
      
      {filteredItems.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={<Package className="w-12 h-12" />}
            title="Brak szablonów"
            description="Nie znaleziono szablonów spełniających kryteria"
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
          {filteredItems.map((item, index) => (
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
                    <Users className="w-4 h-4" />
                    <span>{item.author}</span>
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
                    <span className="text-xl font-bold text-white">{item.price} zł</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
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
                      <h3 className="text-lg font-semibold text-white mb-3">Informacje</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Autor</p>
                          <p className="text-white font-medium">{selectedItem.author}</p>
                        </div>
                        <div className="bg-zinc-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Kategoria</p>
                          <p className="text-white font-medium">
                            {categories.find(c => c.id === selectedItem.category)?.name}
                          </p>
                        </div>
                        <div className="bg-zinc-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Ocena</p>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white font-medium">{selectedItem.rating}</span>
                          </div>
                        </div>
                        <div className="bg-zinc-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Pobrania</p>
                          <p className="text-white font-medium">{selectedItem.downloads}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-700 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Cena szablonu</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            {selectedItem.price} zł
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-1">Natychmiastowa dostawa</p>
                          <div className="flex items-center gap-1 text-emerald-400">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm">Gotowe do użycia</span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        variant="primary" 
                        className="w-full"
                        onClick={() => handleAddToOffer(selectedItem)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Użyj w nowej ofercie
                      </Button>
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