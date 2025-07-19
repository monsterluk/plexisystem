import React from 'react';
import { X, Printer, Download, Mail, Check } from 'lucide-react';

interface WZDocumentViewProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
}

export function WZDocumentView({ document, isOpen, onClose }: WZDocumentViewProps) {
  if (!isOpen || !document) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implementacja generowania PDF
    console.log('Pobieranie PDF...');
  };

  const handleSendEmail = () => {
    // TODO: Implementacja wysyłania emaila
    console.log('Wysyłanie emaila...');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Nagłówek */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 print:hidden">
          <h2 className="text-xl font-semibold text-gray-800">Dokument WZ - Podgląd</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              <Printer className="w-4 h-4" />
              Drukuj
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Treść dokumentu */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Nagłówek dokumentu */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">DOKUMENT WYDANIA WZ</h1>
                  <p className="text-lg font-semibold text-gray-600">{document.document_number || document.documentNumber}</p>
                </div>
                <div className="text-right">
                  <div className="mb-4">
                    <img src="/logo-placeholder.png" alt="Logo firmy" className="h-16 ml-auto" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">PlexiCraft Sp. z o.o.</p>
                    <p>ul. Przemysłowa 10</p>
                    <p>80-298 Gdańsk</p>
                    <p>NIP: 123-456-78-90</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dane odbiorcy i dostawy */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase">Odbiorca</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">{document.client_name || document.clientName}</p>
                  <p className="text-gray-600">{document.client_address || document.clientAddress}</p>
                  <p className="text-gray-600">NIP: {document.client_nip || document.clientNIP}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase">Dostawa</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{document.delivery_address || document.deliveryAddress || document.client_address || document.clientAddress}</p>
                  <p className="text-gray-600 mt-2">
                    <span className="font-semibold">Data wydania:</span> {document.delivery_date ? new Date(document.delivery_date).toLocaleDateString('pl-PL') : document.deliveryDate ? new Date(document.deliveryDate).toLocaleDateString('pl-PL') : 'Brak daty'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Nr zamówienia:</span> {document.order_number || document.orderNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabela produktów */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Specyfikacja</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Lp.</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Nazwa produktu</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Ilość</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">J.m.</th>
                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">Cena netto</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">VAT</th>
                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">Wartość brutto</th>
                  </tr>
                </thead>
                <tbody>
                  {document.items.map((item: any, index: number) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <p className="font-medium text-gray-800">{item.product_name || item.productName}</p>
                        <p className="text-xs text-gray-500">{item.product_code || item.productCode}</p>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.unit}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.vat}%</td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={6} className="border border-gray-300 px-4 py-2 text-right font-semibold">Wartość netto:</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{formatCurrency(document.net_total || document.netTotal || 0)}</td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="border border-gray-300 px-4 py-2 text-right font-semibold">VAT:</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{formatCurrency(document.vat_total || document.vatTotal || 0)}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td colSpan={6} className="border border-gray-300 px-4 py-3 text-right font-bold text-lg">Razem do zapłaty:</td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-bold text-lg text-blue-600">{formatCurrency(document.gross_total || document.grossTotal || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Uwagi */}
            {document.notes && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase">Uwagi</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{document.notes}</p>
                </div>
              </div>
            )}

            {/* Podpisy */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <div className="border-t-2 border-gray-400 pt-2 mt-16">
                  <p className="text-sm text-gray-600">Wydał</p>
                  <p className="text-xs text-gray-500 mt-1">(data i podpis)</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-400 pt-2 mt-16">
                  <p className="text-sm text-gray-600">Odebrał</p>
                  <p className="text-xs text-gray-500 mt-1">(data i podpis)</p>
                </div>
              </div>
            </div>

            {/* Stopka */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Dokument wygenerowany elektronicznie w systemie PlexiSystem</p>
              <p>Data wydruku: {new Date().toLocaleString('pl-PL')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Style do druku */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: white !important;
          }
          .fixed * {
            visibility: visible;
          }
          .bg-gray-50 {
            background-color: #f9fafb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .bg-gray-100 {
            background-color: #f3f4f6 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}