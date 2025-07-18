// Algorytm optymalizacji cięcia arkuszy 2D (Bin Packing)
// Wykorzystuje algorytm First Fit Decreasing Height (FFDH) z rotacją

export interface SheetSize {
  width: number;
  height: number;
  material: string;
  thickness: number;
  pricePerSheet: number;
}

export interface CutPiece {
  id: string;
  width: number;
  height: number;
  quantity: number;
  canRotate?: boolean;
  label?: string;
}

export interface PlacedPiece {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
  originalPiece: CutPiece;
}

export interface CuttingLayout {
  sheetIndex: number;
  sheet: SheetSize;
  placedPieces: PlacedPiece[];
  utilization: number;
  waste: number;
  wastePercentage: number;
}

export interface OptimizationResult {
  layouts: CuttingLayout[];
  totalSheets: number;
  totalArea: number;
  usedArea: number;
  wasteArea: number;
  wastePercentage: number;
  totalCost: number;
  cuttingDistance: number;
  estimatedTime: number;
}

// Parametry cięcia
const BLADE_WIDTH = 3; // szerokość cięcia w mm
const MARGIN = 5; // margines od krawędzi arkusza w mm
const MIN_PIECE_SIZE = 50; // minimalna wielkość kawałka do zachowania

export class SheetOptimizer {
  private sheets: SheetSize[];
  private pieces: CutPiece[];
  private bladeWidth: number;
  private margin: number;

  constructor(
    sheets: SheetSize[], 
    pieces: CutPiece[], 
    bladeWidth: number = BLADE_WIDTH,
    margin: number = MARGIN
  ) {
    this.sheets = sheets;
    this.pieces = pieces;
    this.bladeWidth = bladeWidth;
    this.margin = margin;
  }

  optimize(): OptimizationResult {
    // Rozwiń kawałki według ilości
    const expandedPieces = this.expandPieces();
    
    // Sortuj kawałki malejąco według powierzchni
    const sortedPieces = this.sortPiecesByArea(expandedPieces);
    
    // Wykonaj optymalizację dla każdego typu arkusza
    const allLayouts: CuttingLayout[] = [];
    
    for (const sheet of this.sheets) {
      const layouts = this.optimizeForSheet(sheet, sortedPieces);
      allLayouts.push(...layouts);
    }
    
    // Wybierz najlepszą kombinację
    const bestLayouts = this.selectBestLayouts(allLayouts, sortedPieces);
    
    return this.calculateResults(bestLayouts);
  }

  private expandPieces(): CutPiece[] {
    const expanded: CutPiece[] = [];
    
    this.pieces.forEach(piece => {
      for (let i = 0; i < piece.quantity; i++) {
        expanded.push({
          ...piece,
          id: `${piece.id}_${i}`,
          quantity: 1
        });
      }
    });
    
    return expanded;
  }

  private sortPiecesByArea(pieces: CutPiece[]): CutPiece[] {
    return pieces.sort((a, b) => {
      const areaA = a.width * a.height;
      const areaB = b.width * b.height;
      return areaB - areaA;
    });
  }

  private optimizeForSheet(sheet: SheetSize, pieces: CutPiece[]): CuttingLayout[] {
    const layouts: CuttingLayout[] = [];
    let remainingPieces = [...pieces];
    let sheetIndex = 0;
    
    while (remainingPieces.length > 0) {
      const layout = this.createLayout(sheet, remainingPieces, sheetIndex);
      
      if (layout.placedPieces.length === 0) {
        // Nie można umieścić żadnego kawałka
        break;
      }
      
      layouts.push(layout);
      
      // Usuń umieszczone kawałki
      const placedIds = new Set(layout.placedPieces.map(p => p.id));
      remainingPieces = remainingPieces.filter(p => !placedIds.has(p.id));
      
      sheetIndex++;
    }
    
    return layouts;
  }

