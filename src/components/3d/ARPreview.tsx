// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Camera, Smartphone, Download, Share2, Maximize2 } from 'lucide-react';
import { CalculatorItem } from '@/types/Offer';

interface ARPreviewProps {
  item: CalculatorItem;
}

export const ARPreview: React.FC<ARPreviewProps> = ({ item }) => {
  const [isARActive, setIsARActive] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Generuj model USDZ dla iOS lub GLB dla Android
  const generate3DModel = async () => {
    // W prawdziwej aplikacji tutaj byłaby konwersja do formatu AR
    const modelData = {
      type: item.product,
      dimensions: item.dimensions,
      material: item.material,
      options: item.options
    };

    // Symulacja generowania modelu
    const modelUrl = `/api/ar/generate-model?data=${encodeURIComponent(JSON.stringify(modelData))}`;
    
    // Generuj QR kod do modelu AR
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(modelUrl)}`;
    setQrCodeUrl(qrApiUrl);

    return modelUrl;
  };

  const startARPreview = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Twoja przeglądarka nie obsługuje funkcji kamery');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsARActive(true);
      }
    } catch (error) {
      console.error('Błąd dostępu do kamery:', error);
      alert('Nie można uzyskać dostępu do kamery');
    }
  };

  const stopARPreview = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsARActive(false);
    }
  };

  const downloadARModel = async () => {
    const modelUrl = await generate3DModel();
    // Pobierz model
    const link = document.createElement('a');
    link.href = modelUrl;
    link.download = `${item.productName}_AR_model.usdz`;
    link.click();
  };

  React.useEffect(() => {
    generate3DModel();
    return () => {
      stopARPreview();
    };
  }, [item]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Camera className="w-6 h-6 text-purple-600" />
        Podgląd AR (Augmented Reality)
      </h3>

      {!isARActive ? (
        <div className="space-y-6">
          {/* Instrukcje */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Zobacz produkt w swojej przestrzeni!</strong>
            </p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Kliknij "Uruchom podgląd AR" na komputerze lub</li>
              <li>Zeskanuj kod QR telefonem aby zobaczyć model w AR</li>
              <li>Skieruj kamerę na płaską powierzchnię</li>
              <li>Dotknij ekranu aby umieścić produkt</li>
            </ol>
          </div>

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Zeskanuj telefonem:</p>
              <img src={qrCodeUrl} alt="QR Code AR" className="mx-auto rounded-lg shadow-md" />
            </div>
          )}

          {/* Przyciski akcji */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={startARPreview}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5" />
              Uruchom podgląd AR
            </button>
            
            <button
              onClick={downloadARModel}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Pobierz model 3D
            </button>
          </div>

          {/* Kompatybilność */}
          <div className="text-xs text-gray-500 text-center">
            <p>Kompatybilne z: iOS 12+ (Safari), Android 7+ (Chrome)</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* AR Camera View */}
          <div className="relative rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[400px] object-cover"
            />
            
            {/* AR Overlay - tutaj normalnie byłby renderowany model 3D */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                {/* Symulacja modelu AR */}
                <div 
                  className="w-64 h-64 border-4 border-purple-500 border-dashed rounded-lg animate-pulse"
                  style={{
                    perspective: '1000px',
                    transform: 'rotateX(20deg) rotateY(30deg)'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-purple-500 font-bold">
                    Model AR
                  </div>
                </div>
                
                {/* Wskaźniki AR */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-purple-500"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-purple-500"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-purple-500"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-purple-500"></div>
              </div>
            </div>

            {/* Kontrolki AR */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                Dotknij aby umieścić
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors">
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Przycisk zamknięcia */}
          <button
            onClick={stopARPreview}
            className="w-full mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Zakończ podgląd AR
          </button>
        </div>
      )}

      {/* Informacje o produkcie w AR */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Parametry modelu AR:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Wymiary:</span>
            <span className="ml-2 font-medium">
              {item.dimensions.width} × {item.dimensions.height} × {item.dimensions.depth} mm
            </span>
          </div>
          <div>
            <span className="text-gray-600">Skala:</span>
            <span className="ml-2 font-medium">1:1 (rzeczywista)</span>
          </div>
          <div>
            <span className="text-gray-600">Materiał:</span>
            <span className="ml-2 font-medium">{item.materialName}</span>
          </div>
          <div>
            <span className="text-gray-600">Tekstura:</span>
            <span className="ml-2 font-medium">Realistyczna</span>
          </div>
        </div>
      </div>
    </div>
  );
};