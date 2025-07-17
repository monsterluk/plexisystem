import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, FileText, Calendar, ArrowUp, ArrowDown, Target, Activity, CheckCircle } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOffers: number;
  offersChange: number;
  totalClients: number;
  clientsChange: number;
  conversionRate: number;
  conversionChange: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOffers: 0,
    offersChange: 0,
    totalClients: 0,
    clientsChange: 0,
    conversionRate: 0,
    conversionChange: 0
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Pobierz dane o ofertach
      const { data: offers } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      // Pobierz dane o klientach
      const { data: clients } = await supabase
        .from('clients')
        .select('*');

      if (offers && clients) {
        // Oblicz statystyki
        const acceptedOffers = offers.filter(o => o.status === 'accepted');
        const totalRevenue = acceptedOffers.reduce((sum, o) => sum + (o.total_net || 0), 0);
        const conversionRate = offers.length > 0 ? (acceptedOffers.length / offers.length) * 100 : 0;

        setStats({
          totalRevenue,
          revenueChange: 15.3, // Symulacja
          totalOffers: offers.length,
          offersChange: 8.2,
          totalClients: clients.length,
          clientsChange: 12.5,
          conversionRate,
          conversionChange: -2.4
        });

        // Przygotuj dane do wykresów
        prepareChartData(offers);
      }
    } catch (error) {
      console.error('Błąd pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (offers: any[]) => {
    // Dane przychodów z ostatnich 7 dni
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }),
        dateObj: date,
        revenue: 0,
        offers: 0
      };
    });

    offers.forEach(offer => {
      const offerDate = new Date(offer.created_at);
      const dayData = last7Days.find(day => 
        day.dateObj.toDateString() === offerDate.toDateString()
      );
      
      if (dayData) {
        dayData.offers += 1;
        if (offer.status === 'accepted') {
          dayData.revenue += offer.total_net || 0;
        }
      }
    });

    setRevenueData(last7Days);

    // Dane produktów
    const productMap = new Map();
    offers.forEach(offer => {
      if (offer.items && Array.isArray(offer.items)) {
        offer.items.forEach((item: any) => {
          const current = productMap.get(item.productName) || { name: item.productName, value: 0, count: 0 };
          current.value += item.totalPrice || 0;
          current.count += 1;
          productMap.set(item.productName, current);
        });
      }
    });

    const products = Array.from(productMap.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    setProductData(products);

    // Dane statusów
    const statusCounts = {
      draft: 0,
      sent: 0,
      accepted: 0,
      rejected: 0
    };

    offers.forEach(offer => {
      if (statusCounts.hasOwnProperty(offer.status)) {
        statusCounts[offer.status as keyof typeof statusCounts] += 1;
      }
    });

    setStatusData([
      { name: 'Szkic', value: statusCounts.draft, color: '#6B7280' },
      { name: 'Wysłane', value: statusCounts.sent, color: '#3B82F6' },
      { name: 'Zaakceptowane', value: statusCounts.accepted, color: '#10B981' },
      { name: 'Odrzucone', value: statusCounts.rejected, color: '#EF4444' }
    ]);
  };

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {change > 0 ? (
              <ArrowUp className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-gray-500 text-sm">vs. poprzedni miesiąc</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}</span>
        </div>
      </div>

      {/* Karty statystyk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Przychód"
          value={`${stats.totalRevenue.toLocaleString('pl-PL')} zł`}
          change={stats.revenueChange}
          color="bg-green-600"
        />
        <StatCard
          icon={FileText}
          title="Oferty"
          value={stats.totalOffers}
          change={stats.offersChange}
          color="bg-blue-600"
        />
        <StatCard
          icon={Users}
          title="Klienci"
          value={stats.totalClients}
          change={stats.clientsChange}
          color="bg-purple-600"
        />
        <StatCard
          icon={Target}
          title="Konwersja"
          value={`${stats.conversionRate.toFixed(1)}%`}
          change={stats.conversionChange}
          color="bg-orange-600"
        />
      </div>

      {/* Wykresy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wykres przychodów */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            Przychody i oferty (ostatnie 7 dni)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#F97316" 
                strokeWidth={2}
                name="Przychód (zł)"
                dot={{ fill: '#F97316' }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="offers" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Liczba ofert"
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Wykres produktów */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            Top 5 produktów
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={(value: number) => `${value.toFixed(2)} zł`}
              />
              <Bar dataKey="value" fill="#F97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wykres statusów */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h3 className="text-lg font-semibold text-white mb-4">Status ofert</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Wykres trendu */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Trend sprzedaży
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ostatnie aktywności */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h3 className="text-lg font-semibold text-white mb-4">Ostatnie aktywności</h3>
        <div className="space-y-3">
          {[
            { icon: FileText, text: 'Nowa oferta OF/2024/07/018 dla Firma ABC', time: '5 minut temu', color: 'text-blue-500' },
            { icon: CheckCircle, text: 'Oferta OF/2024/07/015 została zaakceptowana', time: '1 godzinę temu', color: 'text-green-500' },
            { icon: Users, text: 'Dodano nowego klienta: XYZ Sp. z o.o.', time: '3 godziny temu', color: 'text-purple-500' },
            { icon: TrendingUp, text: 'Wzrost konwersji o 5% w tym tygodniu', time: '1 dzień temu', color: 'text-orange-500' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
              <span className="text-gray-300 flex-1">{activity.text}</span>
              <span className="text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
