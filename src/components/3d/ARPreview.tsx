// @ts-nocheck
import React, { useState } from 'react';
import { Camera, Smartphone, Download, Share2 } from 'lucide-react';
import { CalculatorItem } from '@/types/Offer';

interface ARPreviewProps {
  item: CalculatorItem;
}

export const ARPreview: React.FC<ARPreviewProps> = ({ item }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  React.useEffect(() => {
    // Generuj QR kod
    const modelUrl = `https://plexisystem.pl/ar/model/${item.id}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(modelUrl)}`;
    setQrCodeUrl(qrApiUrl);
  }, [item]);

  return (
    <div className="bg-zinc-700 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <Camera className="w-6 h-6 text-purple-600" />
        Podgląd AR (Augmented Reality)
      </h3>

      <div className="space-y-6">
        {/* Instrukcje */}
        <div className="bg-blue-500/20 rounded-lg p-4">
          <p className="text-sm text-blue-300 mb-2">
            <strong>Zobacz produkt w swojej przestrzeni!</strong>
          </p>
          <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
            <li>Zeskanuj kod QR telefonem</li>
            <li>Otwórz link w Safari (iOS) lub Chrome (Android)</li>
            <li>Skieruj kamerę na płaską powierzchnię</li>
            <li>Dotknij ekranu aby umieścić produkt</li>
          </ol>
        </div>

        {/* QR Code */}
        {qrCodeUrl && (
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-2">Zeskanuj telefonem:</p>
            <img src={qrCodeUrl} alt="QR Code AR" className="mx-auto rounded-lg shadow-md bg-white p-2" />
          </div>
        )}

        {/* Przyciski akcji */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.open(`https://plexisystem.pl/ar/model/${item.id}`, '_blank')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5" />
            Otwórz model AR
          </button>
          
          <button
            onClick={() => alert('Funkcja pobierania modelu będzie dostępna wkrótce')}
            className="px-6 py-3 bg-zinc-600 text-white rounded-lg hover:bg-zinc-500 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Pobierz model 3D
          </button>
        </div>

        {/* Kompatybilność */}
        <div className="text-xs text-gray-400 text-center">
          <p>Kompatybilne z: iOS 12+ (Safari), Android 7+ (Chrome)</p>
        </div>
      </div>

      {/* Informacje o produkcie w AR */}
      <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
        <h4 className="font-semibold mb-2 text-white">Parametry modelu AR:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-400">Wymiary:</span>
            <span className="ml-2 font-medium text-gray-200">
              {item.dimensions.width} × {item.dimensions.height} × {item.dimensions.depth} mm
            </span>
          </div>
          <div>
            <span className="text-gray-400">Skala:</span>
            <span className="ml-2 font-medium text-gray-200">1:1 (rzeczywista)</span>
          </div>
          <div>
            <span className="text-gray-400">Materiał:</span>
            <span className="ml-2 font-medium text-gray-200">{item.materialName}</span>
          </div>
          <div>
            <span className="text-gray-400">Grubość:</span>
            <span className="ml-2 font-medium text-gray-200">{item.thickness}mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};