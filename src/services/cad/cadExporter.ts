// @ts-nocheck
import { CalculatorItem } from '@/types/Offer';

export class CADExporter {
  // Eksport do formatu DXF (2D)
  exportToDXF(item: CalculatorItem): string {
    const { width, height, depth } = item.dimensions;
    
    // Nagłówek DXF
    let dxf = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1014
9
$INSBASE
10
0.0
20
0.0
30
0.0
9
$EXTMIN
10
0.0
20
0.0
30
0.0
9
$EXTMAX
10
${width}
20
${height}
30
${depth}
0
ENDSEC
0
SECTION
2
ENTITIES
`;

    // Dodaj prostokąt główny
    dxf += this.createRectangle(0, 0, width, height);

    // Jeśli to pojemnik lub ekspozytor, dodaj widoki boczne
    if (item.product !== 'formatka' && depth > 0) {
      // Widok z boku
      dxf += this.createRectangle(width + 50, 0, depth, height);
      
      // Widok z góry
      dxf += this.createRectangle(0, height + 50, width, depth);
    }

    // Zakończenie pliku
    dxf += `0
ENDSEC
0
EOF`;

    return dxf;
  }

  private createRectangle(x: number, y: number, width: number, height: number): string {
    return `0
POLYLINE
8
0
66
1
10
0.0
20
0.0
30
0.0
0
VERTEX
8
0
10
${x}
20
${y}
30
0.0
0
VERTEX
8
0
10
${x + width}
20
${y}
30
0.0
0
VERTEX
8
0
10
${x + width}
20
${y + height}
30
0.0
0
VERTEX
8
0
10
${x}
20
${y + height}
30
0.0
0
VERTEX
8
0
10
${x}
20
${y}
30
0.0
0
SEQEND
`;
  }

  // Eksport do formatu STEP (3D)
  exportToSTEP(item: CalculatorItem): string {
    const { width, height, depth } = item.dimensions;
    const thickness = item.thickness;
    
    const timestamp = new Date().toISOString();
    
    // Uproszczony format STEP
    return `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('PlexiSystem CAD Export'),'2;1');
FILE_NAME('${item.productName}.step','${timestamp}',('PlexiSystem'),('PlexiSystem S.C.'),'','','');
FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));
ENDSEC;
DATA;
#1 = CARTESIAN_POINT('', (0., 0., 0.));
#2 = CARTESIAN_POINT('', (${width}, 0., 0.));
#3 = CARTESIAN_POINT('', (${width}, ${height}, 0.));
#4 = CARTESIAN_POINT('', (0., ${height}, 0.));
#5 = CARTESIAN_POINT('', (0., 0., ${thickness}));
#6 = CARTESIAN_POINT('', (${width}, 0., ${thickness}));
#7 = CARTESIAN_POINT('', (${width}, ${height}, ${thickness}));
#8 = CARTESIAN_POINT('', (0., ${height}, ${thickness}));
ENDSEC;
END-ISO-10303-21;`;
  }

  // Eksport do formatu STL (3D do druku)
  exportToSTL(item: CalculatorItem): ArrayBuffer {
    const { width, height, depth } = item.dimensions;
    const t = item.thickness;
    
    // Tworzenie binarnego STL
    const triangles: number[][] = [];
    
    // Przód
    triangles.push(
      [0, 0, 1, 0, 0, 0, width, 0, 0, width, height, 0],
      [0, 0, 1, width, height, 0, 0, height, 0, 0, 0, 0]
    );
    
    // Tył
    triangles.push(
      [0, 0, -1, width, 0, t, 0, 0, t, 0, height, t],
      [0, 0, -1, 0, height, t, width, height, t, width, 0, t]
    );
    
    // Boki (jeśli ma głębokość)
    if (depth > 0) {
      // Lewy bok
      triangles.push(
        [-1, 0, 0, 0, 0, 0, 0, height, 0, 0, height, t],
        [-1, 0, 0, 0, height, t, 0, 0, t, 0, 0, 0]
      );
      
      // Prawy bok
      triangles.push(
        [1, 0, 0, width, height, 0, width, 0, 0, width, 0, t],
        [1, 0, 0, width, 0, t, width, height, t, width, height, 0]
      );
    }
    
    // Konwersja do formatu binarnego STL
    const numTriangles = triangles.length;
    const buffer = new ArrayBuffer(84 + numTriangles * 50);
    const view = new DataView(buffer);
    
    // Nagłówek (80 bajtów)
    const header = 'PlexiSystem STL Export';
    for (let i = 0; i < header.length; i++) {
      view.setUint8(i, header.charCodeAt(i));
    }
    
    // Liczba trójkątów
    view.setUint32(80, numTriangles, true);
    
    // Dane trójkątów
    let offset = 84;
    triangles.forEach(triangle => {
      // Normal vector
      view.setFloat32(offset, triangle[0], true);
      view.setFloat32(offset + 4, triangle[1], true);
      view.setFloat32(offset + 8, triangle[2], true);
      
      // Vertices
      for (let i = 0; i < 3; i++) {
        view.setFloat32(offset + 12 + i * 12, triangle[3 + i * 3], true);
        view.setFloat32(offset + 16 + i * 12, triangle[4 + i * 3], true);
        view.setFloat32(offset + 20 + i * 12, triangle[5 + i * 3], true);
      }
      
      // Attribute byte count
      view.setUint16(offset + 48, 0, true);
      offset += 50;
    });
    
    return buffer;
  }

  // Eksport do formatu SVG (2D do cięcia)
  exportToSVG(item: CalculatorItem): string {
    const { width, height, depth } = item.dimensions;
    const scale = 0.1; // 1mm = 0.1px
    
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${(width + (depth > 0 ? depth + 100 : 0)) * scale}" 
     height="${(height + (depth > 0 ? depth + 100 : 0)) * scale}" 
     viewBox="0 0 ${(width + (depth > 0 ? depth + 100 : 0)) * scale} ${(height + (depth > 0 ? depth + 100 : 0)) * scale}"
     xmlns="http://www.w3.org/2000/svg">
  <g stroke="black" stroke-width="0.1" fill="none">
`;

    // Widok główny
    svg += `    <rect x="0" y="0" width="${width * scale}" height="${height * scale}" />
`;

    // Jeśli ma głębokość, dodaj dodatkowe widoki
    if (depth > 0 && item.product !== 'formatka') {
      // Widok boczny
      svg += `    <rect x="${(width + 50) * scale}" y="0" width="${depth * scale}" height="${height * scale}" />
`;
      
      // Widok z góry
      svg += `    <rect x="0" y="${(height + 50) * scale}" width="${width * scale}" height="${depth * scale}" />
`;
    }

    // Linie cięcia dla opcji
    if (item.options.polerowanie) {
      svg += `    <!-- Krawędzie do polerowania -->
    <g stroke="red" stroke-dasharray="5,5">
      <line x1="0" y1="0" x2="${width * scale}" y2="0" />
      <line x1="${width * scale}" y1="0" x2="${width * scale}" y2="${height * scale}" />
      <line x1="${width * scale}" y1="${height * scale}" x2="0" y2="${height * scale}" />
      <line x1="0" y1="${height * scale}" x2="0" y2="0" />
    </g>
`;
    }

    svg += `  </g>
</svg>`;

    return svg;
  }

  // Główna funkcja eksportu
  async exportToFormat(item: CalculatorItem, format: 'dxf' | 'step' | 'stl' | 'svg'): Promise<Blob> {
    switch (format) {
      case 'dxf':
        const dxfContent = this.exportToDXF(item);
        return new Blob([dxfContent], { type: 'application/dxf' });
        
      case 'step':
        const stepContent = this.exportToSTEP(item);
        return new Blob([stepContent], { type: 'application/step' });
        
      case 'stl':
        const stlBuffer = this.exportToSTL(item);
        return new Blob([stlBuffer], { type: 'application/sla' });
        
      case 'svg':
        const svgContent = this.exportToSVG(item);
        return new Blob([svgContent], { type: 'image/svg+xml' });
        
      default:
        throw new Error(`Nieobsługiwany format: ${format}`);
    }
  }
}

export const cadExporter = new CADExporter();