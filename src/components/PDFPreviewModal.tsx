import React from 'react';
import { X, Download, Printer } from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  fileName: string;
}

export function PDFPreviewModal({ isOpen, onClose, pdfUrl, fileName }: PDFPreviewModalProps) {
  if (!isOpen || !pdfUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-5xl w-full h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Podgląd: {fileName}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
              title="Drukuj"
            >
              <Printer className="w-4 h-4" />
              Drukuj
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm"
              title="Pobierz PDF"
            >
              <Download className="w-4 h-4" />
              Pobierz
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
              title="Zamknij"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <iframe
            src={pdfUrl}
            className="w-full h-full rounded-lg bg-white"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}