// Konfiguracja AI API dla systemu PlexiSystem
// Możesz wybrać jeden z poniższych dostawców AI

export interface AIProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

// Przykładowe konfiguracje różnych dostawców AI
export const AI_PROVIDERS = {
  // Claude AI (Anthropic)
  claude: {
    name: 'Claude AI',
    apiKey: process.env.VITE_CLAUDE_API_KEY || '',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-3-opus-20240229', // lub claude-3-sonnet-20240229 dla szybszych odpowiedzi
    maxTokens: 4096,
    temperature: 0.7,
    headers: {
      'anthropic-version': '2023-06-01',
      'x-api-key': process.env.VITE_CLAUDE_API_KEY || '',
      'content-type': 'application/json'
    }
  },

  // OpenAI GPT
  openai: {
    name: 'OpenAI GPT',
    apiKey: process.env.VITE_OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4-turbo-preview', // lub gpt-3.5-turbo dla niższych kosztów
    maxTokens: 4096,
    temperature: 0.7,
    headers: {
      'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY || ''}`,
      'Content-Type': 'application/json'
    }
  },

  // Google Gemini
  gemini: {
    name: 'Google Gemini',
    apiKey: process.env.VITE_GEMINI_API_KEY || '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-pro',
    maxTokens: 2048,
    temperature: 0.7,
    headers: {
      'Content-Type': 'application/json'
    }
  },

  // Perplexity AI
  perplexity: {
    name: 'Perplexity AI',
    apiKey: process.env.VITE_PERPLEXITY_API_KEY || '',
    baseUrl: 'https://api.perplexity.ai',
    model: 'pplx-70b-online', // Model z dostępem do internetu
    maxTokens: 4096,
    temperature: 0.7,
    headers: {
      'Authorization': `Bearer ${process.env.VITE_PERPLEXITY_API_KEY || ''}`,
      'Content-Type': 'application/json'
    }
  }
};

// Aktualnie wybrany dostawca (zmień na preferowany)
export const ACTIVE_AI_PROVIDER = AI_PROVIDERS.claude;

// Funkcje pomocnicze dla różnych zadań AI
export const AI_PROMPTS = {
  // Analiza cen
  priceAnalysis: (productData: any) => `
    Przeanalizuj dane produktu i zasugeruj optymalną cenę:
    Produkt: ${productData.name}
    Obecna cena: ${productData.currentPrice} zł
    Kategoria: ${productData.category}
    Ostatnie sprzedaże: ${productData.salesHistory}
    
    Uwzględnij:
    - Konkurencyjność cenową
    - Marżę zysku
    - Historię sprzedaży
    - Sezonowość
    
    Odpowiedz w formacie JSON z polami:
    - suggestedPrice: number
    - reason: string
    - confidence: number (0-100)
    - expectedImpact: { volumeChange: number, revenueChange: number }
  `,

  // Przewidywanie konwersji
  conversionPrediction: (offerData: any) => `
    Oceń prawdopodobieństwo konwersji oferty:
    Numer oferty: ${offerData.number}
    Klient: ${offerData.clientName}
    Wartość: ${offerData.value} zł
    Historia klienta: ${offerData.clientHistory}
    
    Odpowiedz w formacie JSON:
    - probability: number (0-100)
    - factors: Array<{factor: string, impact: 'positive'|'negative', weight: number}>
    - suggestedActions: string[]
  `,

  // Generator opisów produktów
  productDescription: (product: any, tone: string) => `
    Wygeneruj profesjonalny opis produktu:
    Nazwa: ${product.name}
    Materiał: ${product.material}
    Wymiary: ${product.dimensions}
    Zastosowanie: ${product.applications}
    Ton: ${tone}
    
    Opis powinien:
    - Być angażujący i przekonujący
    - Zawierać kluczowe cechy produktu
    - Wskazywać korzyści dla klienta
    - Mieć 100-150 słów
    
    Odpowiedz w formacie JSON:
    - description: string
    - keywords: string[]
    - sellingPoints: string[]
  `,

  // Optymalizacja nestingu
  nestingOptimization: (parts: any[], sheetSize: any) => `
    Zoptymalizuj rozmieszczenie części na arkuszu:
    Arkusz: ${sheetSize.width}x${sheetSize.height}mm
    Części: ${JSON.stringify(parts)}
    
    Zasugeruj:
    - Optymalny układ minimalizujący odpady
    - Kolejność cięcia
    - Potencjalne oszczędności
    
    Odpowiedz w formacie JSON:
    - efficiency: number
    - wasteReduction: number
    - suggestions: string[]
  `
};

// Klasa do komunikacji z AI
export class AIServiceAPI {
  private provider: typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

  constructor(provider = ACTIVE_AI_PROVIDER) {
    this.provider = provider;
  }

  async sendRequest(prompt: string): Promise<any> {
    try {
      let endpoint = '';
      let body: any = {};

      switch (this.provider.name) {
        case 'Claude AI':
          endpoint = `${this.provider.baseUrl}/messages`;
          body = {
            model: this.provider.model,
            max_tokens: this.provider.maxTokens,
            temperature: this.provider.temperature,
            messages: [{ role: 'user', content: prompt }]
          };
          break;

        case 'OpenAI GPT':
          endpoint = `${this.provider.baseUrl}/chat/completions`;
          body = {
            model: this.provider.model,
            max_tokens: this.provider.maxTokens,
            temperature: this.provider.temperature,
            messages: [{ role: 'user', content: prompt }]
          };
          break;

        case 'Google Gemini':
          endpoint = `${this.provider.baseUrl}/models/${this.provider.model}:generateContent?key=${this.provider.apiKey}`;
          body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: this.provider.temperature,
              maxOutputTokens: this.provider.maxTokens
            }
          };
          break;

        case 'Perplexity AI':
          endpoint = `${this.provider.baseUrl}/chat/completions`;
          body = {
            model: this.provider.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.provider.maxTokens,
            temperature: this.provider.temperature
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.provider.headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`AI API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Parsuj odpowiedź w zależności od dostawcy
      switch (this.provider.name) {
        case 'Claude AI':
          return data.content[0].text;
        case 'OpenAI GPT':
          return data.choices[0].message.content;
        case 'Google Gemini':
          return data.candidates[0].content.parts[0].text;
        case 'Perplexity AI':
          return data.choices[0].message.content;
        default:
          return data;
      }
    } catch (error) {
      console.error('AI Request Error:', error);
      throw error;
    }
  }

  // Metody pomocnicze dla konkretnych zadań
  async analyzePricing(productData: any): Promise<any> {
    const prompt = AI_PROMPTS.priceAnalysis(productData);
    const response = await this.sendRequest(prompt);
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return null;
    }
  }

  async predictConversion(offerData: any): Promise<any> {
    const prompt = AI_PROMPTS.conversionPrediction(offerData);
    const response = await this.sendRequest(prompt);
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return null;
    }
  }

  async generateProductDescription(product: any, tone: string = 'professional'): Promise<any> {
    const prompt = AI_PROMPTS.productDescription(product, tone);
    const response = await this.sendRequest(prompt);
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return null;
    }
  }

  async optimizeNesting(parts: any[], sheetSize: any): Promise<any> {
    const prompt = AI_PROMPTS.nestingOptimization(parts, sheetSize);
    const response = await this.sendRequest(prompt);
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return null;
    }
  }
}

// Eksportuj instancję serwisu
export const aiServiceAPI = new AIServiceAPI();
