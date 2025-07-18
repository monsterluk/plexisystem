// @ts-nocheck
import { CalculatorItem } from '@/types/Offer';

export class ProductDescriptionGenerator {
  private apiKey: string;
  
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async generateDescription(item: CalculatorItem): Promise<string> {
    try {
      const productInfo = this.formatProductInfo(item);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `Jesteś ekspertem ds. marketingu produktów z pleksi. Twórz profesjonalne, zwięzłe opisy produktów w języku polskim.
              
              Zasady:
              - Maksymalnie 3-4 zdania
              - Podkreśl najważniejsze cechy i zastosowanie
              - Użyj profesjonalnego języka branżowego
              - Wspomnij o materiałach i wykończeniu
              - Zakończ informacją o możliwych zastosowaniach`
            },
            {
              role: 'user',
              content: `Wygeneruj krótki opis produktu na podstawie danych:
              ${productInfo}`
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Błąd API OpenAI');
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Błąd generowania opisu:', error);
      return this.generateFallbackDescription(item);
    }
  }

  private formatProductInfo(item: CalculatorItem): string {
    const options = Object.entries(item.options)
      .filter(([_, selected]) => selected)
      .map(([option]) => this.translateOption(option))
      .join(', ');

    return `
Produkt: ${item.productName}
Typ: ${item.expositorType ? this.translateExpositorType(item.expositorType) : ''}
Materiał: ${item.materialName}
Grubość: ${item.thickness}mm
Wymiary: ${item.dimensions.width}x${item.dimensions.height}${item.dimensions.depth ? `x${item.dimensions.depth}` : ''}mm
Opcje dodatkowe: ${options || 'brak'}
Ilość: ${item.quantity} szt.
    `.trim();
  }

  private translateOption(option: string): string {
    const translations: Record<string, string> = {
      'grafika': 'nadruk grafiki',
      'grafika_dwustronna': 'nadruk dwustronny',
      'polerowanie': 'polerowane krawędzie',
      'wieko': 'wieko',
      'zawiasy': 'zawiasy',
      'zamek': 'zamek',
      'karton': 'opakowanie kartonowe',
      'klejenie_uv': 'klejenie UV',
      'nozki': 'nóżki',
      'dno_inny_material': 'dno z innego materiału',
      'topper': 'topper reklamowy',
      'led_standard': 'oświetlenie LED',
      'led_cob': 'oświetlenie LED COB',
      'led_rgb': 'oświetlenie LED RGB',
      'zasilacz_led': 'zasilacz LED',
      'tasma': 'taśma montażowa',
      'wodoodpornosc': 'wodoodporność',
      'projekt_led': 'projekt oświetlenia LED',
      'litery_podklejane': 'litery podklejane',
      'litery_zlicowane': 'litery zlicowane',
      'litery_wystajace': 'litery wystające',
      'litery_halo': 'litery z efektem halo'
    };
    return translations[option] || option;
  }

  private translateExpositorType(type: string): string {
    const translations: Record<string, string> = {
      'podstawkowy': 'ekspozytor podstawkowy',
      'schodkowy': 'ekspozytor schodkowy',
      'z_haczykami': 'ekspozytor z haczykami',
      'wiszacy': 'ekspozytor wiszący',
      'stojak': 'stojak ekspozycyjny',
      'kosmetyczny': 'ekspozytor kosmetyczny'
    };
    return translations[type] || type;
  }

  private generateFallbackDescription(item: CalculatorItem): string {
    const options = Object.entries(item.options)
      .filter(([_, selected]) => selected)
      .map(([option]) => this.translateOption(option))
      .join(', ');

    let description = `${item.productName} wykonany z ${item.materialName} o grubości ${item.thickness}mm. `;
    description += `Wymiary: ${item.dimensions.width}x${item.dimensions.height}${item.dimensions.depth ? `x${item.dimensions.depth}` : ''}mm. `;
    
    if (options) {
      description += `Wyposażony w: ${options}. `;
    }

    if (item.expositorType) {
      description += `${this.translateExpositorType(item.expositorType)} idealny do prezentacji produktów. `;
    }

    description += `Wysokiej jakości wykonanie zapewnia trwałość i estetyczny wygląd.`;

    return description;
  }

  async generateMultipleDescriptions(items: CalculatorItem[]): Promise<Map<number, string>> {
    const descriptions = new Map<number, string>();
    
    for (const item of items) {
      const description = await this.generateDescription(item);
      descriptions.set(item.id, description);
    }
    
    return descriptions;
  }
}

export const productDescriptionGenerator = new ProductDescriptionGenerator();