  private createLayout(sheet: SheetSize, pieces: CutPiece[], sheetIndex: number): CuttingLayout {
    const placedPieces: PlacedPiece[] = [];
    const availableWidth = sheet.width - 2 * this.margin;
    const availableHeight = sheet.height - 2 * this.margin;
    
    // Mapa wolnych przestrzeni (skyline algorithm)
    let skyline: { x: number; y: number; width: number }[] = [
      { x: this.margin, y: this.margin, width: availableWidth }
    ];
    
    for (const piece of pieces) {
      const placement = this.findBestPlacement(piece, skyline, availableWidth, availableHeight);
      
      if (placement) {
        placedPieces.push(placement);
        skyline = this.updateSkyline(skyline, placement);
      }
    }
    
    // Oblicz wykorzystanie
    const sheetArea = sheet.width * sheet.height;
    const usedArea = placedPieces.reduce((sum, p) => sum + p.width * p.height, 0);
    const utilization = (usedArea / sheetArea) * 100;
    const waste = sheetArea - usedArea;
    const wastePercentage = (waste / sheetArea) * 100;
    
    return {
      sheetIndex,
      sheet,
      placedPieces,
      utilization,
      waste,
      wastePercentage
    };
  }

  private findBestPlacement(
    piece: CutPiece, 
    skyline: { x: number; y: number; width: number }[],
    maxWidth: number,
    maxHeight: number
  ): PlacedPiece | null {
    let bestPlacement: PlacedPiece | null = null;
    let bestWaste = Infinity;
    
    // Sprawdź oba kierunki (normalny i obrócony)
    const orientations = piece.canRotate !== false 
      ? [[piece.width, piece.height], [piece.height, piece.width]]
      : [[piece.width, piece.height]];
    
    for (const [width, height] of orientations) {
      const adjustedWidth = width + this.bladeWidth;
      const adjustedHeight = height + this.bladeWidth;
      
      for (const segment of skyline) {
        if (segment.width >= adjustedWidth && 
            segment.y + adjustedHeight <= maxHeight + this.margin) {
          
          // Oblicz zmarnowaną przestrzeń
          const waste = (segment.width - adjustedWidth) * adjustedHeight;
          
          if (waste < bestWaste) {
            bestWaste = waste;
            bestPlacement = {
              id: piece.id,
              x: segment.x,
              y: segment.y,
              width: adjustedWidth,
              height: adjustedHeight,
              rotated: width !== piece.width,
              originalPiece: piece
            };
          }
        }
      }
    }
    
    return bestPlacement;
  }

  private updateSkyline(
    skyline: { x: number; y: number; width: number }[],
    placement: PlacedPiece
  ): { x: number; y: number; width: number }[] {
    const newSkyline: { x: number; y: number; width: number }[] = [];
    
    for (const segment of skyline) {
      // Segment przed umieszczonym kawałkiem
      if (segment.x + segment.width <= placement.x) {
        newSkyline.push(segment);
      }
      // Segment po umieszczonym kawałku
      else if (segment.x >= placement.x + placement.width) {
        newSkyline.push(segment);
      }
      // Segment przecięty przez kawałek
      else {
        // Część przed
        if (segment.x < placement.x) {
          newSkyline.push({
            x: segment.x,
            y: segment.y,
            width: placement.x - segment.x
          });
        }
        
        // Część nad kawałkiem
        newSkyline.push({
          x: Math.max(segment.x, placement.x),
          y: placement.y + placement.height,
          width: Math.min(segment.x + segment.width, placement.x + placement.width) - Math.max(segment.x, placement.x)
        });
        
        // Część po
        if (segment.x + segment.width > placement.x + placement.width) {
          newSkyline.push({
            x: placement.x + placement.width,
            y: segment.y,
            width: segment.x + segment.width - placement.x - placement.width
          });
        }
      }
    }
    
    // Scal sąsiednie segmenty na tej samej wysokości
    return this.mergeSkylineSegments(newSkyline);
  }

