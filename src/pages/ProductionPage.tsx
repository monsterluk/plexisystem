// @ts-nocheck
import React, { useState } from 'react';
import { Settings, Package2, Scissors, FileText, QrCode } from 'lucide-react';
import { SheetOptimizerForm } from '@/components/optimization/SheetOptimizerForm';

export const ProductionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'optimizer' | 'queue' | 'history'>('optimizer');

  const tabs = [
    { id: 'optimizer', label: 'Optymalizator rozkroju', icon: Scissors },
    { id: 'queue', label: 'Kolejka produkcji', icon: Package2 },
    { id: 'history', label: 'Historia', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Nagłówek */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-orange-500" />
            Produkcja
          </h1>
          <p className="text-gray-600 mt-2">
            Zarządzaj procesem produkcji i optymalizuj wykorzystanie materiału
          </p>
        </div>

        {/* Zakładki */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Zawartość zakładek */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'optimizer' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Optymalizator rozkroju materiału</h2>
                <p className="text-gray-600">
                  Zoptymalizuj wykorzystanie arkuszy pleksi i innych materiałów. 
                  System automatycznie układa elementy minimalizując odpad.
                </p>
              </div>
              <SheetOptimizerForm />
            </div>
          )}

          {activeTab === 'queue' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Kolejka produkcji</h2>
              <div className="space-y-4">
                {/* Przykładowe zlecenia */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Zlecenie #2024{i}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Klient: Firma XYZ • 5 ekspozytorów, 10 formatek
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500">
                            Termin: {new Date(Date.now() + i * 86400000).toLocaleDateString('pl-PL')}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            i === 1 ? 'bg-yellow-100 text-yellow-800' : 
                            i === 2 ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {i === 1 ? 'W produkcji' : i === 2 ? 'Oczekuje' : 'Zaplanowane'}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <QrCode className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Historia produkcji</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Zlecenie</th>
                      <th className="text-left py-3 px-4">Data</th>
                      <th className="text-left py-3 px-4">Produkty</th>
                      <th className="text-left py-3 px-4">Wykorzystanie</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#2024{100 - i}</td>
                        <td className="py-3 px-4">
                          {new Date(Date.now() - i * 86400000).toLocaleDateString('pl-PL')}
                        </td>
                        <td className="py-3 px-4">
                          {Math.floor(Math.random() * 10 + 5)} sztuk
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-medium">
                            {85 + Math.floor(Math.random() * 10)}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800">
                            Zrealizowane
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};