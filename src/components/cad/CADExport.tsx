// @ts-nocheck
import React, { useState } from 'react';
import { Download, FileCode, File3d, FileImage, Layers } from 'lucide-react';
import { CalculatorItem } from '@/types/Offer';
import { cadExporter } from '@/services/cad/cadExporter';

interface CADExportProps {
  item: CalculatorItem;
}

export const CADExport: React.FC<CADExportProps> = ({ item }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const exportFormats = [
    {
      format: 'dxf',
      name: 'DXF (2D)',
      icon: FileCode,
      description: 'Do AutoCAD, LibreCAD',
      color: 'blue'
    },
    {
      format: 'step',
      name: 'STEP (3D)',
      icon: File3d,
      description: 'Do SolidWorks, Fusion 360',
      color: 'green'
    },
    {
      format: 'stl',
      name: 'STL (3D)',
      icon: Layers,
      description: 'Do druku 3D',
      color: 'purple'
    },
    {
      format: 'svg',
      name: 'SVG (2D)',
      icon: FileImage,
      description: 'Do cięcia laserowego',
      color: 'orange'
    }
  ];

  const handleExport = async (format: 'dxf' | 'step' | 'stl' | 'svg') => {
    setIsExporting(format);
    
    try {
      const blob = await cadExporter.exportToFormat(item, format);
      
      // Utwórz link do pobrania
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.productName}_${item.dimensions.width}x${item.dimensions.height}x${item.dimensions.depth}.${format}`;
      
      // Symuluj kliknięcie
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Zwolnij pamięć
      URL.revokeObjectURL(url);
      
      // Pokaż sukces
      setTimeout(() => {
        alert(`Plik ${format.toUpperCase()} został pobrany!`);
      }, 100);
      
    } catch (error) {
      console.error('Błąd eksportu:', error);
      alert('Wystąpił błąd podczas eksportu pliku');
    } finally {
      setIsExporting(null);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      orange: 'bg-orange-500 hover:bg-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-400',
      green: 'text-green-400',
      purple: 'text-purple-400',
      orange: 'text-orange-400'
    };
    return colors[color as keyof typeof colors] || 'text-blue-400';
  };

  return (
    <div className="bg-zinc-700 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <Download className="w-6 h-6 text-blue-500" />
        Eksport do CAD
      </h3>

      <p className="text-gray-300 mb-6">
        Pobierz plik techniczny do swojego programu CAD lub maszyny CNC
      </p>

      <div className="grid grid-cols-2 gap-4">
        {exportFormats.map(({ format, name, icon: Icon, description, color }) => (
          <button
            key={format}
            onClick={() => handleExport(format as any)}
            disabled={isExporting !== null}
            className={`
              relative p-4 rounded-lg border-2 border-zinc-600 transition-all
              ${isExporting === format 
                ? 'bg-zinc-800 opacity-50' 
                : 'bg-zinc-800 hover:border-zinc-500 hover:bg-zinc-700'}
              ${isExporting !== null && isExporting !== format ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {isExporting === format && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 rounded-lg">
                <div className="w-6 h-6 border-3 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            <Icon className={`w-8 h-8 mb-2 mx-auto ${getIconColor(color)}`} />
            <h4 className="font-semibold text-white">{name}</h4>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          </button>
        ))}
      </div>

      {/* Informacje techniczne */}
      <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
        <h4 className="font-semibold mb-2 text-sm text-white">Parametry eksportu:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>
            <span className="font-medium text-gray-300">Jednostki:</span> milimetry (mm)
          </div>
          <div>
            <span className="font-medium text-gray-300">Skala:</span> 1:1
          </div>
          <div>
            <span className="font-medium text-gray-300">Dokładność:</span> 0.01 mm
          </div>
          <div>
            <span className="font-medium text-gray-300">Współrzędne:</span> Kartezjańskie
          </div>
        </div>
      </div>

      {/* Dodatkowe info o produkcie */}
      <div className="mt-4 text-xs text-gray-400">
        <p className="text-gray-300">Plik zawiera:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Dokładne wymiary: {item.dimensions.width} × {item.dimensions.height} × {item.dimensions.depth} mm</li>
          <li>Grubość materiału: {item.thickness} mm</li>
          {item.options.polerowanie && <li>Oznaczone krawędzie do polerowania</li>}
          {item.product !== 'formatka' && <li>Widoki: przód, bok, góra</li>}
        </ul>
      </div>
    </div>
  );
};