  private mergeSkylineSegments(
    skyline: { x: number; y: number; width: number }[]
  ): { x: number; y: number; width: number }[] {
    if (skyline.length <= 1) return skyline;
    
    const merged: { x: number; y: number; width: number }[] = [];
    skyline.sort((a, b) => a.x - b.x);
    
    let current = skyline[0];
    
    for (let i = 1; i < skyline.length; i++) {
      const next = skyline[i];
      
      if (current.y === next.y && current.x + current.width === next.x) {
        // Scal segmenty
        current.width += next.width;
      } else {
        merged.push(current);
        current = next;
      }
    }
    
    merged.push(current);
    return merged;
  }

  private selectBestLayouts(
    allLayouts: CuttingLayout[], 
    pieces: CutPiece[]
  ): CuttingLayout[] {
    // Prosty algorytm wyboru - minimalizuj liczbę arkuszy
    const pieceIds = new Set(pieces.map(p => p.id));
    const selectedLayouts: CuttingLayout[] = [];
    const placedIds = new Set<string>();
    
    // Sortuj layouty według wykorzystania (malejąco)
    allLayouts.sort((a, b) => b.utilization - a.utilization);
    
    for (const layout of allLayouts) {
      const newPieces = layout.placedPieces.filter(p => !placedIds.has(p.id));
      
      if (newPieces.length > 0) {
        selectedLayouts.push({
          ...layout,
          placedPieces: layout.placedPieces.filter(p => !placedIds.has(p.id))
        });
        
        newPieces.forEach(p => placedIds.add(p.id));
        
        if (placedIds.size === pieceIds.size) {
          break;
        }
      }
    }
    
    return selectedLayouts;
  }

  private calculateResults(layouts: CuttingLayout[]): OptimizationResult {
    let totalArea = 0;
    let usedArea = 0;
    let totalCost = 0;
    let cuttingDistance = 0;
    
    layouts.forEach(layout => {
      const sheetArea = layout.sheet.width * layout.sheet.height;
      totalArea += sheetArea;
      
      layout.placedPieces.forEach(piece => {
        usedArea += (piece.width - this.bladeWidth) * (piece.height - this.bladeWidth);
        // Oblicz dystans cięcia
        cuttingDistance += 2 * (piece.width + piece.height);
      });
      
      totalCost += layout.sheet.pricePerSheet;
    });
    
    const wasteArea = totalArea - usedArea;
    const wastePercentage = (wasteArea / totalArea) * 100;
    
    // Szacowany czas cięcia (zakładając prędkość 10m/min)
    const estimatedTime = (cuttingDistance / 1000) / 10; // w minutach
    
    return {
      layouts,
      totalSheets: layouts.length,
      totalArea,
      usedArea,
      wasteArea,
      wastePercentage,
      totalCost,
      cuttingDistance,
      estimatedTime
    };
  }
}

// Funkcja pomocnicza do generowania wizualizacji SVG
export function generateCuttingVisualization(
  layout: CuttingLayout, 
  scale: number = 0.1
): string {
  const width = layout.sheet.width * scale;
  const height = layout.sheet.height * scale;
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Tło arkusza
  svg += `<rect width="${width}" height="${height}" fill="#f0f0f0" stroke="#333" stroke-width="2"/>`;
  
  // Umieszczone kawałki
  layout.placedPieces.forEach((piece, index) => {
    const x = piece.x * scale;
    const y = piece.y * scale;
    const w = (piece.width - BLADE_WIDTH) * scale;
    const h = (piece.height - BLADE_WIDTH) * scale;
    
    // Różne kolory dla różnych kawałków
    const hue = (index * 137.5) % 360;
    const color = `hsl(${hue}, 70%, 60%)`;
    
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" stroke="#000" stroke-width="1" opacity="0.8"/>`;
    
    // Etykieta
    if (piece.originalPiece.label) {
      const fontSize = Math.min(w, h) * 0.3;
      svg += `<text x="${x + w/2}" y="${y + h/2}" text-anchor="middle" dominant-baseline="middle" font-size="${fontSize}" fill="#000">${piece.originalPiece.label}</text>`;
    }
  });
  
  svg += '</svg>';
  return svg;
}