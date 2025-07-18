import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book, Search, ChevronRight, FileText, Video, HelpCircle, 
  Lightbulb, Users, Settings, Package, Calculator, Zap,
  Shield, Award, Clock, Eye, ThumbsUp, MessageCircle,
  BookOpen, GraduationCap, Code, Layers, X
} from 'lucide-react';
import { PageWrapper, Card, SectionTitle, EmptyState } from '@/components/ui/PageWrapper';
import { Button } from '@/components/ui/Button';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: number;
  helpful: number;
  icon: React.ReactNode;
  tags: string[];
  author: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  articleCount: number;
  color: string;
}

const categories: Category[] = [
  {
    id: 'getting-started',
    name: 'Rozpoczęcie pracy',
    icon: <Lightbulb className="w-6 h-6" />,
    description: 'Podstawy systemu i pierwsze kroki',
    articleCount: 12,
    color: 'purple'
  },
  {
    id: 'products',
    name: 'Produkty i materiały',
    icon: <Package className="w-6 h-6" />,
    description: 'Wszystko o produktach z plexi',
    articleCount: 24,
    color: 'blue'
  },
  {
    id: 'calculations',
    name: 'Kalkulacje i wyceny',
    icon: <Calculator className="w-6 h-6" />,
    description: 'Jak prawidłowo wyceniać produkty',
    articleCount: 18,
    color: 'emerald'
  },
  {
    id: 'best-practices',
    name: 'Najlepsze praktyki',
    icon: <Award className="w-6 h-6" />,
    description: 'Sprawdzone metody i porady',
    articleCount: 15,
    color: 'amber'
  },
  {
    id: 'troubleshooting',
    name: 'Rozwiązywanie problemów',
    icon: <HelpCircle className="w-6 h-6" />,
    description: 'Częste problemy i ich rozwiązania',
    articleCount: 8,
    color: 'red'
  },
  {
    id: 'advanced',
    name: 'Zaawansowane',
    icon: <Code className="w-6 h-6" />,
    description: 'Dla doświadczonych użytkowników',
    articleCount: 6,
    color: 'pink'
  }
];

const articles: Article[] = [
  {
    id: '1',
    title: 'Jak stworzyć pierwszą ofertę w systemie',
    excerpt: 'Przewodnik krok po kroku po tworzeniu oferty od podstaw. Dowiedz się jak dodawać produkty, klientów i generować PDF.',
    category: 'getting-started',
    readTime: '5 min',
    views: 1234,
    helpful: 89,
    icon: <FileText className="w-5 h-5" />,
    tags: ['oferty', 'początkujący', 'tutorial'],
    author: 'Admin',
    date: '2024-01-15'
  },
  {
    id: '2',
    title: 'Rodzaje plexi - kompletny przewodnik',
    excerpt: 'Poznaj wszystkie rodzaje plexi dostępne w ofercie, ich właściwości, zastosowania i różnice cenowe.',
    category: 'products',
    readTime: '8 min',
    views: 892,
    helpful: 67,
    icon: <Layers className="w-5 h-5" />,
    tags: ['materiały', 'plexi', 'produkty'],
    author: 'Ekspert Produktowy',
    date: '2024-01-10'
  },
  {
    id: '3',
    title: 'Obliczanie kosztów transportu',
    excerpt: 'Dowiedz się jak system automatycznie kalkuluje koszty transportu na podstawie wagi i regionu dostawy.',
    category: 'calculations',
    readTime: '6 min',
    views: 567,
    helpful: 45,
    icon: <Calculator className="w-5 h-5" />,
    tags: ['transport', 'kalkulacje', 'koszty'],
    author: 'Zespół Sprzedaży',
    date: '2024-01-08'
  },
  {
    id: '4',
    title: 'Integracja z GUS - poradnik',
    excerpt: 'Jak korzystać z automatycznego pobierania danych firm z bazy GUS. Oszczędź czas przy wprowadzaniu klientów.',
    category: 'best-practices',
    readTime: '4 min',
    views: 445,
    helpful: 38,
    icon: <Shield className="w-5 h-5" />,
    tags: ['GUS', 'integracja', 'klienci'],
    author: 'IT Support',
    date: '2024-01-05'
  }
];

const popularSearches = [
  'Jak dodać produkt nietypowy',
  'Eksport do PDF',
  'Rabaty i promocje',
  'Import klientów',
  'Szablony ofert'
];

