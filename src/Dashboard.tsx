import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, FileText, Users, DollarSign, Calendar, Package, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Inicjalizacja Supabase
const supabaseUrl = 'https://lsyclgolxakaxqtxwmgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeWNsZ29seGFrYXhxdHh3bWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MDIzMzQsImV4cCI6MjA1MjI3ODMzNH0.VTKDv_hCmXJJdQ7sBO8Si7fvCZCFXDJQNgZA24PdkBw';
const supabase = createClient(supabaseUrl, supabaseKey);

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

function Dashboard() {
  const [stats, setStats] = useState({
    draft_count: 0,
    sent_count: 0,
    accepted_count: 0,
    rejected_count: 0,
    total_count: 0,
    accepted_total_net: 0,
    accepted_total_gross: 0,
    all_total_net: 0,
    all_total_gross: 0
  });
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Pobierz ogólne statystyki
      const { data: statsData, error: statsError } = await supabase
        .from('offer_statistics')
        .select('*')
        .single();
      
      if (statsError) throw statsError;
      setStats(statsData || {});

      // Pobierz miesięczne statystyki
      const { data: monthlyStats, error: monthlyError } = await supabase
        .from('monthly_statistics')
        .select('*')
        .order('month', { ascending: false })
        .limit(12);
      
      if (monthlyError) throw monthlyError;
      
      // Formatuj dane miesięczne dla wykresu
      const formattedMonthly = (monthlyStats || []).reverse().map(item => ({
        month: new Date(item.month).toLocaleDateString('pl-PL', { month: 'short', year: '2-digit' }),
        wartość: parseFloat(item.accepted_gross) || 0,
        oferty: item.accepted_count || 0
      }));
      setMonthlyData(formattedMonthly);

      // Pobierz top klientów
      const { data: clientsData, error: clientsError } = await supabase
        .from('top_clients')
        .select('*')
        .limit(5);
      
      if (clientsError) throw clientsError;
      setTopClients(clientsData || []);

    } catch (error) {
      console.error('Błąd pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusData = [
    { name: 'Szkice', value: stats.draft_count, color: '#6B7280' },
    { name: 'Wysłane', value: stats.sent_count, color: '#3B82F6' },
    { name: 'Zaakceptowane', value: stats.accepted_count, color: '#10B981' },
    { name: 'Odrzucone', value: stats.rejected_count, color: '#EF4444' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(value || 0);
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(trend)}%
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Ładowanie danych...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Karty statystyk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Wszystkie oferty"
            value={stats.total_count}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Zaakceptowane"
            value={stats.accepted_count}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Wartość zaakceptowanych"
            value={formatCurrency(stats.accepted_total_gross)}
            icon={DollarSign}
            color="yellow"
          />
          <StatCard
            title="Współczynnik sukcesu"
            value={`${stats.total_count > 0 ? Math.round((stats.accepted_count / stats.total_count) * 100) : 0}%`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Wykresy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Wykres miesięczny */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Przychody miesięczne</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line 
                  type="monotone" 
                  dataKey="wartość" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wykres statusów */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Status ofert</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top klienci */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Najlepsi klienci</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liczba ofert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zaakceptowane
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wartość
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topClients.map((client, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.client_name}</div>
                      <div className="text-sm text-gray-500">NIP: {client.client_nip}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.offer_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {client.accepted_offers}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(client.accepted_net * 1.23)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;