import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, Image, Tag, Edit, Trash2, X, Save, Upload, Grid, List, Filter, ChevronRight, Star, TrendingUp, Eye, Copy } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

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
  icon: string;
  count: number;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'Wszystkie', icon: '📦', count: 0 },
    { id: 'plate', name: 'Formatki / Płyty', icon: '🟦', count: 0 },
    { id: 'stand', name: 'Ekspozytory', icon: '🏪', count: 0 },
    { id: 'sign', name: 'Kasetony', icon: '💡', count: 0 },
    { id: 'other', name: 'Inne', icon: '📋', count: 0 }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Demo produkty
  useEffect(() => {
    // Symulacja ładowania produktów
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Produkty</h1>
              <p className="mt-1 text-sm text-gray-500">
                Zarządzaj katalogiem produktów i cenami
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Dodaj produkt
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtry i wyszukiwarka */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj produktu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
            <button className="px-3 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Kategorie */}
          <div className="w-64 flex-shrink-0">
            <h3 className="font-semibold text-gray-900 mb-4">Kategorie</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-orange-50 text-orange-600 border-orange-200 border'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </button>
              ))}
            </div>

            {/* Popularne tagi */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">Popularne tagi</h3>
              <div className="flex flex-wrap gap-2">
                {['transparentne', 'białe', 'LED', 'zewnętrzne', 'A4', 'premium'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista produktów */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all card-hover cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {product.popularity > 90 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                          HOT
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.material} • {product.thickness}mm
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-orange-600">
                            {product.price_per_m2} zł
                          </p>
                          <p className="text-xs text-gray-500">za m²</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{product.popularity}%</span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border divide-y">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">
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
                        <p className="text-xl font-bold text-orange-600">{product.price_per_m2} zł/m²</p>
                        <p className="text-xs text-gray-500">Min. {product.min_order} m²</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateProduct(product);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProduct(product.id);
                          }}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal szczegółów produktu */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Galeria */}
                <div>
                  <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                    {selectedProduct.images[0] ? (
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    <button className="h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Informacje */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Kategoria</h3>
                    <p className="text-lg">{categories.find(c => c.id === selectedProduct.category)?.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Materiał</h3>
                      <p className="text-lg">{selectedProduct.material}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Grubość</h3>
                      <p className="text-lg">{selectedProduct.thickness} mm</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Max wymiary</h3>
                      <p className="text-lg">{selectedProduct.max_width} x {selectedProduct.max_height} mm</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Min. zamówienie</h3>
                      <p className="text-lg">{selectedProduct.min_order} m²</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Cena</h3>
                    <p className="text-3xl font-bold text-orange-600">{selectedProduct.price_per_m2} zł/m²</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Opis</h3>
                    <p className="text-gray-700">{selectedProduct.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Tagi</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">{selectedProduct.popularity}%</span>
                      </div>
                      <span className="text-sm text-gray-500">popularności</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">342 wyświetleń</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  Edytuj produkt
                </button>
                <button
                  onClick={() => duplicateProduct(selectedProduct)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Duplikuj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}