export function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleHelpful = (articleId: string) => {
    // Mark article as helpful
    console.log('Marked as helpful:', articleId);
  };

  return (
    <PageWrapper 
      title="Baza wiedzy" 
      subtitle="Znajdź odpowiedzi na swoje pytania i naucz się efektywnie korzystać z systemu"
    >
      {/* Search Section */}
      <Card className="p-8 mb-8 text-center" gradient>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Czym możemy Ci pomóc?</h2>
          <p className="text-gray-400 mb-6">Przeszukaj naszą bazę wiedzy lub wybierz kategorię poniżej</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Szukaj artykułów, poradników, rozwiązań..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-700/50 backdrop-blur rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all text-lg"
            />
          </div>

          {/* Popular Searches */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-gray-500">Popularne wyszukiwania:</span>
            {popularSearches.map((search, index) => (
              <motion.button
                key={search}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchTerm(search)}
                className="px-3 py-1 bg-zinc-700/50 text-gray-300 rounded-full text-sm hover:bg-zinc-700 hover:text-white transition-all"
              >
                {search}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </Card>

      {/* Categories Grid */}
      <SectionTitle icon={<Book className="w-6 h-6" />}>
        Kategorie
      </SectionTitle>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categories.map((category, index) => {
          const colorClasses = {
            purple: 'from-purple-500 to-pink-500',
            blue: 'from-blue-500 to-indigo-500',
            emerald: 'from-emerald-500 to-teal-500',
            amber: 'from-amber-500 to-orange-500',
            red: 'from-red-500 to-rose-500',
            pink: 'from-pink-500 to-purple-500'
          };
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <Card 
                className={`p-6 cursor-pointer transition-all ${
                  selectedCategory === category.id ? 'ring-2 ring-purple-500' : ''
                }`} 
                hover
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-gradient-to-br ${colorClasses[category.color as keyof typeof colorClasses]} rounded-xl`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{category.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">{category.articleCount} artykułów</span>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Articles List */}
      <SectionTitle icon={<FileText className="w-6 h-6" />}>
        {selectedCategory 
          ? `Artykuły: ${categories.find(c => c.id === selectedCategory)?.name}`
          : 'Wszystkie artykuły'
        }
      </SectionTitle>

      {filteredArticles.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={<Book className="w-12 h-12" />}
            title="Brak artykułów"
            description="Nie znaleziono artykułów spełniających kryteria"
            action={
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }} variant="secondary">
                Wyczyść filtry
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer" hover>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-700/50 rounded-xl">
                    {article.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="text-left group"
                      >
                        <h3 className="text-lg font-semibold text-white hover:text-purple-400 transition-colors group-hover:underline">
                          {article.title}
                        </h3>
                      </button>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 mb-3">{article.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          {article.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs text-gray-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {article.author} • {article.date}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHelpful(article.id);
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-900/20 text-emerald-400 rounded-lg hover:bg-emerald-900/30 transition-all"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{article.helpful}</span>
                        </motion.button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => setSelectedArticle(article)}
                        >
                          Czytaj więcej
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Card className="p-8 text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20" gradient>
          <GraduationCap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Potrzebujesz dodatkowej pomocy?</h3>
          <p className="text-gray-400 mb-6">
            Nasz zespół wsparcia jest gotowy odpowiedzieć na Twoje pytania
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary">
              <MessageCircle className="w-5 h-5" />
              Rozpocznij czat
            </Button>
            <Button variant="primary">
              <Video className="w-5 h-5" />
              Umów szkolenie
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-700/50 rounded-lg">
                    {selectedArticle.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span>{selectedArticle.author}</span>
                      <span>•</span>
                      <span>{selectedArticle.date}</span>
                      <span>•</span>
                      <span>{selectedArticle.readTime}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 hover:bg-zinc-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    {selectedArticle.excerpt}
                  </p>

                  {/* Article content sections */}
                  <div className="space-y-6">
                    {selectedArticle.id === '1' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Krok 1: Wybierz klienta</h3>
                          <p className="text-gray-300 mb-4">
                            Zacznij od wybrania istniejącego klienta z listy lub dodaj nowego. System automatycznie pobiera dane z GUS, co oszczędza czas.
                          </p>
                          <div className="bg-zinc-700/30 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-400">
                              <strong className="text-white">Wskazówka:</strong> Użyj funkcji wyszukiwania po NIP, aby szybko znaleźć klienta.
                            </p>
                          </div>
                        </section>

                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Krok 2: Dodaj produkty</h3>
                          <p className="text-gray-300 mb-4">
                            Przejdź do kalkulatora i wybierz produkty. Możesz użyć gotowych szablonów z Marketplace lub stworzyć własną konfigurację.
                          </p>
                          <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Wybierz typ produktu (ekspozytor, kaseton, etc.)</li>
                            <li>Określ materiał i grubość</li>
                            <li>Podaj wymiary</li>
                            <li>System automatycznie obliczy cenę</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Krok 3: Wygeneruj PDF</h3>
                          <p className="text-gray-300 mb-4">
                            Po dodaniu wszystkich produktów, kliknij "Generuj PDF". Oferta zostanie automatycznie sformatowana i gotowa do wysłania.
                          </p>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '2' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Plexi bezbarwna (transparentna)</h3>
                          <p className="text-gray-300 mb-4">
                            Najbardziej popularna, krystalicznie przezroczysta. Dostępna w grubościach od 2 do 20mm.
                          </p>
                          <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Przepuszczalność światła: 92%</li>
                            <li>Odporna na UV</li>
                            <li>Łatwa w obróbce</li>
                            <li>Cena bazowa: 30 zł/kg</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Plexi mleczna</h3>
                          <p className="text-gray-300 mb-4">
                            Półprzezroczysta, rozprasza światło. Idealna do podświetleń LED.
                          </p>
                          <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Przepuszczalność światła: 60-70%</li>
                            <li>Równomierne rozproszenie światła</li>
                            <li>Popularna w kasetonach reklamowych</li>
                            <li>Cena bazowa: 33 zł/kg</li>
                          </ul>
                        </section>
                      </>
                    )}

                    {/* More content for other articles... */}
                  </div>

                  <div className="mt-8 pt-6 border-t border-zinc-700">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedArticle.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-zinc-700/50 rounded-full text-sm text-gray-300">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-400">{selectedArticle.views} wyświetleń</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-400">{selectedArticle.helpful} osób uznało za pomocny</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          handleHelpful(selectedArticle.id);
                          setSelectedArticle(null);
                        }}
                        variant="primary"
                      >
                        <ThumbsUp className="w-5 h-5" />
                        Ten artykuł był pomocny
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