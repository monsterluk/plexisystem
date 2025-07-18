// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import { Download, RotateCw } from 'lucide-react';

interface CuttingVisualizationProps {
  plan: any; // CuttingPlan type
  scale?: number;
}

export const CuttingVisualization: React.FC<CuttingVisualizationProps> = ({ 
  plan, 
  scale = 0.2 
}) => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    plan.sheets.forEach((sheetPlan: any, index: number) => {
      const canvas = canvasRefs.current[index];
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const sheet = sheetPlan.sheet;
      const width = sheet.width * scale;
      const height = sheet.height * scale;

      canvas.width = width;
      canvas.height = height;

      // Tło arkusza (ciemne)
      ctx.fillStyle = '#27272a';
      ctx.fillRect(0, 0, width, height);

      // Rysuj umieszczone elementy
      sheetPlan.placements.forEach((placement: any) => {
        const x = placement.x * scale;
        const y = placement.y * scale;
        const w = (placement.rotated ? placement.rect.height : placement.rect.width) * scale;
        const h = (placement.rotated ? placement.rect.width : placement.rect.height) * scale;

        // Element
        ctx.fillStyle = '#f97316';
        ctx.fillRect(x, y, w, h);

        // Obramowanie
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        // ID elementu
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(placement.rect.id, x + w/2, y + h/2);

        // Ikona obrotu
        if (placement.rotated) {
          ctx.save();
          ctx.translate(x + w - 15, y + 15);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-8, -8, 16, 16);
          ctx.restore();
        }
      });

      // Linie siatki (opcjonalne)
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([5, 5]);

      // Pionowe linie co 100mm
      for (let x = 0; x <= width; x += 100 * scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Poziome linie co 100mm
      for (let y = 0; y <= height; y += 100 * scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    });
  }, [plan, scale]);

  const downloadCanvas = (index: number) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `arkusz-${index + 1}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Wizualizacja rozkroju</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plan.sheets.map((sheetPlan: any, index: number) => (
          <div key={index} className="bg-zinc-700 rounded-lg shadow-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold text-white">Arkusz {index + 1}</h4>
                <p className="text-sm text-gray-400">
                  {sheetPlan.sheet.width} x {sheetPlan.sheet.height} mm
                </p>
                <p className="text-sm font-medium text-green-400">
                  Wykorzystanie: {sheetPlan.utilization.toFixed(1)}%
                </p>
              </div>
              <button
                onClick={() => downloadCanvas(index)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                title="Pobierz jako obraz"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border-2 border-zinc-600 rounded-lg overflow-hidden bg-zinc-800">
              <canvas
                ref={el => canvasRefs.current[index] = el}
                className="w-full"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium text-gray-300">Elementy na arkuszu:</p>
              <div className="flex flex-wrap gap-2">
                {sheetPlan.placements.map((placement: any, pIndex: number) => (
                  <div key={pIndex} className="flex items-center gap-1 text-xs bg-zinc-800 px-2 py-1 rounded">
                    <span className="text-white">{placement.rect.id}</span>
                    <span className="text-gray-400">
                      ({placement.rect.width}x{placement.rect.height})
                    </span>
                    {placement.rotated && <RotateCw className="w-3 h-3 text-orange-500" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-700 rounded-lg p-4">
        <h4 className="font-semibold mb-2 text-white">Podsumowanie optymalizacji</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Wykorzystanych arkuszy</p>
            <p className="text-2xl font-bold text-white">{plan.sheets.length}</p>
          </div>
          <div>
            <p className="text-gray-400">Całkowite wykorzystanie</p>
            <p className="text-2xl font-bold text-green-400">
              {((plan.usedArea / plan.totalArea) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400">Odpad</p>
            <p className="text-2xl font-bold text-red-400">
              {plan.waste.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};