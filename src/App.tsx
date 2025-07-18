import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, Calculator, FileText, User, Settings, Eye, Bell, BarChart2, Users, Database, Package, Sun, Moon, Brain, Activity, Book, LogOut, X, ShoppingBag } from 'lucide-react';
import { OfferProvider } from '@/context/OfferContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { UserProvider, useUser, users } from '@/context/UserContext';
import { HomePage } from '@/pages/HomePage';
import Dashboard from '@/pages/Dashboard';
import { OfferView } from '@/pages/OfferView';
import { OfferAcceptance } from '@/pages/OfferAcceptance';
import { PublicOffer } from '@/pages/PublicOffer';
import { ClientPanel } from '@/pages/ClientPanel';
import { Calculator as CalculatorPage } from '@/components/quotation/Calculator';
import { ProductionPage } from '@/pages/ProductionPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { PublicConfigurator } from '@/pages/configurator/PublicConfigurator';
import { salespeople } from '@/constants/materials';
import { ClientsPage } from '@/pages/ClientsPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { AutomationSettings } from '@/pages/AutomationSettings';
import { AIAssistant } from '@/pages/AIAssistant';
import { KnowledgeBase } from '@/pages/KnowledgeBase';
import { Marketplace } from '@/pages/Marketplace';
// import { LoginPage } from '@/pages/LoginPage';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  date: string;
}

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, setCurrentUser } = useUser();
  const [viewMode, setViewMode] = useState<'salesperson' | 'client'>('salesperson');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'info',
      message: '👋 Witaj w systemie PlexiSystem!',
      date: new Date().toISOString(),
    },
  ]);
  const [stats, setStats] = useState({
    totalOffers: 0,
    acceptedOffers: 0,
    pendingOffers: 0,
    totalClients: 0
  });

  const isPublicRoute = window.location.pathname.startsWith('/offer/accept/') || 
    window.location.pathname.startsWith('/oferta/') || 
    window.location.pathname.startsWith('/panel/') ||
    window.location.pathname.startsWith('/configurator/public/');

  useEffect(() => {
    // Register service worker for PWA - wyłączone tymczasowo
    // if ('serviceWorker' in navigator) {
    //   window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/service-worker.js')
    //       .then(registration => console.log('SW registered: ', registration))
    //       .catch(registrationError => console.log('SW registration failed: ', registrationError));
    //   });
    // }

    fetchQuickStats();
    checkExpiringOffers();
  }, []);

  const fetchQuickStats = async () => {
    try {
      // Nie pobieramy danych z Supabase - używamy danych lokalnych
      setStats({
        totalOffers: 42,
        acceptedOffers: 18,
        pendingOffers: 12,
        totalClients: 28
      });
    } catch (error) {
      console.error('Błąd pobierania statystyk:', error);
    }
  };

  const checkExpiringOffers = async () => {
    try {
      // Nie sprawdzamy wygasających ofert - używamy lokalnych powiadomień
    } catch (error) {
      console.error('Błąd sprawdzania wygasających ofert:', error);
    }
  };

  // Dla publicznych linków nie pokazuj nawigacji
  if (isPublicRoute) {
    return (
      <Router>
        <Routes>
          <Route path="/offer/accept/:shareId" element={<OfferAcceptance />} />
          <Route path="/oferta/:token" element={<PublicOffer />} />
          <Route path="/panel/:token" element={<ClientPanel />} />
          <Route path="/configurator/public/:token" element={<PublicConfigurator />} />
        </Routes>
      </Router>
    );
  }

  return (
    <OfferProvider>
      <Router>
        <div className="min-h-screen bg-zinc-900 dark:bg-zinc-950 text-white transition-colors duration-300">
          {/* Header */}
          <header className="bg-zinc-800 border-b border-zinc-700">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4 lg:gap-6 w-full lg:w-auto">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="lg:hidden p-2 hover:bg-zinc-700 rounded-lg transition-all"
                  >
                    {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                  <h1 className="text-xl lg:text-2xl font-bold text-orange-500 gradient-text flex-shrink-0">PlexiSystem</h1>
                  <nav className="hidden lg:flex gap-1 overflow-x-auto">
                    <a
                      href="/dashboard"
                      className="px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm"
                    >
                      <BarChart2 className="w-4 h-4" />
                      Dashboard
                    </a>
                    <a
                      href="/offers"
                      className="px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Oferty
                    </a>
                    <a
                      href="/calculator"
                      className="px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm"
                    >
                      <Calculator className="w-4 h-4" />
                      Kalkulator
                    </a>
                    <a
                      href="/production"
                      className="px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm"
                    >
                      <Settings className="w-4 h-4" />
                      Produkcja
                    </a>
                    <a
                      href="/clients"
                      className="px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2 whitespace-nowrap text-sm"
                    >
                      <Users className="w-4 h-4" />
                      Klienci
                    </a>
                    <a
                      href="/marketplace"
                      className="px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2 relative whitespace-nowrap text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Marketplace
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-purple-500 text-xs rounded-full animate-pulse">
                        HOT
                      </span>
                    </a>
                    <a
                      href="/ai"
                      className="px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2 relative whitespace-nowrap text-sm"
                    >
                      <Brain className="w-4 h-4" />
                      AI
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-orange-500 text-xs rounded-full animate-pulse">
                        NEW
                      </span>
                    </a>
                  </nav>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                  {/* Mini statystyki */}
                  <div className="hidden xl:flex items-center gap-2 lg:gap-4 text-xs lg:text-sm">
                    <div className="bg-zinc-700 px-2 lg:px-3 py-1 rounded-lg">
                      <span className="text-gray-400">Oferty: </span>
                      <span className="font-semibold">{stats.totalOffers}</span>
                    </div>
                    <div className="bg-green-900 px-2 lg:px-3 py-1 rounded-lg">
                      <span className="text-green-400">Zaakceptowane: </span>
                      <span className="font-semibold">{stats.acceptedOffers}</span>
                    </div>
                    {stats.pendingOffers > 0 && (
                      <div className="bg-yellow-900 px-2 lg:px-3 py-1 rounded-lg">
                        <span className="text-yellow-400">Oczekujące: </span>
                        <span className="font-semibold">{stats.pendingOffers}</span>
                      </div>
                    )}
                  </div>

                  {/* Przełącznik motywu */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-zinc-700 dark:hover:bg-zinc-600 rounded-lg transition-all"
                    title={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-700" />
                    )}
                  </button>

                  {/* Przełącznik trybu widoku */}
                  <div className="flex items-center gap-2 bg-zinc-700 rounded-lg px-2 lg:px-3 py-1 lg:py-2">
                    <button
                      onClick={() => setViewMode('salesperson')}
                      className={`px-2 lg:px-3 py-1 rounded transition-all ${
                        viewMode === 'salesperson'
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="Tryb handlowca - pełne dane"
                    >
                      <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('client')}
                      className={`px-2 lg:px-3 py-1 rounded transition-all ${
                        viewMode === 'client'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="Tryb klienta - widok publiczny"
                    >
                      <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                  </div>

                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">
                      Tryb:{' '}
                      <span className="font-semibold">
                        {viewMode === 'salesperson' ? 'Handlowiec' : 'Klient'}
                      </span>
                    </p>
                    <p className="font-semibold text-sm">{currentUser.name}</p>
                  </div>

                  {/* Powiadomienia */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 hover:bg-zinc-700 rounded-lg transition-all relative"
                    >
                      <Bell className="w-5 h-5" />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full px-1.5 py-0.5 text-xs">
                          {notifications.length}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 top-12 w-96 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 max-h-96 overflow-y-auto z-50">
                        <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
                          <h3 className="font-semibold">Powiadomienia</h3>
                          {notifications.length > 0 && (
                            <button
                              onClick={() => setNotifications([])}
                              className="text-xs text-gray-400 hover:text-white"
                            >
                              Wyczyść wszystkie
                            </button>
                          )}
                        </div>
                        <div className="p-2">
                          {notifications.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">Brak powiadomień</p>
                          ) : (
                            notifications
                              .slice()
                              .reverse()
                              .map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`p-3 hover:bg-zinc-700 rounded-lg mb-2 border-l-4 ${
                                    notification.type === 'success'
                                      ? 'border-green-500'
                                      : notification.type === 'error'
                                      ? 'border-red-500'
                                      : notification.type === 'warning'
                                      ? 'border-yellow-500'
                                      : 'border-blue-500'
                                  }`}
                                >
                                  <p className="text-sm">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.date).toLocaleString('pl-PL')}
                                  </p>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Wybór użytkownika */}
                  <div className="flex items-center gap-2 bg-zinc-700 rounded-lg px-2 lg:px-3 py-1 lg:py-2">
                    <User className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                    <select
                      value={currentUser.id}
                      onChange={(e) => {
                        const newUser = users.find((u) => u.id === e.target.value);
                        if (newUser) {
                          setCurrentUser(newUser);
                          setNotifications((prev) => [
                            ...prev,
                            {
                              id: Date.now(),
                              type: 'info',
                              message: `👤 Przełączono na użytkownika: ${newUser.name}`,
                              date: new Date().toISOString(),
                            },
                          ]);
                        }
                      }}
                      className="bg-transparent text-xs lg:text-sm pr-8"
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id} className="bg-zinc-800">
                          {user.name} ({user.role === 'admin' ? 'Admin' : 'Handlowiec'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Wylogowanie - tymczasowo wyłączone
                  {user && (
                    <button
                      onClick={() => signOut()}
                      className="p-2 hover:bg-zinc-700 rounded-lg transition-all flex items-center gap-2"
                      title="Wyloguj"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm">Wyloguj</span>
                    </button>
                  )}
                  */}
                </div>
              </div>
            </div>
          </header>

          {/* Menu mobilne */}
          {showMobileMenu && (
            <div className="lg:hidden bg-zinc-800 border-b border-zinc-700">
              <nav className="flex flex-col p-4 space-y-2">
                <a
                  href="/offers"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FileText className="w-4 h-4" />
                  Oferty
                </a>
                <a
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <BarChart2 className="w-4 h-4" />
                  Dashboard
                </a>
                <a
                  href="/clients"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Users className="w-4 h-4" />
                  Klienci
                </a>
                <a
                  href="/calculator"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Calculator className="w-4 h-4" />
                  Kalkulator
                </a>
                <a
                  href="/products"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Package className="w-4 h-4" />
                  Produkty
                </a>
                <a
                  href="/production"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Produkcja
                </a>
                <a
                  href="/reports"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Activity className="w-4 h-4" />
                  Raporty
                </a>
                <a
                  href="/ai"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2 relative"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Brain className="w-4 h-4" />
                  AI
                  <span className="absolute top-2 left-12 px-1.5 py-0.5 bg-orange-500 text-xs rounded-full animate-pulse">
                    NEW
                  </span>
                </a>
                <a
                  href="/knowledge"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Book className="w-4 h-4" />
                  Wiedza
                </a>
                <a
                  href="/marketplace"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2 relative"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Marketplace
                  <span className="absolute top-2 left-20 px-1.5 py-0.5 bg-purple-500 text-xs rounded-full animate-pulse">
                    HOT
                  </span>
                </a>
                <a
                  href="/settings"
                  className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Ustawienia
                </a>
              </nav>
            </div>
          )}

          {/* Main content */}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Tymczasowo wyłączone dla testów
              <Route path="/login" element={<LoginPage />} />
              */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/offers" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/production" element={<ProductionPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/settings" element={<AutomationSettings />} />
              <Route path="/offer/new" element={<OfferView />} />
              <Route path="/offer/:id" element={<OfferView />} />
              <Route
                path="/calculator"
                element={
                  <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Kalkulator produktów</h1>
                    <CalculatorPage
                      onAddToOffer={(item) => {
                        // Przekieruj do nowej oferty z pozycją
                        window.location.href = '/offer/new';
                      }}
                      viewMode={viewMode}
                    />
                  </div>
                }
              />
              <Route path="/offer/accept/:shareId" element={<OfferAcceptance />} />
              <Route path="/oferta/:token" element={<PublicOffer />} />
              <Route path="/panel/:token" element={<ClientPanel />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </OfferProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;