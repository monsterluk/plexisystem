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
import { WZDocumentView } from './WZDocumentView';
import { QualityReportView } from './QualityReportView';
import { QualityReports } from './QualityReports';
import { useShippingDocuments } from '@/hooks/useShippingDocuments';
import { useQualityChecks } from '@/hooks/useQualityChecks';
import { generateShippingPDF } from '@/utils/generateShippingPDF';
import { generateQualityPDF, generateQualityCertificate } from '@/utils/generateQualityPDF';

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
  const { documents: shippingDocuments, createDocument, loading: loadingDocs } = useShippingDocuments();
  const { checks: qualityChecks, createCheck, getStatistics, loading: loadingChecks } = useQualityChecks();
  
  const [activeTab, setActiveTab] = useState<'shipping' | 'quality' | 'reports'>('shipping');
  const [showNewWZModal, setShowNewWZModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ShippingDocument | null>(null);
  const [showDocumentView, setShowDocumentView] = useState(false);
  const [selectedQualityReport, setSelectedQualityReport] = useState<QualityCheck | null>(null);
  const [showQualityReportView, setShowQualityReportView] = useState(false);

  // Przykładowe dane
  const handleSaveWZ = async (document: any) => {
    try {
      await createDocument(document);
      console.log('Dokument WZ zapisany');
      setShowNewWZModal(false);
    } catch (error) {
      console.error('Błąd podczas zapisywania dokumentu WZ:', error);
      // TODO: Pokaż komunikat o błędzie
    }
  };

  const handleSaveQuality = async (check: any) => {
    try {
      await createCheck(check);
      console.log('Kontrola jakości zapisana');
      setShowQualityModal(false);
    } catch (error) {
      console.error('Błąd podczas zapisywania kontroli jakości:', error);
      // TODO: Pokaż komunikat o błędzie
    }
  };

  const handleGenerateReport = (type: string, params: any) => {
    console.log('Generowanie raportu:', type, params);
    // TODO: Implementacja generowania raportów
  };

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
      {loadingDocs ? (
        <div className="text-center py-8 text-gray-400">
          <p>Ładowanie dokumentów...</p>
        </div>
      ) : shippingDocuments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Brak dokumentów WZ</p>
          <p className="text-sm mt-1">Kliknij "Nowy dokument WZ" aby utworzyć pierwszy dokument</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shippingDocuments.map(doc => (
            <div key={doc.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold text-white text-lg">{doc.document_number}</h4>
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
                      <p className="text-gray-200 font-medium">{doc.client_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Zamówienie:</span>
                      <p className="text-gray-200 font-medium">{doc.order_number || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Data:</span>
                      <p className="text-gray-200 font-medium">{new Date(doc.delivery_date).toLocaleDateString('pl-PL')}</p>
                    </div>
                  </div>

                  {doc.items && doc.items.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Pozycje:</p>
                      <div className="space-y-1">
                        {doc.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.product_name}</span>
                            <span className="text-gray-400">{item.quantity} {item.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => {
                    setSelectedDocument(doc);
                    setShowDocumentView(true);
                  }}
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
                  onClick={() => {
                    const pdf = generateShippingPDF(doc);
                    pdf.save(`WZ_${doc.document_number.replace(/\//g, '_')}.pdf`);
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Drukuj"
                >
                  <Printer className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}        </div>
      )}
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
      {loadingChecks ? (
        <div className="text-center py-8 text-gray-400">
          <p>Ładowanie kontroli...</p>
        </div>
      ) : qualityChecks.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Brak kontroli jakości</p>
          <p className="text-sm mt-1">Kliknij "Nowa kontrola" aby dodać pierwszą kontrolę</p>
        </div>
      ) : (
        <div className="space-y-4">
          {qualityChecks.map(check => (
            <div key={check.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold text-white">{check.product_name}</h4>
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
                      <p className="text-gray-200 font-medium">{check.order_number || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Data kontroli:</span>
                      <p className="text-gray-200 font-medium">{new Date(check.check_date).toLocaleDateString('pl-PL')}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Inspektor:</span>
                      <p className="text-gray-200 font-medium">{check.inspector}</p>
                    </div>
                  </div>

                {/* Pomiary */}
                {check.measurements && check.measurements.length > 0 && (
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
                              measurement.in_tolerance ? 'text-green-400' : 'text-red-400'
                            }`}>
                              Zmierzono: {measurement.measured}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Defekty */}
                {check.defects && check.defects.length > 0 && (
                  <div className="bg-yellow-500/10 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-300 mb-2">Niezgodności:</p>
                    {check.defects.map(defect => (
                      <div key={defect.id} className="text-sm">
                        <p className="text-yellow-200">{defect.description}</p>
                        <p className="text-gray-400 mt-1">Działanie: {defect.action_taken || 'Brak'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button 
                  onClick={() => {
                    setSelectedQualityReport(check);
                    setShowQualityReportView(true);
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => {
                    const pdf = generateQualityPDF(check);
                    pdf.save(`Kontrola_jakosci_${check.order_number}_${check.check_date}.pdf`);
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Pobierz PDF"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                {check.status === 'passed' && (
                  <button 
                    onClick={() => {
                      const pdf = generateQualityCertificate(check);
                      pdf.save(`Certyfikat_${check.order_number}_${check.check_date}.pdf`);
                    }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Certyfikat jakości"
                  >
                    <FileText className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
          ))}        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <QualityReports onGenerateReport={handleGenerateReport} />
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
        
        <WZDocumentView
          document={selectedDocument}
          isOpen={showDocumentView}
          onClose={() => setShowDocumentView(false)}
        />
        
        <QualityReportView
          report={selectedQualityReport}
          isOpen={showQualityReportView}
          onClose={() => setShowQualityReportView(false)}
        />
      </div>
    </div>
  );
}