import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, DollarSign, Users, Package, FileText, Printer, Mail, ChevronDown, RefreshCw, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface ReportData {
  revenue: { month: string; value: number; growth: number }[];
  salesByProduct: { name: string; value: number; percentage: number }[];
  clientActivity: { name: string; offers: number; revenue: number; conversion: number }[];
  performanceMetrics: { metric: string; current: number; previous: number; target: number }[];
  timeline: { date: string; event: string; type: 'offer' | 'client' | 'product' }[];
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'clients' | 'products'>('overview');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    revenue: [],
    salesByProduct: [],
    clientActivity: [],
    performanceMetrics: [],
    timeline: []
  });

  // Kolory dla wykresów
  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setReportData({
        revenue: [
          { month: 'Sty', value: 45000, growth: 12 },
          { month: 'Lut', value: 52000, growth: 15 },
          { month: 'Mar', value: 48000, growth: -8 },
          { month: 'Kwi', value: 61000, growth: 27 },
          { month: 'Maj', value: 58000, growth: -5 },
          { month: 'Cze', value: 67000, growth: 16 },
        ],
        salesByProduct: [
          { name: 'Plexi Transparentne', value: 35, percentage: 35 },
          { name: 'Dibond', value: 25, percentage: 25 },
          { name: 'Ekspozytory', value: 20, percentage: 20 },
          { name: 'Kasetony LED', value: 15, percentage: 15 },
          { name: 'Inne', value: 5, percentage: 5 },
        ],
        clientActivity: [
          { name: 'Firma ABC', offers: 12, revenue: 45000, conversion: 75 },
          { name: 'XYZ Sp. z o.o.', offers: 8, revenue: 38000, conversion: 62 },
          { name: 'Jan Kowalski', offers: 15, revenue: 22000, conversion: 40 },
          { name: 'Studio Design', offers: 6, revenue: 31000, conversion: 83 },
          { name: 'Marketing Pro', offers: 9, revenue: 28000, conversion: 55 },
        ],
        performanceMetrics: [
          { metric: 'Przychód', current: 67000, previous: 58000, target: 70000 },
          { metric: 'Liczba ofert', current: 45, previous: 38, target: 50 },
          { metric: 'Konwersja', current: 68, previous: 62, target: 75 },
          { metric: 'Średnia wartość', current: 1489, previous: 1526, target: 1400 },
        ],
        timeline: [
          { date: '2024-07-16', event: 'Nowa oferta dla Firma ABC', type: 'offer' },
          { date: '2024-07-15', event: 'Dodano nowego klienta', type: 'client' },
          { date: '2024-07-14', event: 'Zaktualizowano cennik produktów', type: 'product' },
          { date: '2024-07-13', event: 'Zaakceptowana oferta #2024-045', type: 'offer' },
          { date: '2024-07-12', event: 'Nowy produkt w katalogu', type: 'product' },
        ]
      });
      setLoading(false);
    }, 1500);
  }, [dateRange]);

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Karty statystyk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Przychód"
          value="67,000 zł"
          change={16}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Liczba ofert"
          value="45"
          change={18}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Konwersja"
          value="68%"
          change={10}
          icon={TrendingUp}
          color="orange"
        />
        <StatCard
          title="Aktywni klienci"
          value="23"
          change={-5}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Wykres przychodów */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Przychody w czasie</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={reportData.revenue}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} zł`} />
            <Area type="monotone" dataKey="value" stroke="#f97316" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Metryki wydajności */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Metryki wydajności</h3>
        <div className="space-y-4">
          {reportData.performanceMetrics.map((metric) => {
            const percentage = (metric.current / metric.target) * 100;
            return (
              <div key={metric.metric}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{metric.metric}</span>
                  <span className="text-sm text-gray-600">
                    {metric.current} / {metric.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      percentage >= 100 ? 'bg-green-500' : percentage >= 80 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sprzedaż wg produktów */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Sprzedaż według produktów</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={reportData.salesByProduct}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {reportData.salesByProduct.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Trendy sprzedaży */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Trendy sprzedaży</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData.revenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]}>
              {reportData.revenue.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.growth > 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela najlepszych produktów */}
      <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Najlepiej sprzedające się produkty</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produkt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ilość
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Przychód
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.salesByProduct.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.value} szt.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{(product.value * 1500).toLocaleString()} zł</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+12%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      {/* Aktywność klientów */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Aktywność klientów</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={reportData.clientActivity}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Konwersja" dataKey="conversion" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Top klienci */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Najlepsi klienci</h3>
        <div className="space-y-4">
          {reportData.clientActivity.map((client, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-${COLORS[index]}-100 flex items-center justify-center`}>
                  <span className="font-bold text-lg">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.offers} ofert</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{client.revenue.toLocaleString()} zł</p>
                <p className="text-sm text-gray-500">Konwersja: {client.conversion}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Analiza produktów</h3>
      <div className="space-y-6">
        {/* Wykres popularności */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData.salesByProduct} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="value" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>

        {/* Metryki produktów */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">Najlepszy produkt</p>
            <p className="text-lg font-bold mt-1">Plexi Transparentne</p>
            <p className="text-sm text-gray-600">35% sprzedaży</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Średnia marża</p>
            <p className="text-lg font-bold mt-1">42%</p>
            <p className="text-sm text-gray-600">+3% vs poprzedni miesiąc</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Rotacja zapasów</p>
            <p className="text-lg font-bold mt-1">8.5x</p>
            <p className="text-sm text-gray-600">W normie</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generowanie raportów...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nagłówek */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Raporty i analizy</h1>
              <p className="mt-1 text-sm text-gray-500">
                Szczegółowe statystyki i trendy biznesowe
              </p>
            </div>
            <div className="flex gap-3">
              {/* Wybór zakresu dat */}
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Calendar className="w-4 h-4" />
                  <span>Ostatni miesiąc</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                <Download className="w-4 h-4" />
                Eksportuj
              </button>
            </div>
          </div>

          {/* Zakładki */}
          <div className="flex space-x-8 border-b">
            {['overview', 'sales', 'clients', 'products'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'overview' && 'Przegląd'}
                {tab === 'sales' && 'Sprzedaż'}
                {tab === 'clients' && 'Klienci'}
                {tab === 'products' && 'Produkty'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zawartość */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'sales' && renderSales()}
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'products' && renderProducts()}

        {/* Timeline aktywności */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Ostatnia aktywność
          </h3>
          <div className="space-y-3">
            {reportData.timeline.map((event, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'offer' ? 'bg-blue-500' : 
                  event.type === 'client' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{event.event}</p>
                  <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('pl-PL')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}