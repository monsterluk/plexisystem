// @ts-nocheck
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Eye, Download, Camera, Sparkles, Share2 } from 'lucide-react';
import { CalculatorItem } from '@/types/Offer';
import { Expositor3D } from '@/components/3d/Expositor3D';
import { ARPreview } from '@/components/3d/ARPreview';
import { CADExport } from '@/components/cad/CADExport';
import { ProductDescription } from '@/components/ProductDescription';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'3d' | 'ar' | 'cad' | 'description'>('3d');

  // W prawdziwej aplikacji dane byłyby pobierane z API
  const [product] = useState<CalculatorItem>({
    id: parseInt(id || '1'),
    product: 'ekspozytor',
    productName: 'Ekspozytor podstawkowy',
    expositorType: 'podstawkowy',
    material: 'plexi',
    materialName: 'Plexi transparentne',
    thickness: 5,
    dimensions: { width: 600, height: 800, depth: 400 },
    quantity: 1,
    options: { 
      polerowanie: true, 
      topper: true,
      led_standard: true 
    },
    optionQuantities: {},
    productParams: { 
      shelves: 3, 
      partitions: 0, 
      ledLength: 100,
      hookRows: 3,
      hookCols: 4,
      pockets: 3
    },
    calculations: {
      surface: 1.92,
      weight: 11.42,
      materialCost: 576,
      optionsCost: 230,
      unitPrice: 1612,
      totalPrice: 1612,
      piecesPerPallet: 24,
      piecesPerBox: 2,
      totalWeight: 11.42,
      boxDimensions: { width: 640, height: 840, depth: 440 },
      boxSurface: 2.38,
      boxWeight: 1.43,
      piecesPerBoxOptimal: 2,
      boxesTotal: 1,
      palletsTotal: 1,
      palletLayers: 3,
      boxesPerLayer: 4,
      costBreakdown: {
        materialCost: 576,
        wasteCost: 57.6,
        laborCost: 192,
        optionsCost: 230,
        margin: 556.4
      }
    },
    unitPrice: 1612,
    totalPrice: 1612
  });

  const tabs = [
    { id: '3d', label: 'Podgląd 3D', icon: Eye },
    { id: 'ar', label: 'AR', icon: Camera },
    { id: 'cad', label: 'Eksport CAD', icon: Download },
    { id: 'description', label: 'Opis AI', icon: Sparkles }
  ];

  const shareProduct = () => {
    const shareUrl = `${window.location.origin}/configurator/public/${product.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link do konfiguratora został skopiowany!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Package className="w-6 h-6 text-orange-500" />
                  {product.productName}
                </h1>
                <p className="text-sm text-gray-600">
                  {product.materialName} • {product.thickness}mm • 
                  {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} mm
                </p>
              </div>
            </div>
            
            <button
              onClick={shareProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Udostępnij konfigurator
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel główny */}
          <div className="lg:col-span-2">
            {/* Zakładki */}
            <div className="bg-white rounded-t-lg shadow-sm">
              <div className="border-b">
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
            <div className="bg-white rounded-b-lg shadow-lg p-6">
              {activeTab === '3d' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Podgląd 3D produktu</h2>
                  <Expositor3D item={product} />
                  <div className="mt-4 text-sm text-gray-600">
                    <p>• Użyj myszki aby obrócić model</p>
                    <p>• Scroll aby przybliżyć/oddalić</p>
                    <p>• Przytrzymaj Shift i przeciągnij aby przesunąć</p>
                  </div>
                </div>
              )}

              {activeTab === 'ar' && (
                <ARPreview item={product} />
              )}

              {activeTab === 'cad' && (
                <CADExport item={product} />
              )}

              {activeTab === 'description' && (
                <ProductDescription item={product} />
              )}
            </div>
          </div>

          {/* Panel boczny - szczegóły */}
          <div className="space-y-6">
            {/* Cena */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Kalkulacja</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cena jednostkowa:</span>
                  <span className="font-semibold">{product.unitPrice.toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ilość:</span>
                  <span className="font-semibold">{product.quantity} szt.</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Razem netto:</span>
                    <span className="font-bold text-orange-500">{product.totalPrice.toFixed(2)} zł</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">+ VAT 23%</p>
                </div>
              </div>
            </div>

            {/* Parametry techniczne */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Parametry techniczne</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Powierzchnia:</span>
                  <span>{product.calculations.surface.toFixed(3)} m²</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Waga:</span>
                  <span>{product.calculations.weight.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Szt. na palecie:</span>
                  <span>{product.calculations.piecesPerPallet}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Szt. w kartonie:</span>
                  <span>{product.calculations.piecesPerBox}</span>
                </div>
              </div>
            </div>

            {/* Opcje dodatkowe */}
            {Object.entries(product.options).filter(([_, value]) => value).length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Opcje dodatkowe</h3>
                <ul className="space-y-2 text-sm">
                  {Object.entries(product.options)
                    .filter(([_, value]) => value)
                    .map(([option]) => (
                      <li key={option} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {option.replace(/_/g, ' ')}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Akcje */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Dodaj do oferty
              </button>
              <button 
                onClick={() => navigate(`/configurator/public/${product.id}`)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Otwórz w konfiguratorze
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};