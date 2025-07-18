import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, ShoppingBag, Users, Package, ArrowRight, ArrowUp, ArrowDown,
  Calendar, Clock, CheckCircle, AlertCircle, Star, Zap, Target, Award,
  BarChart3, PieChart, Activity, DollarSign, Eye, Calculator, FileText,
  Sparkles, Flame, Trophy, Rocket, MessageCircle, Book
} from 'lucide-react';

interface DashboardStats {
  totalOffers: number;
  totalRevenue: number;
  totalClients: number;
  totalProducts: number;
  growth: {
    offers: number;
    revenue: number;
    clients: number;
  };
  recentActivities: Activity[];
  topProducts: Product[];
  upcomingDeadlines: Deadline[];
}

interface Activity {
  id: string;
  type: 'offer' | 'order' | 'client' | 'product';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

interface Deadline {
  id: string;
  title: string;
  client: string;
  dueDate: string;
  status: 'urgent' | 'warning' | 'ok';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOffers: 2847,
    totalRevenue: 1234567,
    totalClients: 892,
    totalProducts: 127,
    growth: {
      offers: 12.5,
      revenue: 23.8,
      clients: 8.3
    },
    recentActivities: [],
    topProducts: [],
    upcomingDeadlines: []
  });

  useEffect(() => {
    // Symulacja ładowania danych
    setStats({
      ...stats,
      recentActivities: [
        {
          id: '1',
          type: 'offer',
          title: 'Nowa oferta #2847',
          description: 'Display lakierów dla Beauty Salon Ania',
          time: '5 minut temu',
          icon: <FileText className="w-5 h-5" />
        },
        {
          id: '2',
          type: 'order',
          title: 'Zamówienie zaakceptowane',
          description: 'Osłona recepcji - Klinika Medyczna',
          time: '1 godzinę temu',
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          id: '3',
          type: 'client',
          title: 'Nowy klient',
          description: 'Restauracja "Pod Złotym Słońcem"',
          time: '3 godziny temu',
          icon: <Users className="w-5 h-5" />
        },
        {
          id: '4',
          type: 'product',
          title: 'Produkt dodany do katalogu',
          description: 'Ekspozytor kosmetyków GLAM Pro',
          time: 'wczoraj',
          icon: <Package className="w-5 h-5" />
        }
      ],
      topProducts: [
        { id: '1', name: 'Display Lakierów RAINBOW', sales: 523, revenue: 287650, trend: 'up' },
        { id: '2', name: 'Osłona Recepcji MEDICAL', sales: 456, revenue: 228000, trend: 'up' },
        { id: '3', name: 'Dystrybutor TOUCH-FREE', sales: 389, revenue: 85580, trend: 'stable' },
        { id: '4', name: 'Menu LED Gastro PRO', sales: 234, revenue: 74880, trend: 'down' },
        { id: '5', name: 'Organizer OFFICE 5', sales: 198, revenue: 29700, trend: 'up' }
      ],
      upcomingDeadlines: [
        { id: '1', title: 'Ekspozytory kosmetyczne x12', client: 'Beauty Zone', dueDate: '2 dni', status: 'urgent' },
        { id: '2', title: 'Osłony ochronne x5', client: 'Klinika Zdrowie', dueDate: '5 dni', status: 'warning' },
        { id: '3', title: 'Menu LED x8', client: 'Restauracja Marina', dueDate: '7 dni', status: 'ok' },
        { id: '4', title: 'Organizery biurowe x20', client: 'Tech Solutions', dueDate: '10 dni', status: 'ok' }
      ]
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'text-red-500 bg-red-900/20 border-red-500/30';
      case 'warning': return 'text-amber-500 bg-amber-900/20 border-amber-500/30';
      case 'ok': return 'text-emerald-500 bg-emerald-900/20 border-emerald-500/30';
      default: return 'text-gray-500 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-emerald-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Activity className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-slate-900">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-indigo-900/20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-gradient-x">
              Witaj w PlexiSystem! 🚀
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Twój centrum dowodzenia. Sprawdź statystyki, zarządzaj ofertami i rozwijaj biznes.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <button
              onClick={() => navigate('/offer/new')}
              className="group bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-white/80 text-sm mb-1">Szybka akcja</p>
                  <p className="text-white font-bold text-lg">Nowa oferta</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/60 mt-4 group-hover:translate-x-2 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/calculator')}
              className="group bg-gradient-to-br from-emerald-600 to-teal-600 p-6 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-white/80 text-sm mb-1">Wycena</p>
                  <p className="text-white font-bold text-lg">Kalkulator</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/60 mt-4 group-hover:translate-x-2 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/marketplace')}
              className="group bg-gradient-to-br from-amber-600 to-orange-600 p-6 rounded-2xl hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-white/80 text-sm mb-1">Katalog</p>
                  <p className="text-white font-bold text-lg">Marketplace</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/60 mt-4 group-hover:translate-x-2 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/clients')}
              className="group bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-white/80 text-sm mb-1">CRM</p>
                  <p className="text-white font-bold text-lg">Klienci</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/60 mt-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-800/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-bold flex items-center gap-1 ${stats.growth.offers > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.growth.offers > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(stats.growth.offers)}%
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Łączna wartość ofert</p>
            <p className="text-3xl font-bold text-white">{stats.totalOffers.toLocaleString()}</p>
            <div className="mt-4 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-bold flex items-center gap-1 ${stats.growth.revenue > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.growth.revenue > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(stats.growth.revenue)}%
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Przychód miesięczny</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            <div className="mt-4 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" style={{ width: '85%' }} />
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 hover:border-amber-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-bold flex items-center gap-1 ${stats.growth.clients > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.growth.clients > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(stats.growth.clients)}%
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-1">Aktywni klienci</p>
            <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
            <div className="mt-4 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Produkty w ofercie</p>
            <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
            <div className="mt-4 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '95%' }} />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Activities & Top Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activities */}
            <div className="bg-zinc-800/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Activity className="w-6 h-6 text-purple-400" />
                  Ostatnia aktywność
                </h2>
                <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Zobacz wszystkie →
                </button>
              </div>
              <div className="space-y-4">
                {stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-zinc-900/50 rounded-xl hover:bg-zinc-900/70 transition-all">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'offer' ? 'bg-purple-900/30 text-purple-400' :
                      activity.type === 'order' ? 'bg-emerald-900/30 text-emerald-400' :
                      activity.type === 'client' ? 'bg-amber-900/30 text-amber-400' :
                      'bg-blue-900/30 text-blue-400'
                    }`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{activity.title}</p>
                      <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-zinc-800/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  Najpopularniejsze produkty
                </h2>
                <button
                  onClick={() => navigate('/products')}
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Zobacz katalog →
                </button>
              </div>
              <div className="space-y-3">
                {stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl hover:bg-zinc-900/70 transition-all">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-black' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' :
                      index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' :
                      'bg-zinc-700 text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{product.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-400">{product.sales} sprzedaży</span>
                        <span className="text-sm text-emerald-400 font-medium">{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(product.trend)}
                      {index === 0 && <Flame className="w-5 h-5 text-orange-500 animate-pulse" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Deadlines & Quick Stats */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-zinc-800/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Clock className="w-6 h-6 text-red-400" />
                  Nadchodzące terminy
                </h2>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {stats.upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-4 bg-zinc-900/50 rounded-xl hover:bg-zinc-900/70 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-white text-sm">{deadline.title}</p>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(deadline.status)}`}>
                        {deadline.dueDate}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{deadline.client}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8 text-yellow-400" />
                <Rocket className="w-6 h-6 text-purple-400 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Gratulacje! 🎉</h3>
              <p className="text-sm text-gray-300 mb-4">
                Osiągnąłeś 150% targetu sprzedażowego w tym miesiącu!
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-purple-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" style={{ width: '100%' }} />
                </div>
                <span className="text-xs text-purple-300 font-bold">150%</span>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-zinc-800/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Szybka porada</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                💡 Wykorzystaj <span className="text-purple-400 font-medium">Marketplace</span> do szybkiego tworzenia ofert. 
                Gotowe szablony produktów oszczędzą Ci nawet 70% czasu!
              </p>
              <button
                onClick={() => navigate('/marketplace')}
                className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
              >
                Sprawdź Marketplace
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Potrzebujesz pomocy z systemem? 🤝
              </h2>
              <p className="text-gray-300 max-w-2xl">
                Nasz zespół wsparcia jest dostępny 24/7. Skontaktuj się z nami lub sprawdź bazę wiedzy.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/knowledge')}
                className="px-6 py-3 bg-white/10 backdrop-blur text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Book className="w-5 h-5" />
                Baza wiedzy
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Czat wsparcia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;