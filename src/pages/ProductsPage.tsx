import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Package, Image, Tag, Edit, Trash2, X, Save, Upload, 
  Grid, List, Filter, ChevronRight, Star, TrendingUp, Eye, Copy,
  Layers, DollarSign, Ruler, Box, Sparkles, Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { PageWrapper, Card, SectionTitle, LoadingState, EmptyState, StatCard } from '@/components/ui/PageWrapper';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string;
  name: string;
  category: string;
  material: string;
  thickness: number;
  price_per_m2: number;
  min_order: number;
  max_width: number;
  max_height: number;
  description?: string;
  images: string[];
  tags: string[];
  is_active: boolean;
  popularity: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'Wszystkie', icon: <Package className="w-5 h-5" />, count: 0, color: 'purple' },
    { id: 'plate', name: 'Formatki / Płyty', icon: <Layers className="w-5 h-5" />, count: 0, color: 'blue' },
    { id: 'stand', name: 'Ekspozytory', icon: <Box className="w-5 h-5" />, count: 0, color: 'emerald' },
    { id: 'sign', name: 'Kasetony', icon: <Zap className="w-5 h-5" />, count: 0, color: 'amber' },
    { id: 'other', name: 'Inne', icon: <Sparkles className="w-5 h-5" />, count: 0, color: 'pink' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Demo produkty
  useEffect(() => {
    setTimeout(() => {
      const demoProducts: Product[] = [
        {
          id: '1',
          name: 'Plexi Transparentne 3mm',
          category: 'plate',
          material: 'Plexi',
          thickness: 3,
          price_per_m2: 150,
          min_order: 0.25,
          max_width: 3050,
          max_height: 2050,
          description: 'Wysokiej jakości płyta z pleksi transparentnego',
          images: ['https://images.unsplash.com/photo-1615487137774-a4b2c0e3dc92?w=400'],
          tags: ['transparentne', 'popularne'],
          is_active: true,
          popularity: 95,
          created_at: '2024-01-15'
        },
        {
          id: '2',
          name: 'Dibond 3mm Biały',
          category: 'plate',
          material: 'Dibond',
          thickness: 3,
          price_per_m2: 180,
          min_order: 0.5,
          max_width: 3050,
          max_height: 2050,
          description: 'Płyta kompozytowa aluminiowa w kolorze białym',
          images: ['https://images.unsplash.com/photo-1632532836380-f67c8eb45c15?w=400'],
          tags: ['białe', 'zewnętrzne'],
          is_active: true,
          popularity: 88,
          created_at: '2024-01-20'
        },
        {
          id: '3',
          name: 'Ekspozytor Wolnostojący A4',
          category: 'stand',
          material: 'Plexi',
          thickness: 3,
          price_per_m2: 45,
          min_order: 1,
          max_width: 210,
          max_height: 297,
          description: 'Elegancki stojak na ulotki formatu A4',
          images: ['https://images.unsplash.com/photo-1586023492125-27b3c0e64c6f?w=400'],
          tags: ['A4', 'biurowe'],
          is_active: true,
          popularity: 76,
          created_at: '2024-02-01'
        },
        {
          id: '4',
          name: 'Kaseton LED 100x50cm',
          category: 'sign',
          material: 'Dibond + Plexi',
          thickness: 10,
          price_per_m2: 850,
          min_order: 1,
          max_width: 3000,
          max_height: 1500,
          description: 'Kaseton reklamowy z podświetleniem LED',
          images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
          tags: ['LED', 'zewnętrzne', 'premium'],
          is_active: true,
          popularity: 92,
          created_at: '2024-01-10'
        }
      ];

      setProducts(demoProducts);
      setFilteredProducts(demoProducts);
      updateCategoryCounts(demoProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchTerm, products]);

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  };

  const updateCategoryCounts = (productList: Product[]) => {
    const counts = productList.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setCategories(cats => cats.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? productList.length : (counts[cat.id] || 0)
    })));
  };

  const duplicateProduct = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (kopia)`,
      created_at: new Date().toISOString()
    };
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    updateCategoryCounts(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    updateCategoryCounts(newProducts);
  };

  const pageActions = (
    <Button onClick={() => setShowAddModal(true)} variant="primary">
      <Plus className="w-5 h-5" />
      Dodaj produkt
    </Button>
  );

  if (loading) {
    return (
      <PageWrapper title="Produkty" subtitle="Zarządzaj katalogiem produktów i cenami" actions={pageActions}>
        <LoadingState />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Produkty" 
      subtitle="Zarządzaj katalogiem produktów i cenami"
      actions={pageActions}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Package className="w-6 h-6" />}
          label="Wszystkie produkty"
          value={products.length}
          color="purple"
          progress={85}
        />
        <StatCard
          icon={<Star className="w-6 h-6" />}
          label="Popularne"
          value={products.filter(p => p.popularity > 90).length}
          color="amber"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Nowe w tym miesiącu"
          value={8}
          color="emerald"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Średnia cena/m²"
          value={`${Math.round(products.reduce((sum, p) => sum + p.price_per_m2, 0) / products.length)} zł`}
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
              placeholder="Szukaj produktu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-700/50 backdrop-blur rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-3 bg-zinc-700/50 backdrop-blur rounded-xl border border-zinc-600 hover:border-purple-500 transition-all"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 bg-zinc-700/50 backdrop-blur rounded-xl border border-zinc-600 hover:border-purple-500 transition-all"
            >
              <Filter className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </Card>

      <div className="flex gap-6">
        {/* Categories Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 flex-shrink-0"
        >
          <Card className="p-6">
            <SectionTitle>Kategorie</SectionTitle>
            <div className="space-y-2">
              {categories.map((category, index) => {
                const colorClasses = {
                  purple: 'from-purple-500 to-pink-500',
                  blue: 'from-blue-500 to-indigo-500',
                  emerald: 'from-emerald-500 to-teal-500',
                  amber: 'from-amber-500 to-orange-500',
                  pink: 'from-pink-500 to-rose-500'
                };
                
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r ' + colorClasses[category.color as keyof typeof colorClasses] + ' text-white shadow-lg'
                        : 'bg-zinc-800/50 hover:bg-zinc-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {category.icon}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className={`text-sm ${
                      selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Popular Tags */}
            <div className="mt-8">
              <SectionTitle>Popularne tagi</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {['transparentne', 'białe', 'LED', 'zewnętrzne', 'A4', 'premium'].map((tag, index) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-zinc-800/50 backdrop-blur text-gray-300 rounded-full text-sm hover:bg-zinc-800/70 hover:text-white transition-all border border-zinc-700/50"
                  >
                    #{tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
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
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <Card className="overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-purple-500/10" hover>
                    <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      {product.popularity > 90 && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        >
                          HOT 🔥
                        </motion.div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-white text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {product.material} • {product.thickness}mm
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            {product.price_per_m2} zł
                          </p>
                          <p className="text-xs text-gray-500">za m²</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-400">{product.popularity}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-zinc-800/50 text-gray-400 rounded-full text-xs border border-zinc-700/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="divide-y divide-zinc-700/50">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 hover:bg-zinc-800/30 cursor-pointer flex items-center justify-between transition-all"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <p className="text-sm text-gray-400">
                        {product.material} • {product.thickness}mm • Max: {product.max_width}x{product.max_height}mm
                      </p>
                      <div className="flex gap-2 mt-1">
                        {product.tags.map((tag) => (
                          <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xl font-bold text-amber-400">{product.price_per_m2} zł/m²</p>
                      <p className="text-xs text-gray-500">Min. {product.min_order} m²</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateProduct(product);
                        }}
                        className="p-2 hover:bg-zinc-700 rounded-lg transition-all"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(product.id);
                        }}
                        className="p-2 hover:bg-red-900/50 text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Card>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
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
              <div className="sticky top-0 bg-zinc-800 border-b border-zinc-700 p-6 flex justify-between items-start">
                <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-zinc-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gallery */}
                  <div>
                    <div className="h-64 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-xl overflow-hidden">
                      {selectedProduct.images[0] ? (
                        <img
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="w-16 h-16 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-20 bg-zinc-700/50 rounded-lg border-2 border-dashed border-zinc-600 hover:border-purple-500 transition-all flex items-center justify-center"
                      >
                        <Plus className="w-6 h-6 text-gray-500" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Kategoria</h3>
                      <p className="text-lg text-white">{categories.find(c => c.id === selectedProduct.category)?.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Materiał</h3>
                        <p className="text-lg text-white">{selectedProduct.material}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Grubość</h3>
                        <p className="text-lg text-white">{selectedProduct.thickness} mm</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Max wymiary</h3>
                        <p className="text-lg text-white">{selectedProduct.max_width} x {selectedProduct.max_height} mm</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Min. zamówienie</h3>
                        <p className="text-lg text-white">{selectedProduct.min_order} m²</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Cena</h3>
                      <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        {selectedProduct.price_per_m2} zł/m²
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Opis</h3>
                      <p className="text-gray-300">{selectedProduct.description}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Tagi</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-zinc-700/50 rounded-full text-sm text-gray-300 border border-zinc-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-semibold text-white">{selectedProduct.popularity}%</span>
                        </div>
                        <span className="text-sm text-gray-500">popularności</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">342 wyświetleń</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="primary" className="flex-1">
                    <Edit className="w-5 h-5" />
                    Edytuj produkt
                  </Button>
                  <Button
                    onClick={() => duplicateProduct(selectedProduct)}
                    variant="secondary"
                  >
                    <Copy className="w-5 h-5" />
                    Duplikuj
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}