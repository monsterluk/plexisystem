// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save, Share2, Download, Eye, Package, Palette, Settings, ChevronRight, Check } from 'lucide-react';
import { Calculator } from '@/components/quotation/Calculator';
import { Expositor3D } from '@/components/3d/Expositor3D';
import { CalculatorItem } from '@/types/Offer';
import { productDescriptionGenerator } from '@/services/ai/productDescriptionGenerator';

export const PublicConfigurator: React.FC = () => {
  const { token } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [configuredItem, setConfiguredItem] = useState<CalculatorItem | null>(null);
  const [description, setDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [saved, setSaved] = useState(false);

  const steps = [
    { id: 1, name: 'Konfiguracja', icon: Settings },
    { id: 2, name: 'Podgląd 3D', icon: Eye },
    { id: 3, name: 'Podsumowanie', icon: Package },
    { id: 4, name: 'Kontakt', icon: Share2 }
  ];

  const handleItemConfigured = async (item: CalculatorItem) => {
    setConfiguredItem(item);
    setCurrentStep(2);
    
    // Generuj opis produktu
    setIsGeneratingDescription(true);
    try {
      const desc = await productDescriptionGenerator.generateDescription(item);
      setDescription(desc);
    } catch (error) {
      console.error('Błąd generowania opisu:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!configuredItem || !customerInfo.email) return;

    try {
      // Zapisz konfigurację w localStorage (w prawdziwej aplikacji byłoby to API)
      const configuration = {
        id: Date.now(),
        token,
        item: configuredItem,
        description,
        customerInfo,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(`config_${configuration.id}`, JSON.stringify(configuration));
      setSaved(true);

      // Wyślij email z konfiguracją (w prawdziwej aplikacji)
      console.log('Wysyłanie konfiguracji na email:', customerInfo.email);
    } catch (error) {
      console.error('Błąd zapisywania konfiguracji:', error);
    }
  };

  const shareConfiguration = () => {
    const shareUrl = `${window.location.origin}/configurator/view/${configuredItem?.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link do konfiguracji został skopiowany!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-orange-500">PlexiKonfigurator</h1>
              <span className="text-sm text-gray-500">Zaprojektuj swój produkt</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shareConfiguration}
                disabled={!configuredItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Udostępnij
              </button>
              <button
                onClick={handleSaveConfiguration}
                disabled={!configuredItem || saved}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Zapisano' : 'Zapisz'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    disabled={step.id > 1 && !configuredItem}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                      currentStep === step.id
                        ? 'bg-orange-500 text-white'
                        : currentStep > step.id
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-400'
                    } ${step.id > 1 && !configuredItem ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{step.name}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 mx-2 text-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Skonfiguruj swój produkt</h2>
            <Calculator onAddToOffer={handleItemConfigured} viewMode="client" />
          </div>
        )}

        {currentStep === 2 && configuredItem && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Podgląd 3D</h2>
              <Expositor3D item={configuredItem} />
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Zmień kolor
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />
                  Pobierz model
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Szczegóły produktu</h2>
              {isGeneratingDescription ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : (
                <p className="text-gray-700 mb-4">{description}</p>
              )}
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Produkt:</span>
                  <span className="font-medium">{configuredItem.productName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Materiał:</span>
                  <span className="font-medium">{configuredItem.materialName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Wymiary:</span>
                  <span className="font-medium">
                    {configuredItem.dimensions.width} × {configuredItem.dimensions.height} 
                    {configuredItem.dimensions.depth > 0 && ` × ${configuredItem.dimensions.depth}`} mm
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Ilość:</span>
                  <span className="font-medium">{configuredItem.quantity} szt.</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Cena netto:</span>
                  <span className="text-orange-500">{configuredItem.totalPrice.toFixed(2)} zł</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(3)}
                className="w-full mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Przejdź do podsumowania
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && configuredItem && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Podsumowanie konfiguracji</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Twój produkt:</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Nazwa:</span> {configuredItem.productName}</p>
                <p><span className="text-gray-600">Materiał:</span> {configuredItem.materialName}</p>
                <p><span className="text-gray-600">Grubość:</span> {configuredItem.thickness}mm</p>
                <p><span className="text-gray-600">Wymiary:</span> {configuredItem.dimensions.width} × {configuredItem.dimensions.height} × {configuredItem.dimensions.depth} mm</p>
                <p><span className="text-gray-600">Ilość:</span> {configuredItem.quantity} szt.</p>
                {Object.entries(configuredItem.options).filter(([_, value]) => value).length > 0 && (
                  <>
                    <p className="text-gray-600 mt-3">Opcje dodatkowe:</p>
                    <ul className="list-disc list-inside ml-4">
                      {Object.entries(configuredItem.options)
                        .filter(([_, value]) => value)
                        .map(([option]) => (
                          <li key={option}>{option.replace(/_/g, ' ')}</li>
                        ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Cena całkowita (netto):</span>
                <span className="text-2xl font-bold text-orange-600">
                  {configuredItem.totalPrice.toFixed(2)} zł
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                * Do ceny należy doliczyć podatek VAT 23%
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(4)}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Wyślij zapytanie
            </button>
          </div>
        )}

        {currentStep === 4 && configuredItem && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Dane kontaktowe</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveConfiguration(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firma
                  </label>
                  <input
                    type="text"
                    value={customerInfo.company}
                    onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saved}
                className="w-full mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:bg-gray-400"
              >
                {saved ? 'Wysłano zapytanie!' : 'Wyślij zapytanie'}
              </button>
            </form>

            {saved && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-700 text-sm">
                  ✓ Dziękujemy! Twoja konfiguracja została zapisana. 
                  Skontaktujemy się z Tobą wkrótce.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};