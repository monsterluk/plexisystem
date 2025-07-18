import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book, Search, ChevronRight, FileText, Video, HelpCircle, 
  Lightbulb, Users, Settings, Package, Calculator, Zap,
  Shield, Award, Clock, Eye, ThumbsUp, MessageCircle,
  BookOpen, GraduationCap, Code, Layers, X, AlertCircle, Activity, Sparkles
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
    articleCount: 1,
    color: 'purple'
  },
  {
    id: 'products',
    name: 'Produkty i materiały',
    icon: <Package className="w-6 h-6" />,
    description: 'Wszystko o produktach z plexi',
    articleCount: 8,
    color: 'blue'
  },
  {
    id: 'calculations',
    name: 'Kalkulacje i wyceny',
    icon: <Calculator className="w-6 h-6" />,
    description: 'Jak prawidłowo wyceniać produkty',
    articleCount: 1,
    color: 'emerald'
  },
  {
    id: 'best-practices',
    name: 'Najlepsze praktyki',
    icon: <Award className="w-6 h-6" />,
    description: 'Sprawdzone metody i porady',
    articleCount: 8,
    color: 'amber'
  },
  {
    id: 'troubleshooting',
    name: 'Rozwiązywanie problemów',
    icon: <HelpCircle className="w-6 h-6" />,
    description: 'Częste problemy i ich rozwiązania',
    articleCount: 3,
    color: 'red'
  },
  {
    id: 'advanced',
    name: 'Zaawansowane',
    icon: <Code className="w-6 h-6" />,
    description: 'Dla doświadczonych użytkowników',
    articleCount: 9,
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
  },
  {
    id: '5',
    title: 'Marketplace - jak efektywnie korzystać',
    excerpt: 'Wykorzystaj gotowe szablony produktów z Marketplace do szybszego tworzenia ofert. Oszczędź nawet 70% czasu.',
    category: 'best-practices',
    readTime: '7 min',
    views: 789,
    helpful: 92,
    icon: <Sparkles className="w-5 h-5" />,
    tags: ['marketplace', 'szablony', 'produktywność'],
    author: 'Product Manager',
    date: '2024-02-01'
  },
  {
    id: '6',
    title: 'Konfiguracja ekspozytorów krok po kroku',
    excerpt: 'Naucz się prawidłowo konfigurować ekspozytory: wybór typu, materiału, wymiarów i dodatków.',
    category: 'products',
    readTime: '10 min',
    views: 645,
    helpful: 78,
    icon: <Package className="w-5 h-5" />,
    tags: ['ekspozytory', 'konfiguracja', 'produkty'],
    author: 'Specjalista ds. Produktów',
    date: '2024-01-20'
  },
  {
    id: '7',
    title: 'Zarządzanie zespołem w PlexiSystem',
    excerpt: 'Jak dodawać użytkowników, przypisywać role i uprawnienia oraz monitorować aktywność zespołu.',
    category: 'best-practices',
    readTime: '5 min',
    views: 312,
    helpful: 28,
    icon: <Users className="w-5 h-5" />,
    tags: ['zespół', 'użytkownicy', 'uprawnienia'],
    author: 'HR Manager',
    date: '2024-01-25'
  },
  {
    id: '8',
    title: 'Analiza raportów sprzedażowych',
    excerpt: 'Jak czytać i interpretować raporty sprzedażowe. Kluczowe wskaźniki KPI i ich znaczenie.',
    category: 'best-practices',
    readTime: '9 min',
    views: 534,
    helpful: 61,
    icon: <Activity className="w-5 h-5" />,
    tags: ['raporty', 'analiza', 'KPI'],
    author: 'Sales Director',
    date: '2024-02-05'
  },
  {
    id: '9',
    title: 'Problem: Oferta nie generuje się do PDF',
    excerpt: 'Rozwiązania najczęstszych problemów z generowaniem PDF: brakujące dane, błędy formatowania.',
    category: 'troubleshooting',
    readTime: '3 min',
    views: 234,
    helpful: 156,
    icon: <AlertCircle className="w-5 h-5" />,
    tags: ['PDF', 'błędy', 'rozwiązywanie'],
    author: 'Support Team',
    date: '2024-02-10'
  },
  {
    id: '10',
    title: 'API PlexiSystem - wprowadzenie',
    excerpt: 'Podstawy integracji z API PlexiSystem. Autoryzacja, endpoints i przykłady użycia.',
    category: 'advanced',
    readTime: '12 min',
    views: 189,
    helpful: 23,
    icon: <Code className="w-5 h-5" />,
    tags: ['API', 'integracja', 'programowanie'],
    author: 'Dev Team',
    date: '2024-02-12'
  },
  {
    id: '11',
    title: 'Parametry frezowania dla różnych materiałów',
    excerpt: 'Kompletne tabele parametrów frezowania dla PMMA, PETG, PC, PCV i innych. RPM, posuwy, typy frezów.',
    category: 'advanced',
    readTime: '15 min',
    views: 856,
    helpful: 124,
    icon: <Settings className="w-5 h-5" />,
    tags: ['frezowanie', 'parametry', 'CNC'],
    author: 'Operator CNC',
    date: '2024-02-15'
  },
  {
    id: '12',
    title: 'Kompendium tworzyw - porównanie i zastosowania',
    excerpt: 'Pełne porównanie właściwości PMMA, PETG, PC, PCV, Dibond. Kiedy stosować każdy materiał.',
    category: 'products',
    readTime: '12 min',
    views: 723,
    helpful: 98,
    icon: <Layers className="w-5 h-5" />,
    tags: ['materiały', 'tworzywa', 'porównanie'],
    author: 'Technolog',
    date: '2024-02-18'
  },
  {
    id: '13',
    title: 'Dobór freza do materiału i zadania',
    excerpt: 'Jak wybrać odpowiedni frez: 1-ostrzowy do tworzyw, 2/3-ostrzowy do drewna, kompresyjny, V-bit.',
    category: 'advanced',
    readTime: '8 min',
    views: 567,
    helpful: 89,
    icon: <Zap className="w-5 h-5" />,
    tags: ['frezy', 'narzędzia', 'CNC'],
    author: 'Mistrz Produkcji',
    date: '2024-02-20'
  },
  {
    id: '14',
    title: 'Rozwiązywanie problemów podczas frezowania',
    excerpt: 'Topienie materiału, postrzępione krawędzie, wibracje - przyczyny i skuteczne rozwiązania.',
    category: 'troubleshooting',
    readTime: '10 min',
    views: 445,
    helpful: 178,
    icon: <AlertCircle className="w-5 h-5" />,
    tags: ['problemy', 'frezowanie', 'rozwiązania'],
    author: 'Support Techniczny',
    date: '2024-02-22'
  },
  {
    id: '15',
    title: 'Szyldy i litery 3D - od projektu do realizacji',
    excerpt: 'Kompletny przewodnik: dobór materiałów, techniki produkcji, podświetlenie LED, montaż.',
    category: 'products',
    readTime: '14 min',
    views: 892,
    helpful: 145,
    icon: <Award className="w-5 h-5" />,
    tags: ['szyldy', 'litery 3D', 'reklama'],
    author: 'Projektant',
    date: '2024-02-25'
  },
  {
    id: '16',
    title: 'Kleje do plexi - kompletny przewodnik',
    excerpt: 'Wszystko o klejach do PMMA: rodzaje, zastosowanie, techniki klejenia. Kleje cyjanoakrylowe, metakrylowe, UV.',
    category: 'advanced',
    readTime: '18 min',
    views: 1245,
    helpful: 187,
    icon: <Layers className="w-5 h-5" />,
    tags: ['kleje', 'montaż', 'technologie'],
    author: 'Technolog Klejenia',
    date: '2024-03-01'
  },
  {
    id: '17',
    title: 'Magnesy neodymowe w produkcji ekspozytorów',
    excerpt: 'Jak wykorzystać magnesy neodymowe do montażu elementów z plexi. Rodzaje, siła przyciągania, techniki mocowania.',
    category: 'products',
    readTime: '12 min',
    views: 678,
    helpful: 89,
    icon: <Shield className="w-5 h-5" />,
    tags: ['magnesy', 'montaż', 'ekspozytory'],
    author: 'Inżynier Produkcji',
    date: '2024-03-05'
  },
  {
    id: '18',
    title: 'Taśmy dwustronne 3M VHB - zastosowania',
    excerpt: 'Profesjonalne taśmy VHB do trwałego łączenia plexi z innymi materiałami. Właściwości, dobór, montaż.',
    category: 'advanced',
    readTime: '15 min',
    views: 923,
    helpful: 134,
    icon: <Package className="w-5 h-5" />,
    tags: ['taśmy', '3M', 'VHB', 'montaż'],
    author: 'Specjalista 3M',
    date: '2024-03-08'
  },
  {
    id: '19',
    title: 'Technologie klejenia UV - nowoczesne rozwiązania',
    excerpt: 'Klejenie UV dla profesjonalistów: lampy, kleje, techniki. Idealne połączenia krawędziowe bez śladów.',
    category: 'advanced',
    readTime: '20 min',
    views: 567,
    helpful: 98,
    icon: <Zap className="w-5 h-5" />,
    tags: ['UV', 'klejenie', 'technologie'],
    author: 'Ekspert UV',
    date: '2024-03-10'
  },
  {
    id: '20',
    title: 'Montaż magnetyczny - praktyczne rozwiązania',
    excerpt: 'Systemy magnetyczne w ekspozytorach: uchwyty, zamknięcia, demontowalne połączenia. Przykłady zastosowań.',
    category: 'best-practices',
    readTime: '10 min',
    views: 789,
    helpful: 112,
    icon: <Settings className="w-5 h-5" />,
    tags: ['magnesy', 'montaż', 'systemy'],
    author: 'Projektant Systemów',
    date: '2024-03-12'
  },
  {
    id: '21',
    title: 'Porównanie metod łączenia tworzyw',
    excerpt: 'Klejenie vs taśmy vs magnesy vs śruby. Kiedy stosować którą metodę? Analiza kosztów i trwałości.',
    category: 'best-practices',
    readTime: '16 min',
    views: 1034,
    helpful: 156,
    icon: <Activity className="w-5 h-5" />,
    tags: ['montaż', 'porównanie', 'technologie'],
    author: 'Kierownik Produkcji',
    date: '2024-03-15'
  },
  {
    id: '22',
    title: 'Kleje specjalistyczne - Acrifix, Cosmofen, ATK',
    excerpt: 'Przegląd profesjonalnych klejów do plexi: właściwości, zastosowania, parametry techniczne.',
    category: 'products',
    readTime: '22 min',
    views: 456,
    helpful: 78,
    icon: <Award className="w-5 h-5" />,
    tags: ['kleje', 'Acrifix', 'produkty'],
    author: 'Chemik',
    date: '2024-03-18'
  },
  {
    id: '23',
    title: 'Problem: Słabe połączenie klejone',
    excerpt: 'Dlaczego klej nie trzyma? Najczęstsze błędy przy klejeniu plexi i jak ich uniknąć.',
    category: 'troubleshooting',
    readTime: '8 min',
    views: 892,
    helpful: 234,
    icon: <AlertCircle className="w-5 h-5" />,
    tags: ['problemy', 'klejenie', 'rozwiązania'],
    author: 'Support Team',
    date: '2024-03-20'
  },
  {
    id: '24',
    title: 'Taśmy montażowe - od podstawowych do VHB',
    excerpt: 'Kompletny przewodnik po taśmach: piankowe, akrylowe, VHB. Parametry, zastosowania, trwałość.',
    category: 'products',
    readTime: '14 min',
    views: 667,
    helpful: 91,
    icon: <Layers className="w-5 h-5" />,
    tags: ['taśmy', 'montaż', 'produkty'],
    author: 'Product Manager',
    date: '2024-03-22'
  },
  {
    id: '25',
    title: 'Innowacyjne ekspozytory z magnesami',
    excerpt: 'Projektowanie ekspozytorów z wymiennymi elementami magnetycznymi. Case studies i inspiracje.',
    category: 'best-practices',
    readTime: '11 min',
    views: 534,
    helpful: 67,
    icon: <Sparkles className="w-5 h-5" />,
    tags: ['ekspozytory', 'magnesy', 'innowacje'],
    author: 'Designer',
    date: '2024-03-25'
  },
  {
    id: '26',
    title: 'Druk UV na plexi - technologia i zastosowania',
    excerpt: 'Profesjonalny druk UV na tworzywach. Parametry, przygotowanie plików, najlepsze praktyki.',
    category: 'advanced',
    readTime: '16 min',
    views: 789,
    helpful: 123,
    icon: <Layers className="w-5 h-5" />,
    tags: ['druk UV', 'technologie', 'plexi'],
    author: 'Specjalista Druku',
    date: '2024-03-28'
  },
  {
    id: '27',
    title: 'Oświetlenie LED w ekspozytorach',
    excerpt: 'Kompleksowy przewodnik po systemach LED: moduły, taśmy, sterowniki. Projektowanie podświetleń.',
    category: 'products',
    readTime: '19 min',
    views: 912,
    helpful: 156,
    icon: <Zap className="w-5 h-5" />,
    tags: ['LED', 'oświetlenie', 'ekspozytory'],
    author: 'Elektryk',
    date: '2024-04-01'
  },
  {
    id: '28',
    title: 'Gięcie i formowanie termiczne plexi',
    excerpt: 'Techniki gięcia liniowego, formowania 3D, termoformowanie próżniowe. Parametry i praktyka.',
    category: 'advanced',
    readTime: '17 min',
    views: 645,
    helpful: 98,
    icon: <Settings className="w-5 h-5" />,
    tags: ['gięcie', 'formowanie', 'termoformowanie'],
    author: 'Technolog Formowania',
    date: '2024-04-05'
  },
  {
    id: '29',
    title: 'Cięcie laserowe vs frezowanie CNC',
    excerpt: 'Porównanie technologii: kiedy laser, kiedy frez? Koszty, możliwości, ograniczenia.',
    category: 'best-practices',
    readTime: '14 min',
    views: 823,
    helpful: 178,
    icon: <Activity className="w-5 h-5" />,
    tags: ['laser', 'CNC', 'porównanie'],
    author: 'Kierownik Produkcji',
    date: '2024-04-08'
  },
  {
    id: '30',
    title: 'Wykończenie krawędzi - polerowanie i fazowanie',
    excerpt: 'Metody obróbki krawędzi: polerowanie płomieniowe, diamentowe, frezowanie. Estetyka i bezpieczeństwo.',
    category: 'advanced',
    readTime: '13 min',
    views: 556,
    helpful: 87,
    icon: <Award className="w-5 h-5" />,
    tags: ['polerowanie', 'wykończenie', 'obróbka'],
    author: 'Mistrz Produkcji',
    date: '2024-04-10'
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

                    {selectedArticle.id === '3' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Obliczanie kosztów transportu</h3>
                          <p className="text-gray-300 mb-4">
                            System automatycznie kalkuluje koszty transportu na podstawie wagi zamówienia i regionu dostawy.
                          </p>
                          <div className="bg-zinc-700/30 rounded-lg p-4 mb-4">
                            <h4 className="text-white font-semibold mb-2">Regiony dostawy:</h4>
                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                              <li>Trójmiasto i okolice (do 50km) - 0.5 zł/kg, min. 30 zł</li>
                              <li>Pomorskie - 0.8 zł/kg, min. 50 zł</li>
                              <li>Polska północna - 1.2 zł/kg, min. 80 zł</li>
                              <li>Pozostałe regiony - 1.5 zł/kg, min. 100 zł</li>
                              <li>Odbiór osobisty - 0 zł</li>
                            </ul>
                          </div>
                          <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                            <p className="text-sm text-amber-300">
                              <strong>Uwaga:</strong> Waga obliczana jest automatycznie na podstawie wymiarów, grubości i gęstości materiału.
                            </p>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '4' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Automatyczne pobieranie danych z GUS</h3>
                          <p className="text-gray-300 mb-4">
                            System integruje się z bazą REGON, umożliwiając automatyczne uzupełnianie danych firmy po wpisaniu NIP.
                          </p>
                          <ol className="list-decimal list-inside text-gray-300 space-y-3">
                            <li>W formularzu dodawania klienta wpisz NIP</li>
                            <li>Kliknij przycisk "Pobierz z GUS"</li>
                            <li>System automatycznie uzupełni:
                              <ul className="list-disc list-inside ml-6 mt-2">
                                <li>Nazwę firmy</li>
                                <li>Adres siedziby</li>
                                <li>REGON</li>
                                <li>Formę prawną</li>
                              </ul>
                            </li>
                            <li>Zweryfikuj dane i zapisz klienta</li>
                          </ol>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '5' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Wykorzystaj moc Marketplace</h3>
                          <p className="text-gray-300 mb-4">
                            Marketplace to biblioteka gotowych szablonów produktów, które możesz wykorzystać w swoich ofertach.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-white font-semibold mb-2">Jak korzystać:</h4>
                              <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
                                <li>Wejdź w zakładkę Marketplace</li>
                                <li>Przeglądaj kategorie lub użyj wyszukiwarki</li>
                                <li>Kliknij "Użyj w kalkulatorze"</li>
                                <li>Produkt zostanie automatycznie skonfigurowany</li>
                                <li>Dostosuj wymiary i dodaj do oferty</li>
                              </ol>
                            </div>
                            <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-4">
                              <h4 className="text-emerald-300 font-semibold mb-2">Korzyści:</h4>
                              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                                <li>Oszczędność czasu - do 70%</li>
                                <li>Sprawdzone konfiguracje</li>
                                <li>Profesjonalne opisy produktów</li>
                                <li>Optymalne parametry materiałowe</li>
                              </ul>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '6' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Typy ekspozytorów</h3>
                          <div className="space-y-4">
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-purple-300 font-semibold mb-2">Podstawkowy</h4>
                              <p className="text-gray-300 text-sm">Podstawa + plecy + boki + opcjonalny topper. Idealny na lady sklepowe.</p>
                            </div>
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-purple-300 font-semibold mb-2">Schodkowy</h4>
                              <p className="text-gray-300 text-sm">3-5 półek stopniowanych. Maksymalizuje widoczność produktów.</p>
                            </div>
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-purple-300 font-semibold mb-2">Z haczykami</h4>
                              <p className="text-gray-300 text-sm">Płyta perforowana pod haczyki. Do produktów w blistrach.</p>
                            </div>
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-purple-300 font-semibold mb-2">Kosmetyczny</h4>
                              <p className="text-gray-300 text-sm">Półki z ogranicznikami. Specjalnie do lakierów, pomadek itp.</p>
                            </div>
                          </div>
                        </section>

                        <section className="mt-6">
                          <h3 className="text-xl font-semibold text-white mb-3">Dobór materiału</h3>
                          <div className="bg-zinc-700/30 rounded-lg p-4">
                            <p className="text-gray-300 mb-3">Rekomendacje materiałowe:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                              <li><strong className="text-white">Plexi bezbarwna</strong> - elegancja, przezroczystość</li>
                              <li><strong className="text-white">Plexi mleczna</strong> - dyfuzja światła, podświetlenie LED</li>
                              <li><strong className="text-white">PCV spienione</strong> - lekkie, ekonomiczne na duże ekspozytory</li>
                              <li><strong className="text-white">Dibond</strong> - premium, na elementy brandingowe</li>
                            </ul>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '7' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Role i uprawnienia</h3>
                          <div className="space-y-4">
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-amber-300 font-semibold mb-2">Administrator</h4>
                              <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                <li>Pełny dostęp do systemu</li>
                                <li>Zarządzanie użytkownikami</li>
                                <li>Dostęp do raportów finansowych</li>
                                <li>Konfiguracja systemu</li>
                              </ul>
                            </div>
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-blue-300 font-semibold mb-2">Handlowiec</h4>
                              <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                <li>Tworzenie i edycja ofert</li>
                                <li>Zarządzanie własnymi klientami</li>
                                <li>Dostęp do kalkulatora</li>
                                <li>Podgląd własnych statystyk</li>
                              </ul>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '8' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Kluczowe wskaźniki KPI</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-emerald-300 font-semibold mb-2">Konwersja ofert</h4>
                              <p className="text-gray-300 text-sm">Stosunek ofert zaakceptowanych do wysłanych. Cel: &gt;30%</p>
                            </div>
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-emerald-300 font-semibold mb-2">Średnia wartość zamówienia</h4>
                              <p className="text-gray-300 text-sm">Monitoruj trend. Rosnący = rozwój biznesu</p>
                            </div>
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-emerald-300 font-semibold mb-2">Czas realizacji</h4>
                              <p className="text-gray-300 text-sm">Od oferty do dostawy. Cel: &lt;7 dni</p>
                            </div>
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-emerald-300 font-semibold mb-2">Retencja klientów</h4>
                              <p className="text-gray-300 text-sm">% powracających klientów. Cel: &gt;60%</p>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '9' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Częste problemy z generowaniem PDF</h3>
                          <div className="space-y-4">
                            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                              <h4 className="text-red-300 font-semibold mb-2">Problem: Brak danych klienta</h4>
                              <p className="text-gray-300 text-sm mb-2">PDF nie generuje się, gdy brakuje wymaganych danych.</p>
                              <p className="text-emerald-300 text-sm"><strong>Rozwiązanie:</strong> Upewnij się, że klient ma uzupełnione: NIP, nazwę, adres.</p>
                            </div>
                            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                              <h4 className="text-red-300 font-semibold mb-2">Problem: Pusta oferta</h4>
                              <p className="text-gray-300 text-sm mb-2">System nie generuje PDF dla ofert bez produktów.</p>
                              <p className="text-emerald-300 text-sm"><strong>Rozwiązanie:</strong> Dodaj przynajmniej jeden produkt do oferty.</p>
                            </div>
                            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                              <h4 className="text-red-300 font-semibold mb-2">Problem: Błąd formatowania</h4>
                              <p className="text-gray-300 text-sm mb-2">Specjalne znaki mogą powodować błędy.</p>
                              <p className="text-emerald-300 text-sm"><strong>Rozwiązanie:</strong> Unikaj znaków specjalnych w opisach. Używaj podstawowych znaków.</p>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '10' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Podstawy API PlexiSystem</h3>
                          <div className="bg-zinc-700/30 rounded-lg p-4 mb-4">
                            <h4 className="text-purple-300 font-semibold mb-2">Autoryzacja</h4>
                            <pre className="bg-zinc-900 p-3 rounded text-sm text-gray-300 overflow-x-auto">
{`headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}`}
                            </pre>
                          </div>
                          <div className="bg-zinc-700/30 rounded-lg p-4 mb-4">
                            <h4 className="text-purple-300 font-semibold mb-2">Główne endpointy</h4>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                              <li><code className="bg-zinc-900 px-2 py-1 rounded">GET /api/offers</code> - lista ofert</li>
                              <li><code className="bg-zinc-900 px-2 py-1 rounded">POST /api/offers</code> - nowa oferta</li>
                              <li><code className="bg-zinc-900 px-2 py-1 rounded">GET /api/clients</code> - lista klientów</li>
                              <li><code className="bg-zinc-900 px-2 py-1 rounded">GET /api/products</code> - katalog produktów</li>
                            </ul>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '11' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Parametry frezowania PMMA (Plexi)</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-gray-300">
                              <thead>
                                <tr className="border-b border-zinc-700">
                                  <th className="text-left p-2">Śr. [mm]</th>
                                  <th className="text-left p-2">RPM</th>
                                  <th className="text-left p-2">Posuw [mm/min]</th>
                                  <th className="text-left p-2">Typ freza</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-zinc-800"><td className="p-2">3</td><td className="p-2">20000-24000</td><td className="p-2">800-1500</td><td className="p-2">1-ostrzowy</td></tr>
                                <tr className="border-b border-zinc-800"><td className="p-2">6</td><td className="p-2">16000-20000</td><td className="p-2">1500-2800</td><td className="p-2">1-ostrzowy</td></tr>
                                <tr className="border-b border-zinc-800"><td className="p-2">10</td><td className="p-2">12000-16000</td><td className="p-2">2000-3500</td><td className="p-2">1-ostrzowy/MCD</td></tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mt-4">
                            <p className="text-sm text-blue-300">
                              <strong>Pro-tip:</strong> Utrzymuj wysoką prędkość posuwu, by uniknąć topienia materiału!
                            </p>
                          </div>
                        </section>

                        <section className="mt-6">
                          <h3 className="text-xl font-semibold text-white mb-3">Parametry frezowania PETG</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-gray-300">
                              <thead>
                                <tr className="border-b border-zinc-700">
                                  <th className="text-left p-2">Śr. [mm]</th>
                                  <th className="text-left p-2">RPM</th>
                                  <th className="text-left p-2">Posuw [mm/min]</th>
                                  <th className="text-left p-2">Uwagi</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-zinc-800"><td className="p-2">3</td><td className="p-2">16000-20000</td><td className="p-2">600-1200</td><td className="p-2">Kontrola temperatury</td></tr>
                                <tr className="border-b border-zinc-800"><td className="p-2">6</td><td className="p-2">14000-18000</td><td className="p-2">1000-2000</td><td className="p-2">Tendencja do topienia</td></tr>
                              </tbody>
                            </table>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '12' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Porównanie tworzyw</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-purple-300 font-semibold mb-3">PMMA (Plexi)</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Przezroczystość:</span>
                                  <span className="text-yellow-400">★★★★★</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Odporność UV:</span>
                                  <span className="text-yellow-400">★★★★★</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Udarośc:</span>
                                  <span className="text-yellow-400">★★☆☆☆</span>
                                </div>
                                <p className="text-emerald-300 mt-3">Najlepszy do: szyldów, gablot, displayów</p>
                              </div>
                            </div>
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                              <h4 className="text-purple-300 font-semibold mb-3">PC Lity (Poliwęglan)</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Przezroczystość:</span>
                                  <span className="text-yellow-400">★★★★☆</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Odporność UV:</span>
                                  <span className="text-yellow-400">★★★★☆</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Udarośc:</span>
                                  <span className="text-yellow-400">★★★★★</span>
                                </div>
                                <p className="text-emerald-300 mt-3">Najlepszy do: osłon maszyn, szyb bezpiecznych</p>
                              </div>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '13' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Rodzaje frezów i ich zastosowanie</h3>
                          <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-600/30">
                              <h4 className="text-purple-300 font-semibold mb-2">Frez 1-ostrzowy</h4>
                              <p className="text-gray-300 text-sm mb-2">Idealny do: Plexi, PCV, PETG, HIPS</p>
                              <p className="text-emerald-300 text-sm">Zalety: Doskonałe odprowadzanie wióra, minimalizuje topienie, gładka krawędź</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg p-4 border border-blue-600/30">
                              <h4 className="text-blue-300 font-semibold mb-2">Frez 2/3-ostrzowy</h4>
                              <p className="text-gray-300 text-sm mb-2">Idealny do: MDF, sklejka, drewno lite</p>
                              <p className="text-emerald-300 text-sm">Zalety: Większa szybkość posuwu, dobra jakość wykończenia</p>
                            </div>
                            <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-lg p-4 border border-emerald-600/30">
                              <h4 className="text-emerald-300 font-semibold mb-2">Frez kompresyjny</h4>
                              <p className="text-gray-300 text-sm mb-2">Idealny do: Płyta meblowa, sklejka, Dibond</p>
                              <p className="text-emerald-300 text-sm">Zalety: Eliminuje wyrwania na górnej i dolnej krawędzi</p>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '14' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Najczęstsze problemy i rozwiązania</h3>
                          <div className="space-y-4">
                            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                              <h4 className="text-red-300 font-semibold mb-2">Problem: Topienie się materiału</h4>
                              <p className="text-gray-300 text-sm mb-2">Przyczyny: Za wysokie obroty, za wolny posuw, tępy frez</p>
                              <div className="bg-zinc-800 rounded p-3 mt-2">
                                <p className="text-emerald-300 text-sm font-semibold mb-2">Rozwiązania:</p>
                                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
                                  <li>Zmniejsz obroty o 10-20%</li>
                                  <li>Zwiększ posuw</li>
                                  <li>Wymień frez na nowy/ostry</li>
                                  <li>Sprawdź chłodzenie/odciąg</li>
                                </ol>
                              </div>
                            </div>
                            <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                              <h4 className="text-amber-300 font-semibold mb-2">Problem: Postrzępione krawędzie</h4>
                              <p className="text-gray-300 text-sm mb-2">Przyczyny: Niewłaściwy frez, zbyt agresywne parametry</p>
                              <div className="bg-zinc-800 rounded p-3 mt-2">
                                <p className="text-emerald-300 text-sm font-semibold mb-2">Rozwiązania:</p>
                                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
                                  <li>Użyj frezu kompresyjnego</li>
                                  <li>Zmniejsz głębokość skrawania</li>
                                  <li>Zastosuj strategię obróbki zgrubnej i wykańczającej</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '15' && (
                      <>
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-3">Proces produkcji szyldów i liter 3D</h3>
                          <ol className="list-decimal list-inside text-gray-300 space-y-4">
                            <li>
                              <strong className="text-white">Projekt i przygotowanie plików</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 text-sm space-y-1">
                                <li>Konwersja logo do wektorów</li>
                                <li>Dobór wielkości i proporcji</li>
                                <li>Przygotowanie ścieżek do frezowania</li>
                              </ul>
                            </li>
                            <li>
                              <strong className="text-white">Dobór materiałów</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 text-sm space-y-1">
                                <li>Dibond - na tła i szyldy płaskie</li>
                                <li>Plexi - na fronty liter (lico)</li>
                                <li>PCV spienione - na "plecy" liter</li>
                              </ul>
                            </li>
                            <li>
                              <strong className="text-white">Frezowanie CNC</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 text-sm space-y-1">
                                <li>Wycinanie konturów liter</li>
                                <li>Fazowanie krawędzi (opcjonalnie)</li>
                                <li>Otwory montażowe</li>
                              </ul>
                            </li>
                            <li>
                              <strong className="text-white">Podświetlenie LED (opcjonalnie)</strong>
                              <ul className="list-disc list-inside ml-6 mt-2 text-sm space-y-1">
                                <li>Montaż taśm LED wewnątrz liter</li>
                                <li>Efekt halo - podświetlenie od tyłu</li>
                                <li>Zasilacz i sterowanie</li>
                              </ul>
                            </li>
                          </ol>
                        </section>
                      </>
                    )}

                    {selectedArticle.id === '16' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Kleje do plexi stanowią kluczowy element w profesjonalnej produkcji ekspozytorów. Wybór odpowiedniego kleju wpływa na estetykę i trwałość produktu.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Rodzaje klejów do PMMA:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Kleje cyjanoakrylowe (CA):</strong> Błyskawiczne wiązanie, idealne do małych powierzchni</li>
                          <li><strong>Kleje metakrylowe:</strong> Profesjonalne połączenia o wysokiej wytrzymałości</li>
                          <li><strong>Kleje UV:</strong> Niewidoczna spoina, utwardzanie lampą UV</li>
                          <li><strong>Kleje rozpuszczalnikowe:</strong> Łączenie przez rozpuszczanie powierzchni</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Techniki klejenia:</h3>
                        <ol className="space-y-2 list-decimal list-inside ml-4">
                          <li>Przygotowanie powierzchni - czyszczenie alkoholem izopropylowym</li>
                          <li>Aplikacja kleju - igłą, aplikatorem lub kapilarnie</li>
                          <li>Docisk elementów - bez nadmiernej siły</li>
                          <li>Utwardzanie - zgodnie z instrukcją producenta</li>
                        </ol>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-6">
                          <p className="text-amber-400 font-semibold">Wskazówka:</p>
                          <p className="text-gray-300 mt-1">
                            Dla najlepszych rezultatów utrzymuj temperaturę pomieszczenia w zakresie 18-25°C i wilgotność 40-60%.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedArticle.id === '17' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Magnesy neodymowe rewolucjonizują sposób montażu ekspozytorów, oferując niewidoczne i wytrzymałe połączenia.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Zastosowania w ekspozytorach:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li>Magnetyczne zamknięcia drzwiczek</li>
                          <li>Wymienne panele graficzne</li>
                          <li>Demontowalne półki i przegrody</li>
                          <li>Systemy mocowania produktów</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Parametry magnesów:</h3>
                        <table className="w-full border border-gray-600 mt-4">
                          <thead>
                            <tr className="bg-gray-800">
                              <th className="border border-gray-600 p-2">Wymiar</th>
                              <th className="border border-gray-600 p-2">Siła</th>
                              <th className="border border-gray-600 p-2">Zastosowanie</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-600 p-2">Ø10x2mm</td>
                              <td className="border border-gray-600 p-2">2.5kg</td>
                              <td className="border border-gray-600 p-2">Lekkie drzwiczki</td>
                            </tr>
                            <tr className="bg-gray-800/50">
                              <td className="border border-gray-600 p-2">Ø20x3mm</td>
                              <td className="border border-gray-600 p-2">8kg</td>
                              <td className="border border-gray-600 p-2">Średnie obciążenia</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-600 p-2">30x10x5mm</td>
                              <td className="border border-gray-600 p-2">15kg</td>
                              <td className="border border-gray-600 p-2">Ciężkie elementy</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {selectedArticle.id === '18' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Taśmy 3M VHB (Very High Bond) to przemysłowy standard w trwałym łączeniu materiałów, idealny do produkcji ekspozytorów.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Właściwości taśm VHB:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li>Wytrzymałość porównywalna ze spawaniem lub nitowaniem</li>
                          <li>Wodoodporność i odporność na UV</li>
                          <li>Kompensacja naprężeń termicznych</li>
                          <li>Niewidoczne połączenie</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Popularne modele:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>VHB 4910:</strong> Przezroczysta, 1mm, do plexi</li>
                          <li><strong>VHB 4611:</strong> Szara, 1.1mm, plexi-metal</li>
                          <li><strong>VHB 4941:</strong> Szara, 1.1mm, uniwersalna</li>
                          <li><strong>VHB 5952:</strong> Czarna, 1.1mm, najwyższa wytrzymałość</li>
                        </ul>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-6">
                          <p className="text-green-400 font-semibold">Prawidłowa aplikacja:</p>
                          <ol className="text-gray-300 mt-1 list-decimal list-inside ml-4">
                            <li>Oczyść powierzchnie alkoholem IPA</li>
                            <li>Aplikuj w temp. 15-35°C</li>
                            <li>Dociśnij z siłą min. 15 PSI</li>
                            <li>Pełna wytrzymałość po 72h</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {selectedArticle.id === '19' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Technologia klejenia UV to najnowocześniejsza metoda łączenia tworzyw, zapewniająca perfekcyjnie przezroczyste spoiny.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Zalety klejenia UV:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li>Utwardzanie w 5-60 sekund</li>
                          <li>Całkowicie przezroczysta spoina</li>
                          <li>Brak rozpuszczalników</li>
                          <li>Możliwość repozycjonowania przed utwardzeniem</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Wyposażenie:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Lampa UV LED:</strong> 365-405nm, min. 10W/cm²</li>
                          <li><strong>Klej UV:</strong> Viscosity 100-5000 mPa·s</li>
                          <li><strong>Okulary ochronne:</strong> Filtr UV400</li>
                          <li><strong>Przyrządy pozycjonujące:</strong> Uchwyty, kątowniki</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Proces klejenia:</h3>
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                          <ol className="space-y-2 list-decimal list-inside">
                            <li>Przygotuj krawędzie - polerowanie do połysku</li>
                            <li>Oczyść powierzchnie acetonem</li>
                            <li>Nałóż cienką warstwę kleju</li>
                            <li>Złóż elementy bez pęcherzyków</li>
                            <li>Naświetl lampą UV przez 30-60s</li>
                            <li>Sprawdź jakość spoiny</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {selectedArticle.id === '20' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Systemy magnetyczne w ekspozytorach to innowacyjne rozwiązanie umożliwiające szybką wymianę elementów i elastyczną aranżację.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Przykłady zastosowań:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Wymienne fronty:</strong> Szybka zmiana grafiki sezonowej</li>
                          <li><strong>Modułowe półki:</strong> Regulacja wysokości bez narzędzi</li>
                          <li><strong>Magnetyczne etykiety:</strong> Łatwa aktualizacja cen</li>
                          <li><strong>Zabezpieczenia produktów:</strong> Dyskretne mocowanie</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Systemy montażu:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-zinc-700/30 rounded-lg p-4">
                            <h4 className="text-emerald-300 font-semibold mb-2">Wpuszczane</h4>
                            <p className="text-gray-300 text-sm">Magnesy frezowane w materiale, niewidoczne połączenie</p>
                          </div>
                          <div className="bg-zinc-700/30 rounded-lg p-4">
                            <h4 className="text-emerald-300 font-semibold mb-2">Naklejane</h4>
                            <p className="text-gray-300 text-sm">Magnesy z klejem 3M, szybki montaż</p>
                          </div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
                          <p className="text-blue-400 font-semibold">Kalkulator siły:</p>
                          <p className="text-gray-300 mt-1">
                            Siła potrzebna = Waga elementu × 3 (współczynnik bezpieczeństwa)
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedArticle.id === '21' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Wybór metody łączenia tworzyw ma kluczowy wpływ na koszt, czas produkcji i jakość końcowego produktu.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Porównanie metod:</h3>
                        <table className="w-full border border-gray-600 mt-4 text-sm">
                          <thead>
                            <tr className="bg-gray-800">
                              <th className="border border-gray-600 p-2">Metoda</th>
                              <th className="border border-gray-600 p-2">Koszt</th>
                              <th className="border border-gray-600 p-2">Czas</th>
                              <th className="border border-gray-600 p-2">Wytrzymałość</th>
                              <th className="border border-gray-600 p-2">Estetyka</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-600 p-2">Klejenie</td>
                              <td className="border border-gray-600 p-2">$</td>
                              <td className="border border-gray-600 p-2">Średni</td>
                              <td className="border border-gray-600 p-2">★★★★★</td>
                              <td className="border border-gray-600 p-2">★★★★★</td>
                            </tr>
                            <tr className="bg-gray-800/50">
                              <td className="border border-gray-600 p-2">Taśmy VHB</td>
                              <td className="border border-gray-600 p-2">$$</td>
                              <td className="border border-gray-600 p-2">Szybki</td>
                              <td className="border border-gray-600 p-2">★★★★☆</td>
                              <td className="border border-gray-600 p-2">★★★★☆</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-600 p-2">Magnesy</td>
                              <td className="border border-gray-600 p-2">$$</td>
                              <td className="border border-gray-600 p-2">Średni</td>
                              <td className="border border-gray-600 p-2">★★★☆☆</td>
                              <td className="border border-gray-600 p-2">★★★★★</td>
                            </tr>
                            <tr className="bg-gray-800/50">
                              <td className="border border-gray-600 p-2">Śruby</td>
                              <td className="border border-gray-600 p-2">$</td>
                              <td className="border border-gray-600 p-2">Długi</td>
                              <td className="border border-gray-600 p-2">★★★★☆</td>
                              <td className="border border-gray-600 p-2">★★☆☆☆</td>
                            </tr>
                          </tbody>
                        </table>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Rekomendacje:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Premium/wystawy:</strong> Klejenie UV lub Acrifix</li>
                          <li><strong>Produkcja seryjna:</strong> Taśmy VHB</li>
                          <li><strong>Elementy wymienne:</strong> Magnesy</li>
                          <li><strong>Budżetowe:</strong> Śruby z kapturkami</li>
                        </ul>
                      </div>
                    )}

                    {selectedArticle.id === '22' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Przegląd profesjonalnych klejów specjalistycznych stosowanych w branży reklamy wizualnej.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Acrifix (Evonik):</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Acrifix 192:</strong> Klej polimeryzacyjny, spoina jak lity materiał</li>
                          <li><strong>Acrifix 1S 0116:</strong> Szybkoschnący, do małych powierzchni</li>
                          <li><strong>Acrifix 1R 0192:</strong> Reaktywny, wypełnia szczeliny do 0.5mm</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Cosmofen (Weiss):</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Cosmofen 345:</strong> Do PVC twardego</li>
                          <li><strong>Cosmofen PMMA:</strong> Specjalnie do plexi</li>
                          <li><strong>Cosmofen Plus HV:</strong> Wysokiej lepkości, wypełniający</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">ATK:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>ATK 812:</strong> Uniwersalny do tworzyw</li>
                          <li><strong>ATK FIX:</strong> Błyskawiczny, pozycjonowanie</li>
                          <li><strong>ATK PU50:</strong> Elastyczny, do różnych materiałów</li>
                        </ul>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
                          <p className="text-red-400 font-semibold">Bezpieczeństwo:</p>
                          <ul className="text-gray-300 mt-1 list-disc list-inside ml-4">
                            <li>Zawsze pracuj w wentylowanym pomieszczeniu</li>
                            <li>Używaj środków ochrony osobistej</li>
                            <li>Przechowuj w temp. 5-25°C</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {selectedArticle.id === '23' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Problemy z klejeniem to najczęstsze wyzwanie w produkcji. Poznaj przyczyny i skuteczne rozwiązania.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Najczęstsze błędy:</h3>
                        <div className="space-y-4">
                          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                            <h4 className="text-red-300 font-semibold mb-2">1. Brudne powierzchnie</h4>
                            <p className="text-gray-300 text-sm mb-2">Tłuszcz, kurz, odciski palców uniemożliwiają właściwe związanie</p>
                            <p className="text-emerald-300 text-sm"><strong>Rozwiązanie:</strong> Czyszczenie alkoholem IPA 99%</p>
                          </div>
                          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                            <h4 className="text-red-300 font-semibold mb-2">2. Niewłaściwa temperatura</h4>
                            <p className="text-gray-300 text-sm mb-2">Zbyt niska temperatura spowalnia lub uniemożliwia utwardzanie</p>
                            <p className="text-emerald-300 text-sm"><strong>Rozwiązanie:</strong> Pracuj w temp. 18-25°C</p>
                          </div>
                          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                            <h4 className="text-red-300 font-semibold mb-2">3. Za dużo kleju</h4>
                            <p className="text-gray-300 text-sm mb-2">Nadmiar kleju wydłuża czas utwardzania i psuje estetykę</p>
                            <p className="text-emerald-300 text-sm"><strong>Rozwiązanie:</strong> Cienka, równomierna warstwa</p>
                          </div>
                          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                            <h4 className="text-red-300 font-semibold mb-2">4. Zły dobór kleju</h4>
                            <p className="text-gray-300 text-sm mb-2">Każdy materiał wymaga odpowiedniego kleju</p>
                            <p className="text-emerald-300 text-sm"><strong>Rozwiązanie:</strong> Konsultuj kartę techniczną</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedArticle.id === '24' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Taśmy montażowe to szybkie i czyste rozwiązanie do łączenia elementów. Od podstawowych po profesjonalne VHB.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Rodzaje taśm:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-zinc-700/30 rounded-lg p-4">
                            <h4 className="text-purple-300 font-semibold mb-2">Piankowe</h4>
                            <p className="text-gray-300 text-sm">Grubość: 0.8-3mm<br/>Kompensują nierówności<br/>Zastosowanie: tymczasowe</p>
                          </div>
                          <div className="bg-zinc-700/30 rounded-lg p-4">
                            <h4 className="text-purple-300 font-semibold mb-2">Akrylowe</h4>
                            <p className="text-gray-300 text-sm">Grubość: 0.1-0.5mm<br/>Wysoka przezroczystość<br/>Zastosowanie: trwałe</p>
                          </div>
                          <div className="bg-zinc-700/30 rounded-lg p-4">
                            <h4 className="text-purple-300 font-semibold mb-2">VHB</h4>
                            <p className="text-gray-300 text-sm">Grubość: 0.5-3mm<br/>Ekstremalna wytrzymałość<br/>Zastosowanie: konstrukcyjne</p>
                          </div>
                          <div className="bg-zinc-700/30 rounded-lg p-4">
                            <h4 className="text-purple-300 font-semibold mb-2">Transferowe</h4>
                            <p className="text-gray-300 text-sm">Bez nośnika<br/>Minimalna grubość<br/>Zastosowanie: precyzyjne</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Parametry techniczne:</h3>
                        <table className="w-full border border-gray-600 mt-4 text-sm">
                          <thead>
                            <tr className="bg-gray-800">
                              <th className="border border-gray-600 p-2">Typ</th>
                              <th className="border border-gray-600 p-2">Adhezja</th>
                              <th className="border border-gray-600 p-2">Temp. pracy</th>
                              <th className="border border-gray-600 p-2">UV</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-600 p-2">Piankowa</td>
                              <td className="border border-gray-600 p-2">10-50 N/25mm</td>
                              <td className="border border-gray-600 p-2">-20 do +60°C</td>
                              <td className="border border-gray-600 p-2">Nie</td>
                            </tr>
                            <tr className="bg-gray-800/50">
                              <td className="border border-gray-600 p-2">VHB</td>
                              <td className="border border-gray-600 p-2">60-120 N/25mm</td>
                              <td className="border border-gray-600 p-2">-40 do +150°C</td>
                              <td className="border border-gray-600 p-2">Tak</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {selectedArticle.id === '25' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Innowacyjne ekspozytory z systemami magnetycznymi to przyszłość merchandisingu. Maksymalna elastyczność przy minimalnym nakładzie pracy.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Case study: Ekspozytor kosmetyczny</h3>
                        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-600/30">
                          <h4 className="text-purple-300 font-semibold mb-2">Wyzwanie:</h4>
                          <p className="text-gray-300 text-sm mb-3">Częsta zmiana układu produktów, sezonowość, różne wielkości opakowań</p>
                          <h4 className="text-purple-300 font-semibold mb-2">Rozwiązanie:</h4>
                          <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                            <li>Tył z blachy ferromagnetycznej</li>
                            <li>Półki z plexi z magnesami neodymowymi</li>
                            <li>Magnetyczne separatory i ograniczniki</li>
                            <li>Wymienne toppery sezonowe</li>
                          </ul>
                          <h4 className="text-purple-300 font-semibold mb-2 mt-3">Rezultat:</h4>
                          <p className="text-emerald-300 text-sm">Czas zmiany ekspozycji skrócony o 85%, ROI w 3 miesiące</p>
                        </div>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Inspiracje projektowe:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Modułowe ściany:</strong> Panele A4/A3 z magnetycznym mocowaniem</li>
                          <li><strong>Systemy haków:</strong> Magnetyczne listwy z przesuwanymi hakami</li>
                          <li><strong>Interaktywne demo:</strong> Produkty na magnesach - klient może dotknąć</li>
                          <li><strong>Quick change graphics:</strong> Wymiana grafik w 30 sekund</li>
                        </ul>
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-6">
                          <p className="text-emerald-400 font-semibold">Wskazówka projektowa:</p>
                          <p className="text-gray-300 mt-1">
                            Planuj rozmieszczenie magnesów symetrycznie - ułatwi to przyszłe modyfikacje i zachowa estetykę.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedArticle.id === '26' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Druk UV to innowacyjna technologia bezpośredniego nadruku na tworzywach sztucznych, oferująca wyjątkową trwałość i jakość.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Zalety druku UV:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li>Natychmiastowe schnicie - brak czasu oczekiwania</li>
                          <li>Odporność na ścieranie i UV</li>
                          <li>Możliwość druku białym kolorem</li>
                          <li>Druk na materiałach do 100mm grubości</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Parametry techniczne:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Rozdzielczość:</strong> do 1440 dpi</li>
                          <li><strong>Kolory:</strong> CMYK + White + Varnish</li>
                          <li><strong>Grubość materiału:</strong> do 100mm</li>
                          <li><strong>Format:</strong> do 2500x3000mm</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Przygotowanie plików:</h3>
                        <ol className="space-y-2 list-decimal list-inside ml-4">
                          <li>Format: PDF, EPS, AI (wektory) lub TIFF (300dpi)</li>
                          <li>Kolory w CMYK + ewentualnie warstwa biała</li>
                          <li>Spady: min. 3mm</li>
                          <li>Teksty zamienione na krzywe</li>
                        </ol>
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-6">
                          <p className="text-purple-400 font-semibold">Wskazówka:</p>
                          <p className="text-gray-300 mt-1">
                            Przy druku na plexi mlecznej użyj warstwy białej jako podkładu dla intensywnych kolorów.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedArticle.id === '27' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Prawidłowo zaprojektowane oświetlenie LED może całkowicie zmienić odbiór ekspozytora, przyciągając uwagę klientów.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Rodzaje oświetlenia LED:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Taśmy LED:</strong> Elastyczne, idealne do konturów</li>
                          <li><strong>Moduły LED:</strong> Mocne, równomierne światło</li>
                          <li><strong>LED Edge:</strong> Podświetlenie krawędziowe</li>
                          <li><strong>LED RGB:</strong> Zmiana kolorów, efekty</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Parametry LED:</h3>
                        <table className="w-full border border-gray-600 mt-4">
                          <thead>
                            <tr className="bg-gray-800">
                              <th className="border border-gray-600 p-2">Typ</th>
                              <th className="border border-gray-600 p-2">Moc</th>
                              <th className="border border-gray-600 p-2">Barwa</th>
                              <th className="border border-gray-600 p-2">Zastosowanie</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-600 p-2">Taśma 3528</td>
                              <td className="border border-gray-600 p-2">4.8W/m</td>
                              <td className="border border-gray-600 p-2">3000-6500K</td>
                              <td className="border border-gray-600 p-2">Kontury</td>
                            </tr>
                            <tr className="bg-gray-800/50">
                              <td className="border border-gray-600 p-2">Taśma 5050</td>
                              <td className="border border-gray-600 p-2">14.4W/m</td>
                              <td className="border border-gray-600 p-2">RGB/RGBW</td>
                              <td className="border border-gray-600 p-2">Efekty</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-600 p-2">Moduły</td>
                              <td className="border border-gray-600 p-2">1.5-3W/szt</td>
                              <td className="border border-gray-600 p-2">6500K</td>
                              <td className="border border-gray-600 p-2">Kasetony</td>
                            </tr>
                          </tbody>
                        </table>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Projektowanie oświetlenia:</h3>
                        <ol className="space-y-2 list-decimal list-inside ml-4">
                          <li>Określ cel - akcentowanie czy ogólne oświetlenie</li>
                          <li>Dobierz moc - 1000-2000 lm/m² dla kasetonów</li>
                          <li>Wybierz barwę - 4000K neutralna, 6500K chłodna</li>
                          <li>Zaplanuj zasilanie - co 5m dla taśm</li>
                          <li>Dodaj sterownik - ściemnianie, efekty</li>
                        </ol>
                      </div>
                    )}

                    {selectedArticle.id === '28' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Gięcie i formowanie termiczne pozwala tworzyć z płaskich arkuszy plexi trójwymiarowe formy o nieograniczonych możliwościach.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Techniki gięcia:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Gięcie liniowe:</strong> Grzanie wzdłuż linii, kąty do 180°</li>
                          <li><strong>Gięcie promieni:</strong> Duże łuki w piecu</li>
                          <li><strong>Formowanie 3D:</strong> Złożone kształty na formach</li>
                          <li><strong>Termoformowanie próżniowe:</strong> Precyzyjne odwzorowanie formy</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Parametry gięcia PMMA:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Temperatura gięcia:</strong> 150-170°C</li>
                          <li><strong>Czas nagrzewania:</strong> 1 min/mm grubości</li>
                          <li><strong>Chłodzenie:</strong> Powolne, unikaj szoku termicznego</li>
                          <li><strong>Minimalny promień:</strong> 2x grubość materiału</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Proces termoformowania:</h3>
                        <ol className="space-y-2 list-decimal list-inside ml-4">
                          <li>Przygotowanie formy - gładka, bez podcieni</li>
                          <li>Mocowanie płyty w ramie</li>
                          <li>Nagrzewanie do plastyczności</li>
                          <li>Formowanie próżnią/ciśnieniem</li>
                          <li>Chłodzenie na formie</li>
                          <li>Przycinanie i wykończenie</li>
                        </ol>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-6">
                          <p className="text-amber-400 font-semibold">Uwaga:</p>
                          <p className="text-gray-300 mt-1">
                            Zbyt szybkie nagrzewanie może spowodować pęcherze w materiale. Zachowaj cierpliwość!
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedArticle.id === '29' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Wybór między laserem a frezarką CNC ma kluczowy wpływ na jakość, czas i koszt produkcji.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Porównanie technologii:</h3>
                        <table className="w-full border border-gray-600 mt-4 text-sm">
                          <thead>
                            <tr className="bg-gray-800">
                              <th className="border border-gray-600 p-2">Kryterium</th>
                              <th className="border border-gray-600 p-2">Laser CO2</th>
                              <th className="border border-gray-600 p-2">Frezarka CNC</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-600 p-2">Prędkość</td>
                              <td className="border border-gray-600 p-2">★★★★★</td>
                              <td className="border border-gray-600 p-2">★★★☆☆</td>
                            </tr>
                            <tr className="bg-gray-800/50">
                              <td className="border border-gray-600 p-2">Precyzja</td>
                              <td className="border border-gray-600 p-2">★★★★★</td>
                              <td className="border border-gray-600 p-2">★★★★☆</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-600 p-2">Grubość materiału</td>
                              <td className="border border-gray-600 p-2">Do 20mm</td>
                              <td className="border border-gray-600 p-2">Do 100mm+</td>
                            </tr>
                            <tr className="bg-gray-800/50">
                              <td className="border border-gray-600 p-2">Krawędź</td>
                              <td className="border border-gray-600 p-2">Polerowana</td>
                              <td className="border border-gray-600 p-2">Matowa</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-600 p-2">Koszt/szt</td>
                              <td className="border border-gray-600 p-2">Niski</td>
                              <td className="border border-gray-600 p-2">Średni</td>
                            </tr>
                          </tbody>
                        </table>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Kiedy użyć lasera:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li>Skomplikowane kontury i małe detale</li>
                          <li>Materiały do 20mm grubości</li>
                          <li>Potrzeba polerowanej krawędzi</li>
                          <li>Duże serie produkcyjne</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Kiedy użyć frezarki:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li>Grube materiały (&gt;20mm)</li>
                          <li>Fazowanie krawędzi</li>
                          <li>Frezowanie kieszeni i rowków</li>
                          <li>Obróbka 3D</li>
                        </ul>
                      </div>
                    )}

                    {selectedArticle.id === '30' && (
                      <div className="space-y-4 text-gray-300">
                        <p>
                          Profesjonalne wykończenie krawędzi to różnica między produktem amatorskim a premium.
                        </p>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Metody polerowania:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Polerowanie płomieniowe:</strong> Szybkie, idealna przejrzystość</li>
                          <li><strong>Polerowanie diamentowe:</strong> Precyzyjne, bez odkształceń</li>
                          <li><strong>Polerowanie mechaniczne:</strong> Duże powierzchnie</li>
                          <li><strong>Polerowanie chemiczne:</strong> Skomplikowane kształty</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Proces polerowania płomieniowego:</h3>
                        <ol className="space-y-2 list-decimal list-inside ml-4">
                          <li>Przygotowanie - frezowanie na wymiar</li>
                          <li>Czyszczenie krawędzi</li>
                          <li>Regulacja płomienia - niebieski, ostry</li>
                          <li>Szybki ruch wzdłuż krawędzi</li>
                          <li>Chłodzenie naturalne</li>
                        </ol>
                        <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">Fazowanie krawędzi:</h3>
                        <ul className="space-y-2 list-disc list-inside ml-4">
                          <li><strong>Faza 45°:</strong> Standard, bezpieczeństwo</li>
                          <li><strong>Faza 30°:</strong> Delikatna, estetyczna</li>
                          <li><strong>Zaokrąglenie:</strong> Premium, bezpieczne</li>
                          <li><strong>Faza dwustronna:</strong> Symetria, elegancja</li>
                        </ul>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
                          <p className="text-blue-400 font-semibold">Pro tip:</p>
                          <p className="text-gray-300 mt-1">
                            Przy polerowaniu płomieniowym utrzymuj stałą prędkość i odległość dla równomiernego efektu.
                          </p>
                        </div>
                      </div>
                    )}
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