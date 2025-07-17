import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Users,
  Package,
  DollarSign,
  Activity,
  PieChart,
  ArrowUp,
  ArrowDown,
  Clock,
  Target,
  Award,
  ShoppingCart
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { formatDate, formatDateOnly } from '@/utils/dateHelpers';
import { AIService } from '@/services/aiService';

interface DashboardStats {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  offers: {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
  };
  conversion: {
    rate: number;
    industry: number;
  };
  averageOrder: {
    value: number;
    items: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    quantity: number;
  }>;
  topClients: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
  }>;
  salesByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dateRange, setDateRange] = useState('month'); // month, quarter, year
  const [exportLoading, setExportLoading] = useState(false);
  const [trends, setTrends] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
    loadTrends();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Dla demo używamy przykładowych danych
      // W prawdziwej aplikacji pobieraj z Supabase
      setStats({
        revenue: {
          current: 67000,
          previous: 58000,
          change: 15.5
        },
        offers: {
          total: 42,
          accepted: 18,
          pending: 12,
          rejected: 12
        },
        conversion: {
          rate: 42.9,
          industry: 22
        },
        averageOrder: {
          value: 3722,
          items: 2.4
        },
        topProducts: [
          { id: '1', name: 'Plexi Transparentne 3mm', revenue: 24500, quantity: 145 },
          { id: '2', name: 'Dibond 3mm Biały', revenue: 18900, quantity: 89 },
          { id: '3', name: 'Kaseton LED 100x50cm', revenue: 15600, quantity: 12 },
          { id: '4', name: 'Plexi Satyna 5mm', revenue: 8900, quantity: 34 },
          { id: '5', name: 'Ekspozytory A4', revenue: 5200, quantity: 52 }
        ],
        topClients: [
          { id: '1', name: 'Firma ABC Sp. z o.o.', revenue: 18500, orders: 5 },
          { id: '2', name: 'Studio Reklamy XYZ', revenue: 15200, orders: 8 },
          { id: '3', name: 'Marketing Solutions', revenue: 12800, orders: 3 },
          { id: '4', name: 'Jan Kowalski', revenue: 9600, orders: 12 },
          { id: '5', name: 'Print House Gdańsk', revenue: 8100, orders: 4 }
        ],
        salesByMonth: [
          { month: 'Sty', revenue: 45000, orders: 12 },
          { month: 'Lut', revenue: 52000, orders: 15 },
          { month: 'Mar', revenue: 48000, orders: 13 },
          { month: 'Kwi', revenue: 61000, orders: 18 },
          { month: 'Maj', revenue: 58000, orders: 16 },
          { month: 'Cze', revenue: 67000, orders: 21 }
        ]
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrends = async () => {
    try {
      // Przykładowe dane trendów
      setTrends({
        topProducts: [
          { productId: '1', name: 'Kaseton LED', growth: 35 },
          { productId: '2', name: 'Plexi Satyna', growth: 22 },
          { productId: '3', name: 'Ekspozytory', growth: -5 }
        ],
        recommendations: [
          '🚀 Kaseton LED notuje 35% wzrost - zwiększ stan magazynowy',
          '📉 Ekspozytory spadają o 5% - rozważ promocję',
          '💡 80% klientów akceptuje oferty < 48h - przyspiesz odpowiedzi'
        ]
      });
    } catch (error) {
      console.error('Error loading trends:', error);
    }
  };

  const exportReport = async () => {
    setExportLoading(true);
    try {
      // TODO: Implementacja eksportu do PDF/Excel
      alert('Funkcja eksportu w przygotowaniu');
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const renderStatCard = (title: string, value: string | number, change?: number, icon?: React.ReactNode) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          {change > 0 ? (
            <ArrowUp className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Nagłówek */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Raporty i Analizy</h1>
            <p className="text-gray-600 mt-1">Szczegółowe statystyki i trendy biznesowe</p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="month">Ostatni miesiąc</option>
              <option value="quarter">Ostatni kwartał</option>
              <option value="year">Ostatni rok</option>
            </select>
            <button 
              onClick={exportReport}
              disabled={exportLoading}
              className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exportLoading ? 'Eksportowanie...' : 'Eksportuj PDF'}
            </button>
          </div>
        </div>

        {/* Statystyki główne */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {renderStatCard(
            'Przychód bieżący',
            `${stats?.revenue.current.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł`,
            stats?.revenue.change,
            <DollarSign className="w-5 h-5 text-green-500" />
          )}
          
          {renderStatCard(
            'Liczba ofert',
            stats?.offers.total || 0,
            undefined,
            <FileText className="w-5 h-5 text-blue-500" />
          )}
          
          {renderStatCard(
            'Konwersja',
            `${stats?.conversion.rate.toFixed(1)}%`,
            stats?.conversion.rate - stats?.conversion.industry,
            <Target className="w-5 h-5 text-orange-500" />
          )}
          
          {renderStatCard(
            'Średnia wartość',
            `${stats?.averageOrder.value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł`,
            undefined,
            <ShoppingCart className="w-5 h-5 text-purple-500" />
          )}
        </div>

        {/* Szczegółowe statystyki ofert */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Status ofert</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Zaakceptowane</span>
                </div>
                <span className="text-sm font-medium">{stats?.offers.accepted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Oczekujące</span>
                </div>
                <span className="text-sm font-medium">{stats?.offers.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Odrzucone</span>
                </div>
                <span className="text-sm font-medium">{stats?.offers.rejected}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Średnie wartości</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Wartość zamówienia</span>
                <span className="text-sm font-medium">
                  {stats?.averageOrder.value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Liczba pozycji</span>
                <span className="text-sm font-medium">{stats?.averageOrder.items.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Czas realizacji</span>
                <span className="text-sm font-medium">7-10 dni</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Wskaźniki</h3>
              <Award className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Konwersja</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats?.conversion.rate.toFixed(1)}%</span>
                  {stats && stats.conversion.rate > stats.conversion.industry && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">+{(stats.conversion.rate - stats.conversion.industry).toFixed(1)}%</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Średnia branży</span>
                <span className="text-sm font-medium">{stats?.conversion.industry}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cel miesięczny</span>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wykresy i tabele */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top produkty */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              Top produkty
            </h2>
            <div className="space-y-3">
              {stats?.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.quantity} szt. sprzedanych</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {product.revenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Top klienci */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              Top klienci
            </h2>
            <div className="space-y-3">
              {stats?.topClients.map((client, index) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.orders} zamówień</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {client.revenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wykres sprzedaży */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            Sprzedaż w czasie
          </h2>
          <div className="h-64">
            {/* Prosty wykres słupkowy */}
            <div className="h-full flex items-end gap-4">
              {stats?.salesByMonth.map((month) => {
                const maxRevenue = Math.max(...(stats?.salesByMonth.map(m => m.revenue) || [1]));
                const height = (month.revenue / maxRevenue) * 100;
                
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-orange-500 rounded-t" style={{ height: `${height}%` }}></div>
                    <p className="text-xs text-gray-600 mt-2">{month.month}</p>
                    <p className="text-xs font-medium text-gray-900">
                      {(month.revenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trendy AI */}
        {trends && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Trendy i rekomendacje AI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trendy produktów */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Produkty w trendzie</h3>
                <div className="space-y-2">
                  {trends.topProducts?.slice(0, 3).map((product: any) => (
                    <div key={product.productId} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{product.name}</span>
                      <span className={`text-sm font-medium ${
                        product.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rekomendacje */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Rekomendacje AI</h3>
                <div className="space-y-2">
                  {trends.recommendations?.slice(0, 3).map((rec: string, index: number) => (
                    <p key={index} className="text-sm text-gray-700">{rec}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};