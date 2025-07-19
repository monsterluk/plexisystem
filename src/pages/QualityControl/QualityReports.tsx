import React, { useState } from 'react';
import { Calendar, Download, FileText, Filter, TrendingUp, AlertTriangle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

interface QualityReportsProps {
  onGenerateReport: (type: string, params: any) => void;
}

export function QualityReports({ onGenerateReport }: QualityReportsProps) {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Przykładowe dane do wykresów
  const complianceData = [
    { month: 'Sty', zgodne: 94, warunkowe: 4, niezgodne: 2 },
    { month: 'Lut', zgodne: 92, warunkowe: 5, niezgodne: 3 },
    { month: 'Mar', zgodne: 95, warunkowe: 3, niezgodne: 2 },
    { month: 'Kwi', zgodne: 93, warunkowe: 5, niezgodne: 2 },
    { month: 'Maj', zgodne: 96, warunkowe: 2, niezgodne: 2 },
    { month: 'Cze', zgodne: 94, warunkowe: 4, niezgodne: 2 },
  ];

  const defectTypes = [
    { name: 'Wymiary poza tolerancją', value: 35, color: '#F59E0B' },
    { name: 'Defekty powierzchni', value: 25, color: '#EF4444' },
    { name: 'Nieprawidłowy montaż', value: 20, color: '#3B82F6' },
    { name: 'Defekty elektryczne', value: 12, color: '#8B5CF6' },
    { name: 'Inne', value: 8, color: '#6B7280' },
  ];

  const productQuality = [
    { product: 'Kaseton LED', checks: 45, passed: 42, passRate: 93.3 },
    { product: 'Litery przestrzenne', checks: 38, passed: 36, passRate: 94.7 },
    { product: 'Plexi mleczne', checks: 52, passed: 50, passRate: 96.2 },
    { product: 'Dibond', checks: 28, passed: 26, passRate: 92.9 },
    { product: 'Banery', checks: 35, passed: 34, passRate: 97.1 },
  ];

  const handleGenerateReport = (type: string) => {
    onGenerateReport(type, { dateRange });
  };

  return (
    <div className="space-y-6">
      {/* Filtry */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Zakres danych</h3>
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <Filter className="w-4 h-4" />
            Więcej filtrów
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Data od</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Data do</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all">
              Zastosuj
            </button>
          </div>
        </div>
      </div>

      {/* Wykresy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wykres zgodności w czasie */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h4 className="font-medium text-white mb-4">Trend zgodności produkcji</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="zgodne" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Zgodne (%)"
              />
              <Line 
                type="monotone" 
                dataKey="warunkowe" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Warunkowe (%)"
              />
              <Line 
                type="monotone" 
                dataKey="niezgodne" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Niezgodne (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Wykres typów defektów */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h4 className="font-medium text-white mb-4">Rozkład typów niezgodności</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={defectTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {defectTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela jakości produktów */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 lg:col-span-2">
          <h4 className="font-medium text-white mb-4">Jakość według produktów</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 text-sm font-medium text-gray-400">Produkt</th>
                  <th className="pb-3 text-sm font-medium text-gray-400 text-center">Liczba kontroli</th>
                  <th className="pb-3 text-sm font-medium text-gray-400 text-center">Zgodne</th>
                  <th className="pb-3 text-sm font-medium text-gray-400 text-center">Wskaźnik zgodności</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Trend</th>
                </tr>
              </thead>
              <tbody>
                {productQuality.map((product, index) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="py-3">
                      <p className="text-sm font-medium text-white">{product.product}</p>
                    </td>
                    <td className="py-3 text-center">
                      <p className="text-sm text-gray-300">{product.checks}</p>
                    </td>
                    <td className="py-3 text-center">
                      <p className="text-sm text-gray-300">{product.passed}</p>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              product.passRate >= 95 ? 'bg-green-500' : 
                              product.passRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${product.passRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-white">{product.passRate}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Przyciski generowania raportów */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleGenerateReport('monthly')}
          className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-orange-400" />
            <div className="text-left">
              <p className="font-medium text-white">Raport miesięczny</p>
              <p className="text-xs text-gray-400">Kompleksowe podsumowanie miesiąca</p>
            </div>
          </div>
          <Download className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={() => handleGenerateReport('defects')}
          className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div className="text-left">
              <p className="font-medium text-white">Rejestr niezgodności</p>
              <p className="text-xs text-gray-400">Lista wszystkich wykrytych defektów</p>
            </div>
          </div>
          <Download className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={() => handleGenerateReport('trends')}
          className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <p className="font-medium text-white">Analiza trendów</p>
              <p className="text-xs text-gray-400">Prognozy i rekomendacje</p>
            </div>
          </div>
          <Download className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Statystyki podsumowujące */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h4 className="font-medium text-white mb-4">Podsumowanie okresu</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Przeprowadzone kontrole</p>
            <p className="text-2xl font-bold text-white">248</p>
            <p className="text-xs text-green-400">+12% vs poprzedni okres</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Średni wskaźnik zgodności</p>
            <p className="text-2xl font-bold text-green-400">94.3%</p>
            <p className="text-xs text-gray-400">Cel: 95%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Czas reakcji na niezgodności</p>
            <p className="text-2xl font-bold text-yellow-400">2.4h</p>
            <p className="text-xs text-green-400">-15 min vs poprzedni okres</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Koszty niezgodności</p>
            <p className="text-2xl font-bold text-red-400">4,250 zł</p>
            <p className="text-xs text-red-400">+5% vs poprzedni okres</p>
          </div>
        </div>
      </div>
    </div>
  );
}