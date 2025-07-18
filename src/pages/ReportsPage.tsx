import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, PieChart, TrendingUp, Calendar, Download, Filter,
  DollarSign, Users, Package, FileText, ArrowUp, ArrowDown,
  Activity, Target, Award, Zap, ChevronRight, Clock
} from 'lucide-react';
import { PageWrapper, Card, SectionTitle, StatCard } from '@/components/ui/PageWrapper';
import { Button } from '@/components/ui/Button';
import { 
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const salesData = [
  { month: 'Sty', sales: 45000, offers: 28, accepted: 22 },
  { month: 'Lut', sales: 52000, offers: 32, accepted: 25 },
  { month: 'Mar', sales: 48000, offers: 30, accepted: 24 },
  { month: 'Kwi', sales: 61000, offers: 38, accepted: 30 },
  { month: 'Maj', sales: 73000, offers: 45, accepted: 36 },
  { month: 'Cze', sales: 69000, offers: 42, accepted: 34 },
];

const productData = [
  { name: 'Ekspozytory', value: 35, color: '#8b5cf6' },
  { name: 'Kasetony LED', value: 25, color: '#ec4899' },
  { name: 'Formatki', value: 20, color: '#3b82f6' },
  { name: 'Inne', value: 20, color: '#10b981' },
];

const topClients = [
  { name: 'Beauty Zone Sp. z o.o.', revenue: 125000, orders: 23, growth: 15 },
  { name: 'Tech Solutions SA', revenue: 98000, orders: 18, growth: -5 },
  { name: 'Restauracja Marina', revenue: 87000, orders: 15, growth: 22 },
  { name: 'Klinika Zdrowie', revenue: 76000, orders: 12, growth: 8 },
  { name: 'Office Pro', revenue: 65000, orders: 10, growth: 12 },
];

const performanceData = [
  { day: 'Pon', target: 10000, actual: 12000 },
  { day: 'Wto', target: 10000, actual: 9500 },
  { day: 'Śro', target: 10000, actual: 11000 },
  { day: 'Czw', target: 10000, actual: 13500 },
  { day: 'Pią', target: 10000, actual: 15000 },
  { day: 'Sob', target: 5000, actual: 7000 },
  { day: 'Nie', target: 0, actual: 2000 },
];

export function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const pageActions = (
    <>
      <select 
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
        className="px-4 py-2 bg-zinc-700/50 rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none"
      >
        <option value="week">Ten tydzień</option>
        <option value="month">Ten miesiąc</option>
        <option value="quarter">Ten kwartał</option>
        <option value="year">Ten rok</option>
      </select>
      <Button variant="secondary">
        <Filter className="w-5 h-5" />
        Filtry
      </Button>
      <Button variant="primary">
        <Download className="w-5 h-5" />
        Eksportuj raport
      </Button>
    </>
  );

  return (
    <PageWrapper 
      title="Raporty i Analizy" 
      subtitle="Kompleksowy przegląd wyników sprzedaży i statystyk"
      actions={pageActions}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Przychód miesięczny"
            value="73 000 zł"
            trend={{ value: 12.5, isPositive: true }}
            color="emerald"
            progress={85}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            label="Liczba ofert"
            value="45"
            trend={{ value: 8, isPositive: true }}
            color="purple"
            progress={72}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Konwersja"
            value="80%"
            trend={{ value: 5, isPositive: true }}
            color="amber"
            progress={80}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Nowi klienci"
            value="12"
            trend={{ value: -3, isPositive: false }}
            color="blue"
            progress={60}
          />
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <SectionTitle icon={<TrendingUp className="w-6 h-6" />}>
              Trend sprzedaży
            </SectionTitle>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Product Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="p-6">
            <SectionTitle icon={<PieChart className="w-6 h-6" />}>
              Podział produktów
            </SectionTitle>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Performance vs Target */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card className="p-6">
          <SectionTitle icon={<Activity className="w-6 h-6" />}>
            Wyniki vs Cel
          </SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Bar dataKey="target" fill="#6b7280" name="Cel" />
              <Bar dataKey="actual" fill="#8b5cf6" name="Rzeczywiste" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Top Clients Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Card className="p-6">
          <SectionTitle 
            icon={<Award className="w-6 h-6" />}
            action={
              <Button variant="secondary" size="sm">
                Zobacz wszystkich
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            }
          >
            Top Klienci
          </SectionTitle>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left p-4 text-gray-400 font-medium">Klient</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Przychód</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Zamówienia</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Wzrost</th>
                </tr>
              </thead>
              <tbody>
                {topClients.map((client, index) => (
                  <motion.tr
                    key={client.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="border-b border-zinc-700/50 hover:bg-zinc-800/30 transition-all"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-white">{client.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-mono text-white">
                        {new Intl.NumberFormat('pl-PL', {
                          style: 'currency',
                          currency: 'PLN',
                          minimumFractionDigits: 0
                        }).format(client.revenue)}
                      </span>
                    </td>
                    <td className="p-4 text-right text-gray-300">{client.orders}</td>
                    <td className="p-4 text-right">
                      <span className={`flex items-center justify-end gap-1 ${
                        client.growth > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {client.growth > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {Math.abs(client.growth)}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20" gradient>
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">92%</span>
          </div>
          <h3 className="text-white font-semibold">Efektywność sprzedaży</h3>
          <p className="text-sm text-gray-400 mt-1">+5% vs poprzedni miesiąc</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-900/20 to-teal-900/20" gradient>
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold text-white">3.2 dni</span>
          </div>
          <h3 className="text-white font-semibold">Średni czas realizacji</h3>
          <p className="text-sm text-gray-400 mt-1">-0.5 dnia vs poprzedni miesiąc</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-900/20 to-orange-900/20" gradient>
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-amber-400" />
            <span className="text-2xl font-bold text-white">156%</span>
          </div>
          <h3 className="text-white font-semibold">Realizacja targetu</h3>
          <p className="text-sm text-gray-400 mt-1">Najlepszy wynik w roku!</p>
        </Card>
      </motion.div>
    </PageWrapper>
  );
}