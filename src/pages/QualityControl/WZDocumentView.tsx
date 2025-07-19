import React from 'react';
import { X, Printer, Download, Send, Check } from 'lucide-react';

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

  const handleSendEmail = () => {
    // TODO: Implementacja wysyłania emaila
    console.log('Wysyłanie dokumentu emailem');
  };

  const handleConfirm = () => {
    // TODO: Zmiana statusu na confirmed
    console.log('Zatwierdzanie dokumentu');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col print:max-h-none print:rounded-none">
        {/* Nagłówek - ukryty podczas drukowania */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center print:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Dokument WZ</h2>
          <div className="flex items-center gap-2">
            {document.status === 'draft' && (
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
              >
                <Check className="w-4 h-4" />
                Zatwierdź
              </button>
            )}
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              <Send className="w-4 h-4" />
              Wyślij email
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              <Printer className="w-4 h-4" />
              Drukuj
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Treść dokumentu */}
        <div className="flex-1 overflow-y-auto p-8 bg-white text-gray-900 print:overflow-visible">
          <div className="max-w-3xl mx-auto">
            {/* Nagłówek dokumentu */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">PlexiSystem</h1>
                  <p className="text-gray-600 mt-1">ul. Przykładowa 1, 00-001 Warszawa</p>
                  <p className="text-gray-600">NIP: 123-456-78-90</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-900">DOKUMENT WZ</h2>
                  <p className="text-lg font-semibold mt-2">{document.documentNumber}</p>
                  <p className="text-gray-600">Data wystawienia: {new Date(document.date).toLocaleDateString('pl-PL')}</p>
                </div>
              </div>
            </div>

            {/* Dane odbiorcy */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Odbiorca:</h3>
              <p className="font-medium">{document.clientName}</p>
              <p className="text-gray-600">{document.clientAddress}</p>
              <p className="text-gray-600">NIP: {document.clientNIP}</p>
              {document.deliveryAddress && document.deliveryAddress !== document.clientAddress && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="font-medium">Adres dostawy:</p>
                  <p className="text-gray-600">{document.deliveryAddress}</p>
                </div>
              )}
            </div>

            {/* Tabela produktów */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 px-3">Lp.</th>
                    <th className="text-left py-2 px-3">Nazwa produktu</th>
                    <th className="text-center py-2 px-3">Ilość</th>
                    <th className="text-center py-2 px-3">J.m.</th>
                    <th className="text-right py-2 px-3">Cena netto</th>
                    <th className="text-center py-2 px-3">VAT</th>
                    <th className="text-right py-2 px-3">Wartość brutto</th>
                  </tr>
                </thead>
                <tbody>
                  {document.items.map((item: any, index: number) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 px-3">{index + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">{item.productCode}</p>
                      </td>
                      <td className="py-3 px-3 text-center">{item.quantity}</td>
                      <td className="py-3 px-3 text-center">{item.unit}</td>
                      <td className="py-3 px-3 text-right">{(item.price * item.quantity).toFixed(2)} zł</td>
                      <td className="py-3 px-3 text-center">{item.vat}%</td>
                      <td className="py-3 px-3 text-right font-medium">{item.total.toFixed(2)} zł</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={4} className="py-3 px-3 text-right font-semibold">Razem:</td>
                    <td className="py-3 px-3 text-right">{document.netTotal?.toFixed(2)} zł</td>
                    <td className="py-3 px-3 text-center">-</td>
                    <td className="py-3 px-3 text-right font-bold text-lg">{document.grossTotal?.toFixed(2)} zł</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Uwagi */}
            {document.notes && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Uwagi:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{document.notes}</p>
              </div>
            )}

            {/* Podpisy */}
            <div className="mt-16 grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-t-2 border-gray-400 pt-2">
                  <p className="text-sm text-gray-600">Wystawił</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-400 pt-2">
                  <p className="text-sm text-gray-600">Odebrał</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Style dla drukowania */}
      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:max-h-none {
            max-height: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:overflow-visible {
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}