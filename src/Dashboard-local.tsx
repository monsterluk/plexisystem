import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, FileText, Calendar, ArrowUp, ArrowDown, Target, Activity, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Dane przykładowe
  const stats = {
    totalRevenue: 125400,
    revenueChange: 15.3,
    totalOffers: 42,
    offersChange: 8.2,
    totalClients: 28,
    clientsChange: 12.5,
    conversionRate: 68.5,
    conversionChange: -2.4
  };

  const revenueData = [
    { date: '11 sty', revenue: 12500, offers: 3 },
    { date: '12 sty', revenue: 8200, offers: 2 },
    { date: '13 sty', revenue: 15300, offers: 4 },
    { date: '14 sty', revenue: 21000, offers: 5 },
    { date: '15 sty', revenue: 18500, offers: 4 },
    { date: '16 sty', revenue: 25400, offers: 6 },
    { date: '17 sty', revenue: 24500, offers: 5 }
  ];

  const productData = [
    { name: 'Ekspozytor A4', value: 45000, count: 12 },
    { name: 'Ekspozytor A5', value: 32000, count: 18 },
    { name: 'Stojak na ulotki', value: 28500, count: 8 },
    { name: 'Display A3', value: 22000, count: 5 },
    { name: 'Ekspozytor Premium', value: 18000, count: 3 }
  ];

  const statusData = [
    { name: 'Szkic', value: 8, color: '#6B7280' },
    { name: 'Wysłane', value: 12, color: '#3B82F6' },
    { name: 'Zaakceptowane', value: 18, color: '#10B981' },
    { name: 'Odrzucone', value: 4, color: '#EF4444' }
  ];

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
            { icon: FileText, text: 'Nowa oferta DB-2025-0018 dla Firma ABC', time: '5 minut temu', color: 'text-blue-500' },
            { icon: CheckCircle, text: 'Oferta LS-2025-0015 została zaakceptowana', time: '1 godzinę temu', color: 'text-green-500' },
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
