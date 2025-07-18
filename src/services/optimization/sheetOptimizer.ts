// @ts-nocheck
interface Rectangle {
  width: number;
  height: number;
  id: string;
  rotatable?: boolean;
}

interface Sheet {
  width: number;
  height: number;
  id: string;
}

interface Placement {
  rect: Rectangle;
  x: number;
  y: number;
  rotated: boolean;
  sheetId: string;
}

interface CuttingPlan {
  sheets: Array<{
    sheet: Sheet;
    placements: Placement[];
    utilization: number;
  }>;
  waste: number;
  totalArea: number;
  usedArea: number;
}

export class SheetOptimizer {
  private readonly kerf: number = 3; // Szerokość cięcia w mm
  private readonly margin: number = 5; // Margines od krawędzi

  optimize(rectangles: Rectangle[], sheets: Sheet[]): CuttingPlan {
    // Sortuj prostokąty malejąco według powierzchni
    const sortedRects = [...rectangles].sort((a, b) => 
      (b.width * b.height) - (a.width * a.height)
    );

    const plan: CuttingPlan = {
      sheets: [],
      waste: 0,
      totalArea: 0,
      usedArea: 0
    };

    const remainingRects = [...sortedRects];

    for (const sheet of sheets) {
      if (remainingRects.length === 0) break;

      const sheetResult = this.packSheet(sheet, remainingRects);
      
      if (sheetResult.placements.length > 0) {
        const sheetArea = sheet.width * sheet.height;
        const usedArea = sheetResult.placements.reduce((sum, p) => 
          sum + (p.rect.width * p.rect.height), 0
        );
        
        plan.sheets.push({
          sheet,
          placements: sheetResult.placements,
          utilization: (usedArea / sheetArea) * 100
        });

        plan.totalArea += sheetArea;
        plan.usedArea += usedArea;

        // Usuń umieszczone prostokąty z listy
        sheetResult.placements.forEach(p => {
          const index = remainingRects.findIndex(r => r.id === p.rect.id);
          if (index >= 0) remainingRects.splice(index, 1);
        });
      }
    }

    plan.waste = ((plan.totalArea - plan.usedArea) / plan.totalArea) * 100;

    return plan;
  }

  private packSheet(sheet: Sheet, rectangles: Rectangle[]): { placements: Placement[] } {
    const placements: Placement[] = [];
    const freeSpaces: Array<{ x: number; y: number; width: number; height: number }> = [{
      x: this.margin,
      y: this.margin,
      width: sheet.width - 2 * this.margin,
      height: sheet.height - 2 * this.margin
    }];

    for (const rect of rectangles) {
      let placed = false;

      // Próbuj umieścić prostokąt w każdej wolnej przestrzeni
      for (let i = 0; i < freeSpaces.length && !placed; i++) {
        const space = freeSpaces[i];

        // Sprawdź orientację normalną
        if (this.fits(rect, space, false)) {
          placements.push({
            rect,
            x: space.x,
            y: space.y,
            rotated: false,
            sheetId: sheet.id
          });
          placed = true;
          this.splitSpace(space, rect, freeSpaces, i, false);
        }
        // Sprawdź orientację obróconą (jeśli dozwolone)
        else if (rect.rotatable !== false && this.fits(rect, space, true)) {
          placements.push({
            rect,
            x: space.x,
            y: space.y,
            rotated: true,
            sheetId: sheet.id
          });
          placed = true;
          this.splitSpace(space, rect, freeSpaces, i, true);
        }
      }

      if (!placed) break; // Nie udało się umieścić - przejdź do następnego arkusza
    }

    return { placements };
  }

  private fits(rect: Rectangle, space: { width: number; height: number }, rotated: boolean): boolean {
    const rectWidth = rotated ? rect.height : rect.width;
    const rectHeight = rotated ? rect.width : rect.height;
    
    return (rectWidth + this.kerf) <= space.width && 
           (rectHeight + this.kerf) <= space.height;
  }

  private splitSpace(
    space: { x: number; y: number; width: number; height: number },
    rect: Rectangle,
    freeSpaces: Array<{ x: number; y: number; width: number; height: number }>,
    spaceIndex: number,
    rotated: boolean
  ): void {
    const rectWidth = (rotated ? rect.height : rect.width) + this.kerf;
    const rectHeight = (rotated ? rect.width : rect.height) + this.kerf;

    // Usuń wykorzystaną przestrzeń
    freeSpaces.splice(spaceIndex, 1);

    // Dodaj nowe wolne przestrzenie (strategia guillotine)
    // Przestrzeń po prawej
    if (space.width - rectWidth > this.kerf) {
      freeSpaces.push({
        x: space.x + rectWidth,
        y: space.y,
        width: space.width - rectWidth,
        height: rectHeight
      });
    }

    // Przestrzeń poniżej
    if (space.height - rectHeight > this.kerf) {
      freeSpaces.push({
        x: space.x,
        y: space.y + rectHeight,
        width: space.width,
        height: space.height - rectHeight
      });
    }

    // Sortuj przestrzenie według pozycji (najpierw górne, potem lewe)
    freeSpaces.sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });
  }

  // Generuj instrukcje cięcia
  generateCuttingInstructions(plan: CuttingPlan): string[] {
    const instructions: string[] = [];

    plan.sheets.forEach((sheetPlan, sheetIndex) => {
      instructions.push(`\nArkusz ${sheetIndex + 1} (${sheetPlan.sheet.width}x${sheetPlan.sheet.height}mm):`);
      instructions.push(`Wykorzystanie: ${sheetPlan.utilization.toFixed(1)}%`);
      
      // Grupuj cięcia poziome i pionowe
      const horizontalCuts = new Set<number>();
      const verticalCuts = new Set<number>();

      sheetPlan.placements.forEach(placement => {
        const width = placement.rotated ? placement.rect.height : placement.rect.width;
        const height = placement.rotated ? placement.rect.width : placement.rect.height;
        
        horizontalCuts.add(placement.y);
        horizontalCuts.add(placement.y + height);
        verticalCuts.add(placement.x);
        verticalCuts.add(placement.x + width);
      });

      instructions.push('\nCięcia poziome (od góry):');
      Array.from(horizontalCuts).sort((a, b) => a - b).forEach(y => {
        instructions.push(`  ${y}mm`);
      });

      instructions.push('\nCięcia pionowe (od lewej):');
      Array.from(verticalCuts).sort((a, b) => a - b).forEach(x => {
        instructions.push(`  ${x}mm`);
      });
    });

    instructions.push(`\nPodsumowanie:`);
    instructions.push(`Wykorzystanych arkuszy: ${plan.sheets.length}`);
    instructions.push(`Całkowite wykorzystanie: ${((plan.usedArea / plan.totalArea) * 100).toFixed(1)}%`);
    instructions.push(`Odpad: ${plan.waste.toFixed(1)}%`);

    return instructions;
  }
}

export const sheetOptimizer = new SheetOptimizer();