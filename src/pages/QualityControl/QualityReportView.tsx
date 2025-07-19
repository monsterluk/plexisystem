import React from 'react';
import { X, Printer, Download, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

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

  const getStatusIcon = () => {
    switch (report.status) {
      case 'passed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'conditional':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (report.status) {
      case 'passed':
        return 'ZGODNE';
      case 'conditional':
        return 'WARUNKOWE';
      case 'failed':
        return 'NIEZGODNE';
    }
  };

  const getStatusColor = () => {
    switch (report.status) {
      case 'passed':
        return 'text-green-600';
      case 'conditional':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col print:max-h-none print:rounded-none">
        {/* Nagłówek - ukryty podczas drukowania */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center print:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Protokół Kontroli Jakości</h2>
          <div className="flex items-center gap-2">
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

        {/* Treść protokołu */}
        <div className="flex-1 overflow-y-auto p-8 bg-white text-gray-900 print:overflow-visible">
          <div className="max-w-3xl mx-auto">
            {/* Nagłówek protokołu */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">PROTOKÓŁ KONTROLI JAKOŚCI</h1>
              <p className="text-gray-600">Nr zamówienia: {report.orderNumber}</p>
              <p className="text-gray-600">Data kontroli: {new Date(report.checkDate).toLocaleDateString('pl-PL')} {report.checkTime}</p>
            </div>

            {/* Status kontroli */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-center gap-4">
                {getStatusIcon()}
                <div>
                  <p className="text-sm text-gray-600">Status kontroli:</p>
                  <p className={`text-2xl font-bold ${getStatusColor()}`}>{getStatusText()}</p>
                </div>
              </div>
            </div>

            {/* Dane produktu */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-3">Dane produktu:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nazwa produktu:</p>
                  <p className="font-medium">{report.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kod produktu:</p>
                  <p className="font-medium">{report.productCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Numer partii:</p>
                  <p className="font-medium">{report.batchNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ilość kontrolowana:</p>
                  <p className="font-medium">{report.quantity} szt.</p>
                </div>
              </div>
            </div>

            {/* Pomiary */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-3">Wyniki pomiarów:</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 px-3">Parametr</th>
                    <th className="text-center py-2 px-3">Wartość nominalna</th>
                    <th className="text-center py-2 px-3">Tolerancja</th>
                    <th className="text-center py-2 px-3">Wartość zmierzona</th>
                    <th className="text-center py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.measurements.map((measurement: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-3">{measurement.parameter}</td>
                      <td className="py-3 px-3 text-center">{measurement.nominal}</td>
                      <td className="py-3 px-3 text-center">±{measurement.tolerance}</td>
                      <td className={`py-3 px-3 text-center font-medium ${
                        measurement.inTolerance ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {measurement.measured}
                      </td>
                      <td className="py-3 px-3 text-center">
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
                <h3 className="font-semibold text-lg mb-3">Stwierdzone niezgodności:</h3>
                <div className="space-y-3">
                  {report.defects.map((defect: any, index: number) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      defect.severity === 'critical' 
                        ? 'bg-red-50 border-red-200' 
                        : defect.severity === 'major'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{defect.type}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          defect.severity === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : defect.severity === 'major'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {defect.severity === 'critical' ? 'Krytyczna' :
                           defect.severity === 'major' ? 'Znacząca' : 'Drobna'}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{defect.description}</p>
                      {defect.action && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Działanie:</span> {defect.action}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uwagi */}
            {report.notes && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Uwagi dodatkowe:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{report.notes}</p>
              </div>
            )}

            {/* Kontroler */}
            <div className="mb-8">
              <p className="text-sm text-gray-600">Kontrolę przeprowadził:</p>
              <p className="font-medium text-lg">{report.inspector}</p>
            </div>

            {/* Podpis */}
            <div className="mt-16">
              <div className="w-64 mx-auto text-center">
                <div className="border-t-2 border-gray-400 pt-2">
                  <p className="text-sm text-gray-600">Podpis kontrolera</p>
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