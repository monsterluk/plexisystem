import React, { useState } from 'react';
import MillingGuide from './MillingGuide';
import MaterialsGuide from './MaterialsGuide';
import ProductsGuide from './ProductsGuide';
import { BookOpen, Wrench, Layers, Package } from 'lucide-react';

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
      id: 'materials',
      label: 'Tworzywa',
      icon: <Layers className="w-5 h-5" />,
      component: <MaterialsGuide />
    },
    {
      id: 'products',
      label: 'Produkty',
      icon: <Package className="w-5 h-5" />,
      component: <ProductsGuide />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Baza Wiedzy Plexisystem</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
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
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
