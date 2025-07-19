import React from 'react';
import { X, Printer, Download, Mail, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface QualityReportViewProps {
  report: any;
  isOpen: boolean;
  onClose: () => void;
}

export function QualityReportView({ report, isOpen, onClose }: QualityReportViewProps) {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implementacja generowania PDF
    console.log('Pobieranie PDF protokołu...');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'conditional':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'passed':
        return 'ZGODNE';
      case 'conditional':
        return 'WARUNKOWE';
      case 'failed':
        return 'NIEZGODNE';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'conditional':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Nagłówek */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 print:hidden">
          <h2 className="text-xl font-semibold text-gray-800">Protokół Kontroli Jakości - Podgląd</h2>
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
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Treść protokołu */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Nagłówek protokołu */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">PROTOKÓŁ KONTROLI JAKOŚCI</h1>
              <p className="text-gray-600">Nr protokołu: PKJ/{new Date().getFullYear()}/{String(new Date().getMonth() + 1).padStart(2, '0')}/{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</p>
            </div>

            {/* Status główny */}
            <div className={`mb-8 p-6 rounded-lg border-2 ${getStatusColor(report.status)}`}>
              <div className="flex items-center justify-center gap-4">
                {getStatusIcon(report.status)}
                <h2 className="text-2xl font-bold">{getStatusText(report.status)}</h2>
              </div>
            </div>

            {/* Informacje podstawowe */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informacje podstawowe</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Numer zamówienia:</p>
                  <p className="font-semibold text-gray-800">{report.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data kontroli:</p>
                  <p className="font-semibold text-gray-800">{new Date(report.checkDate).toLocaleDateString('pl-PL')} {report.checkTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Produkt:</p>
                  <p className="font-semibold text-gray-800">{report.productName}</p>
                  <p className="text-xs text-gray-500">{report.productCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Numer partii:</p>
                  <p className="font-semibold text-gray-800">{report.batchNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ilość kontrolowana:</p>
                  <p className="font-semibold text-gray-800">{report.quantity} szt.</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kontroler:</p>
                  <p className="font-semibold text-gray-800">{report.inspector}</p>
                </div>
              </div>
            </div>

            {/* Pomiary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Wyniki pomiarów</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Parametr</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Wartość nominalna</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Tolerancja (±)</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Wartość zmierzona</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.measurements?.map((measurement: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{measurement.parameter}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{measurement.nominal}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{measurement.tolerance}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center font-medium">
                        {measurement.measured}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {measurement.inTolerance ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            NOK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Niezgodności */}
            {report.defects && report.defects.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Wykryte niezgodności</h3>
                <div className="space-y-4">
                  {report.defects.map((defect: any, index: number) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      defect.severity === 'critical' ? 'bg-red-50 border-red-200' :
                      defect.severity === 'major' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            defect.severity === 'critical' ? 'bg-red-200 text-red-800' :
                            defect.severity === 'major' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {defect.severity === 'critical' ? 'KRYTYCZNA' :
                             defect.severity === 'major' ? 'ZNACZĄCA' : 'DROBNA'}
                          </span>
                          <span className="ml-2 font-semibold text-gray-700">{defect.type}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{defect.description}</p>
                      {defect.action && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Podjęte działanie:</span> {defect.action}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uwagi */}
            {report.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Uwagi dodatkowe</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{report.notes}</p>
                </div>
              </div>
            )}

            {/* Decyzja */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Decyzja</h3>
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(report.status)}`}>
                <p className="font-semibold">
                  {report.status === 'passed' && 'Produkt spełnia wszystkie wymagania jakościowe i może zostać wydany.'}
                  {report.status === 'conditional' && 'Produkt może zostać wydany warunkowo po uzgodnieniu z klientem.'}
                  {report.status === 'failed' && 'Produkt nie spełnia wymagań jakościowych i nie może zostać wydany.'}
                </p>
              </div>
            </div>

            {/* Podpisy */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-16">Kontroler jakości:</p>
                <div className="border-t-2 border-gray-400 pt-2">
                  <p className="font-semibold">{report.inspector}</p>
                  <p className="text-xs text-gray-500 mt-1">(data i podpis)</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-16">Kierownik produkcji:</p>
                <div className="border-t-2 border-gray-400 pt-2">
                  <p className="text-xs text-gray-500">(data i podpis)</p>
                </div>
              </div>
            </div>

            {/* Stopka */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Protokół wygenerowany elektronicznie w systemie PlexiSystem</p>
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
          .bg-gray-50, .bg-gray-100, .bg-green-50, .bg-yellow-50, .bg-red-50 {
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