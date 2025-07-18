// @ts-nocheck
import React, { useState } from 'react';
import { Settings, Package2, Scissors, FileText, QrCode, Plus, Calendar, Clock } from 'lucide-react';
import { SheetOptimizerForm } from '@/components/optimization/SheetOptimizerForm';

export const ProductionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'optimizer' | 'queue' | 'history'>('optimizer');

  const tabs = [
    { id: 'optimizer', label: 'Optymalizator rozkroju', icon: Scissors },
    { id: 'queue', label: 'Kolejka produkcji', icon: Package2 },
    { id: 'history', label: 'Historia', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-orange-500" />
          Produkcja
        </h1>
        <p className="text-gray-400 mt-2">
          Zarządzaj procesem produkcji i optymalizuj wykorzystanie materiału
        </p>
      </div>

      {/* Zakładki */}
      <div className="bg-zinc-800 rounded-lg shadow-xl">
        <div className="border-b border-zinc-700">
          <nav className="flex -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all
                    ${activeTab === tab.id
                      ? 'border-orange-500 text-orange-500 bg-zinc-700/50'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-zinc-700/30'
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

        {/* Zawartość zakładek */}
        <div className="p-6">
          {activeTab === 'optimizer' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-white">Optymalizator rozkroju materiału</h2>
                <p className="text-gray-400">
                  Zoptymalizuj wykorzystanie arkuszy pleksi i innych materiałów. 
                  System automatycznie układa elementy minimalizując odpad.
                </p>
              </div>
              <SheetOptimizerForm />
            </div>
          )}

          {activeTab === 'queue' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Kolejka produkcji</h2>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nowe zlecenie
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Przykładowe zlecenia */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-zinc-700 rounded-lg p-4 hover:bg-zinc-600 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">Zlecenie #2024{i}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Klient: Firma XYZ • 5 ekspozytorów, 10 formatek
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(Date.now() + i * 86400000).toLocaleDateString('pl-PL')}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {8 - i * 2}h pozostało
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            i === 1 ? 'bg-yellow-500/20 text-yellow-400' : 
                            i === 2 ? 'bg-blue-500/20 text-blue-400' : 
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {i === 1 ? 'W produkcji' : i === 2 ? 'Oczekuje' : 'Zaplanowane'}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-zinc-800 rounded transition-all">
                        <QrCode className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Historia produkcji</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Zlecenie</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Data</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Produkty</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Wykorzystanie</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-all">
                        <td className="py-3 px-4 text-white">#2024{100 - i}</td>
                        <td className="py-3 px-4 text-gray-300">
                          {new Date(Date.now() - i * 86400000).toLocaleDateString('pl-PL')}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {Math.floor(Math.random() * 10 + 5)} sztuk
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-400 font-medium">
                            {85 + Math.floor(Math.random() * 10)}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400">
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