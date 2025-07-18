import React, { useState } from 'react';
import MillingGuide from './MillingGuide';
import MaterialsGuide from './MaterialsGuide';
import ProductsGuide from './ProductsGuide';
import SalesGuide from './SalesGuide';
import SheetFormatsGuide from './SheetFormatsGuide';
import { BookOpen, Wrench, Layers, Package, Briefcase, Ruler } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('milling');

  const tabs = [
    {
      id: 'milling',
      label: 'Frezowanie',
      icon: <Wrench className="w-5 h-5" />,
      component: <MillingGuide />
    },
    {
      id: 'sales',
      label: 'Przewodnik Handlowca',
      icon: <Briefcase className="w-5 h-5" />,
      component: <SalesGuide />
    },
    {
      id: 'materials',
      label: 'Tworzywa',
      icon: <Layers className="w-5 h-5" />,
      component: <MaterialsGuide />
    },
    {
      id: 'formats',
      label: 'Formaty Arkuszy',
      icon: <Ruler className="w-5 h-5" />,
      component: <SheetFormatsGuide />
    },
    {
      id: 'products',
      label: 'Produkty',
      icon: <Package className="w-5 h-5" />,
      component: <ProductsGuide />
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-zinc-800 shadow-sm border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-semibold text-white">Baza Wiedzy Plexisystem</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default KnowledgeBase;
