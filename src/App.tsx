import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, Calculator, FileText, User, Settings, Eye, Bell, BarChart2, Users, Database, Package } from 'lucide-react';
import { OfferProvider } from '@/context/OfferContext';
import { HomePage } from '@/pages/HomePage';
import { OfferView } from '@/pages/OfferView';
import { OfferAcceptance } from '@/pages/OfferAcceptance';
import { PublicOffer } from '@/pages/PublicOffer';
import { Calculator as CalculatorPage } from '@/components/quotation/Calculator';
import Dashboard from './Dashboard';
import { salespeople } from '@/constants/materials';
import { supabase } from '@/lib/supabaseClient';

// Import komponentów (dodaj je jako osobne pliki)
// import ClientsPage from './pages/ClientsPage';
// import ProductsPage from './pages/ProductsPage';
// import SettingsPage from './pages/SettingsPage';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  date: string;
}

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'salesperson' | 'client'>('salesperson');
  const [currentUser, setCurrentUser] = useState(salespeople[0]);
  const [showNotifications, setShowNotifications] = useState(false);
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

  const isPublicRoute = window.location.pathname.startsWith('/offer/accept/') || window.location.pathname.startsWith('/oferta/');

  useEffect(() => {
    fetchQuickStats();
    checkExpiringOffers();
  }, []);

  const fetchQuickStats = async () => {
    try {
      // Pobierz statystyki ofert
      const { data: offersData } = await supabase
        .from('offers')
        .select('status', { count: 'exact' });

      // Pobierz liczbę klientów
      const { data: clientsData } = await supabase
        .from('clients')
        .select('id', { count: 'exact' });

      if (offersData) {
        setStats({
          totalOffers: offersData.length,
          acceptedOffers: offersData.filter(o => o.status === 'accepted').length,
          pendingOffers: offersData.filter(o => o.status === 'sent').length,
          totalClients: clientsData?.length || 0
        });
      }
    } catch (error) {
      console.error('Błąd pobierania statystyk:', error);
    }
  };

  const checkExpiringOffers = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data: expiringOffers } = await supabase
        .from('offers')
        .select('offer_number, valid_until')
        .eq('status', 'sent')
        .lte('valid_until', tomorrow.toISOString())
        .gte('valid_until', new Date().toISOString());

      if (expiringOffers && expiringOffers.length > 0) {
        setNotifications(prev => [
          ...prev,
          {
            id: Date.now(),
            type: 'warning',
            message: `⏰ Masz ${expiringOffers.length} ofert(y) wygasające w ciągu 24h!`,
            date: new Date().toISOString()
          }
        ]);
      }
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
        </Routes>
      </Router>
    );
  }

  return (
    <OfferProvider>
      <Router>
        <div className="min-h-screen bg-zinc-900 text-white">
          {/* Header */}
          <header className="bg-zinc-800 border-b border-zinc-700">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <h1 className="text-2xl font-bold text-orange-500">PlexiSystem</h1>
                  <nav className="flex gap-2">
                    <a
                      href="/"
                      className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Oferty
                    </a>
                    <a
                      href="/dashboard"
                      className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                    >
                      <BarChart2 className="w-4 h-4" />
                      Dashboard
                    </a>
                    <a
                      href="/clients"
                      className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Klienci
                    </a>
                    <a
                      href="/calculator"
                      className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                    >
                      <Calculator className="w-4 h-4" />
                      Kalkulator
                    </a>
                    <a
                      href="/products"
                      className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      Produkty
                    </a>
                    <a
                      href="/settings"
                      className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Ustawienia
                    </a>
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mini statystyki */}
                  <div className="hidden lg:flex items-center gap-4 text-sm">
                    <div className="bg-zinc-700 px-3 py-1 rounded-lg">
                      <span className="text-gray-400">Oferty: </span>
                      <span className="font-semibold">{stats.totalOffers}</span>
                    </div>
                    <div className="bg-green-900 px-3 py-1 rounded-lg">
                      <span className="text-green-400">Zaakceptowane: </span>
                      <span className="font-semibold">{stats.acceptedOffers}</span>
                    </div>
                    {stats.pendingOffers > 0 && (
                      <div className="bg-yellow-900 px-3 py-1 rounded-lg">
                        <span className="text-yellow-400">Oczekujące: </span>
                        <span className="font-semibold">{stats.pendingOffers}</span>
                      </div>
                    )}
                  </div>

                  {/* Przełącznik trybu widoku */}
                  <div className="flex items-center gap-2 bg-zinc-700 rounded-lg px-3 py-2">
                    <button
                      onClick={() => setViewMode('salesperson')}
                      className={`px-3 py-1 rounded transition-all ${
                        viewMode === 'salesperson'
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="Tryb handlowca - pełne dane"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('client')}
                      className={`px-3 py-1 rounded transition-all ${
                        viewMode === 'client'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title="Tryb klienta - widok publiczny"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      Tryb:{' '}
                      <span className="font-semibold">
                        {viewMode === 'salesperson' ? 'Handlowiec' : 'Klient'}
                      </span>
                    </p>
                    <p className="font-semibold">{currentUser.name}</p>
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
                  <div className="flex items-center gap-2 bg-zinc-700 rounded-lg px-3 py-2">
                    <User className="w-4 h-4" />
                    <select
                      value={currentUser.id}
                      onChange={(e) => {
                        const newUser = salespeople.find((s) => s.id === e.target.value);
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
                      className="bg-transparent text-sm"
                    >
                      {salespeople.map((sp) => (
                        <option key={sp.id} value={sp.id} className="bg-zinc-800">
                          {sp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={
                <div className="text-center py-20">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h2 className="text-2xl font-bold mb-2">Moduł Klienci</h2>
                  <p className="text-gray-400">Wkrótce dostępny - zarządzanie bazą klientów z integracją GUS</p>
                </div>
              } />
              <Route path="/products" element={
                <div className="text-center py-20">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h2 className="text-2xl font-bold mb-2">Moduł Produkty</h2>
                  <p className="text-gray-400">Wkrótce dostępny - zarządzanie katalogiem produktów</p>
                </div>
              } />
              <Route path="/settings" element={
                <div className="text-center py-20">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h2 className="text-2xl font-bold mb-2">Ustawienia</h2>
                  <p className="text-gray-400">Wkrótce dostępny - konfiguracja systemu</p>
                </div>
              } />
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </OfferProvider>
  );
};

export default App;