import React, { useState } from 'react';
import { 
  CheckCircle, 
  Truck, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Package,
  ClipboardCheck,
  Plus,
  Search,
  Calendar,
  Download,
  Eye,
  Edit,
  Printer,
  ChevronRight,
  Clock,
  X,
  Check
} from 'lucide-react';
import { NewWZModal } from './NewWZModal';
import { QualityControlModal } from './QualityControlModal';

interface ShippingDocument {
  id: string;
  documentNumber: string;
  orderNumber: string;
  clientName: string;
  date: string;
  status: 'draft' | 'confirmed' | 'sent';
  items: ShippingItem[];
  totalValue: number;
}

interface ShippingItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  serialNumbers?: string[];
}

interface QualityCheck {
  id: string;
  orderNumber: string;
  productName: string;
  checkDate: string;
  inspector: string;
  status: 'passed' | 'failed' | 'conditional';
  measurements: Measurement[];
  defects: Defect[];
}

interface Measurement {
  parameter: string;
  nominal: number;
  tolerance: number;
  measured: number;
  inTolerance: boolean;
}

interface Defect {
  id: string;
  type: string;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  action: string;
}

export function QualityControl() {
  const [activeTab, setActiveTab] = useState<'shipping' | 'quality' | 'reports'>('shipping');
  const [showNewWZModal, setShowNewWZModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ShippingDocument | null>(null);

  // Przykładowe dane
  const handleSaveWZ = (document: any) => {
    console.log('Zapisywanie dokumentu WZ:', document);
    // TODO: Integracja z bazą danych
    setShowNewWZModal(false);
  };

  const handleSaveQuality = (check: any) => {
    console.log('Zapisywanie kontroli jakości:', check);
    // TODO: Integracja z bazą danych
    setShowQualityModal(false);
  };

  const [shippingDocuments] = useState<ShippingDocument[]>([
    {
      id: '1',
      documentNumber: 'WZ/2024/07/001',
      orderNumber: 'ZAM/2024/07/015',
      clientName: 'Firma ABC Sp. z o.o.',
      date: '2024-07-19',
      status: 'confirmed',
      items: [
        { id: '1', productName: 'Kaseton LED 100x50cm', quantity: 5, unit: 'szt' },
        { id: '2', productName: 'Plexi mleczne 3mm', quantity: 10, unit: 'm²' }
      ],
      totalValue: 4500
    },
    {
      id: '2',
      documentNumber: 'WZ/2024/07/002',
      orderNumber: 'ZAM/2024/07/016',
      clientName: 'Studio Reklamy XYZ',
      date: '2024-07-19',
      status: 'draft',
      items: [
        { id: '3', productName: 'Litery przestrzenne 30cm', quantity: 8, unit: 'szt' }
      ],
      totalValue: 2400
    }
  ]);

  const [qualityChecks] = useState<QualityCheck[]>([
    {
      id: '1',
      orderNumber: 'ZAM/2024/07/015',
      productName: 'Kaseton LED 100x50cm',
      checkDate: '2024-07-19',
      inspector: 'Jan Kowalski',
      status: 'passed',
      measurements: [
        { parameter: 'Szerokość', nominal: 1000, tolerance: 2, measured: 999.5, inTolerance: true },
        { parameter: 'Wysokość', nominal: 500, tolerance: 2, measured: 500.5, inTolerance: true },
        { parameter: 'Grubość', nominal: 100, tolerance: 1, measured: 100.2, inTolerance: true }
      ],
      defects: []
    },
    {
      id: '2',
      orderNumber: 'ZAM/2024/07/014',
      productName: 'Plexi transparentne 5mm',
      checkDate: '2024-07-18',
      inspector: 'Anna Nowak',
      status: 'conditional',
      measurements: [
        { parameter: 'Grubość', nominal: 5, tolerance: 0.2, measured: 5.3, inTolerance: false }
      ],
      defects: [
        {
          id: '1',
          type: 'Wymiarowa',
          severity: 'minor',
          description: 'Grubość przekracza tolerancję o 0.1mm',
          action: 'Dopuszczono warunkowo po konsultacji z klientem'
        }
      ]
    }
  ]);

  const renderShippingDocuments = () => (
    <div className="space-y-6">
      {/* Nagłówek z przyciskiem */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Dokumenty WZ</h3>
          <p className="text-sm text-gray-400 mt-1">Wystawiaj dokumenty wydania zewnętrznego</p>
        </div>
        <button
          onClick={() => setShowNewWZModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nowy dokument WZ
        </button>
      </div>

      {/* Filtry */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Szukaj</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nr dokumentu, klient..."
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Data od</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Data do</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500">
              <option value="">Wszystkie</option>
              <option value="draft">Wersja robocza</option>
              <option value="confirmed">Zatwierdzone</option>
              <option value="sent">Wysłane</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista dokumentów */}
      <div className="space-y-4">
        {shippingDocuments.map(doc => (
          <div key={doc.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="font-semibold text-white text-lg">{doc.documentNumber}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                    doc.status === 'sent' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {doc.status === 'confirmed' ? 'Zatwierdzone' :
                     doc.status === 'sent' ? 'Wysłane' : 'Wersja robocza'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Klient:</span>
                    <p className="text-gray-200 font-medium">{doc.clientName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Zamówienie:</span>
                    <p className="text-gray-200 font-medium">{doc.orderNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Data:</span>
                    <p className="text-gray-200 font-medium">{new Date(doc.date).toLocaleDateString('pl-PL')}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Pozycje:</p>
                  <div className="space-y-1">
                    {doc.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.productName}</span>
                        <span className="text-gray-400">{item.quantity} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setSelectedDocument(doc)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Podgląd"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Edytuj"
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Drukuj"
                >
                  <Printer className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQualityControl = () => (
    <div className="space-y-6">
      {/* Nagłówek z przyciskiem */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Kontrola Jakości</h3>
          <p className="text-sm text-gray-400 mt-1">Protokoły pomiarowe i karty kontrolne</p>
        </div>
        <button
          onClick={() => setShowQualityModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
        >
          <ClipboardCheck className="w-4 h-4" />
          Nowa kontrola
        </button>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-300">Zgodne</p>
              <p className="text-2xl font-bold text-green-400">94%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-300">Warunkowe</p>
              <p className="text-2xl font-bold text-yellow-400">4%</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400 opacity-50" />
          </div>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-300">Niezgodne</p>
              <p className="text-2xl font-bold text-red-400">2%</p>
            </div>
            <X className="w-8 h-8 text-red-400 opacity-50" />
          </div>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-300">Kontrole dzisiaj</p>
              <p className="text-2xl font-bold text-blue-400">12</p>
            </div>
            <ClipboardCheck className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Lista kontroli */}
      <div className="space-y-4">
        {qualityChecks.map(check => (
          <div key={check.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="font-semibold text-white">{check.productName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    check.status === 'passed' ? 'bg-green-500/20 text-green-400' :
                    check.status === 'conditional' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {check.status === 'passed' ? 'Zgodne' :
                     check.status === 'conditional' ? 'Warunkowe' : 'Niezgodne'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-400">Zamówienie:</span>
                    <p className="text-gray-200 font-medium">{check.orderNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Data kontroli:</span>
                    <p className="text-gray-200 font-medium">{new Date(check.checkDate).toLocaleDateString('pl-PL')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Inspektor:</span>
                    <p className="text-gray-200 font-medium">{check.inspector}</p>
                  </div>
                </div>

                {/* Pomiary */}
                <div className="bg-gray-700/30 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-gray-300 mb-2">Pomiary:</p>
                  <div className="space-y-1">
                    {check.measurements.map((measurement, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{measurement.parameter}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-400">
                            Nominal: {measurement.nominal}±{measurement.tolerance}
                          </span>
                          <span className={`font-medium ${
                            measurement.inTolerance ? 'text-green-400' : 'text-red-400'
                          }`}>
                            Zmierzono: {measurement.measured}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Defekty */}
                {check.defects.length > 0 && (
                  <div className="bg-yellow-500/10 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-300 mb-2">Niezgodności:</p>
                    {check.defects.map(defect => (
                      <div key={defect.id} className="text-sm">
                        <p className="text-yellow-200">{defect.description}</p>
                        <p className="text-gray-400 mt-1">Działanie: {defect.action}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Raporty Jakościowe</h3>
        <p className="text-sm text-gray-400 mt-1">Analizy i statystyki kontroli jakości</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wykres zgodności */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h4 className="font-medium text-white mb-4">Zgodność produkcji - ostatnie 30 dni</h4>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <BarChart3 className="w-16 h-16 opacity-20" />
            <span className="ml-2">Wykres zgodności</span>
          </div>
        </div>

        {/* Top defekty */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h4 className="font-medium text-white mb-4">Najczęstsze niezgodności</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Wymiary poza tolerancją</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm text-gray-400">35%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Defekty powierzchni</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm text-gray-400">25%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Nieprawidłowy montaż</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm text-gray-400">20%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Inne</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm text-gray-400">20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Raporty do pobrania */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 md:col-span-2">
          <h4 className="font-medium text-white mb-4">Generuj raporty</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-orange-400" />
                <span className="text-gray-200">Raport miesięczny</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span className="text-gray-200">Analiza trendów</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-200">Rejestr niezgodności</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Nagłówek */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Kontrola Jakości i Wysyłki</h1>
          <p className="text-gray-400">Zarządzaj dokumentami WZ i kontroluj jakość produkcji</p>
        </div>

        {/* Zakładki */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'shipping' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            Dokumenty WZ
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'quality' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Kontrola Jakości
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'reports' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Raporty
          </button>
        </div>

        {/* Zawartość zakładek */}
        {activeTab === 'shipping' && renderShippingDocuments()}
        {activeTab === 'quality' && renderQualityControl()}
        {activeTab === 'reports' && renderReports()}
        
        {/* Modale */}
        <NewWZModal 
          isOpen={showNewWZModal}
          onClose={() => setShowNewWZModal(false)}
          onSave={handleSaveWZ}
        />
        
        <QualityControlModal
          isOpen={showQualityModal}
          onClose={() => setShowQualityModal(false)}
          onSave={handleSaveQuality}
        />
      </div>
    </div>
  );
}