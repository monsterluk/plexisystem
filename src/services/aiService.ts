// AI Service - bardziej zaawansowane funkcje AI dla systemu ofertowego

import { supabase } from '@/lib/supabaseClient';

interface OfferData {
  id: string;
  number: string;
  client_id: string;
  total_net: number;
  discount: number;
  status: string;
  created_at: string;
  valid_until: string;
  items: any[];
}

interface ClientData {
  id: string;
  name: string;
  total_orders: number;
  total_value: number;
  average_order_value: number;
  last_order_date: string;
  payment_history: 'excellent' | 'good' | 'average' | 'poor';
}

export class AIService {
  // Analiza prawdopodobieństwa konwersji na podstawie rzeczywistych danych
  static async predictOfferConversion(offerId: string): Promise<{
    probability: number;
    factors: Array<{ factor: string; impact: 'positive' | 'negative'; weight: number }>;
    suggestions: string[];
  }> {
    try {
      // Pobierz dane oferty
      const { data: offer, error: offerError } = await supabase
        .from('quotations')
        .select(`
          *,
          clients (
            id,
            name,
            nip,
            created_at
          )
        `)
        .eq('id', offerId)
        .single();

      if (offerError) throw offerError;

      // Pobierz historię klienta
      const { data: clientHistory } = await supabase
        .from('quotations')
        .select('id, status, total_net, created_at')
        .eq('client_id', offer.client_id)
        .neq('id', offerId)
        .order('created_at', { ascending: false });

      // Analiza czynników
      const factors = [];
      let baseProb = 50;

      // 1. Historia klienta
      if (clientHistory && clientHistory.length > 0) {
        const acceptedOffers = clientHistory.filter(o => o.status === 'accepted').length;
        const conversionRate = acceptedOffers / clientHistory.length;
        
        if (conversionRate > 0.7) {
          factors.push({ factor: `Stały klient (${acceptedOffers}/${clientHistory.length} zaakceptowanych)`, impact: 'positive' as const, weight: 25 });
          baseProb += 25;
        } else if (conversionRate > 0.4) {
          factors.push({ factor: 'Dobra historia współpracy', impact: 'positive' as const, weight: 15 });
          baseProb += 15;
        } else if (clientHistory.length === 0) {
          factors.push({ factor: 'Nowy klient', impact: 'negative' as const, weight: -10 });
          baseProb -= 10;
        }
      }

      // 2. Wartość oferty
      const avgOrderValue = clientHistory?.length > 0 
        ? clientHistory.reduce((sum, o) => sum + o.total_net, 0) / clientHistory.length
        : 0;

      if (offer.total_net < avgOrderValue * 0.8) {
        factors.push({ factor: 'Wartość poniżej średniej klienta', impact: 'positive' as const, weight: 10 });
        baseProb += 10;
      } else if (offer.total_net > avgOrderValue * 1.5) {
        factors.push({ factor: 'Wartość znacznie powyżej średniej', impact: 'negative' as const, weight: -15 });
        baseProb -= 15;
      }

      // 3. Rabat
      if (offer.discount > 0 && offer.discount <= 10) {
        factors.push({ factor: `Atrakcyjny rabat ${offer.discount}%`, impact: 'positive' as const, weight: 10 });
        baseProb += 10;
      } else if (offer.discount > 15) {
        factors.push({ factor: 'Bardzo wysoki rabat (marża?)' , impact: 'negative' as const, weight: -5 });
        baseProb -= 5;
      }

      // 4. Termin ważności
      const daysUntilExpiry = Math.floor((new Date(offer.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 7) {
        factors.push({ factor: 'Krótki termin ważności', impact: 'negative' as const, weight: -10 });
        baseProb -= 10;
      }

      // 5. Czas od wysłania
      const daysSinceSent = Math.floor((new Date().getTime() - new Date(offer.created_at).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceSent > 7) {
        factors.push({ factor: 'Długi czas oczekiwania na decyzję', impact: 'negative' as const, weight: -15 });
        baseProb -= 15;
      }

      // Sugestie działań
      const suggestions = [];
      
      if (baseProb < 50) {
        if (daysSinceSent > 3) suggestions.push('Wykonaj telefon follow-up');
        if (offer.discount === 0) suggestions.push('Rozważ oferowanie małego rabatu (3-5%)');
        if (daysUntilExpiry < 7) suggestions.push('Przedłuż termin ważności oferty');
        suggestions.push('Zaproponuj spotkanie online do omówienia szczegółów');
      } else {
        if (daysSinceSent > 5) suggestions.push('Delikatne przypomnienie o ofercie');
        suggestions.push('Podkreśl korzyści i ROI dla klienta');
        if (clientHistory?.length > 3) suggestions.push('Przypomnij o udanej dotychczasowej współpracy');
      }

      return {
        probability: Math.max(0, Math.min(100, baseProb)),
        factors,
        suggestions
      };

    } catch (error) {
      console.error('Error predicting conversion:', error);
      throw error;
    }
  }

  // Analiza optymalnej ceny produktu
  static async analyzePricing(productId: string): Promise<{
    currentPrice: number;
    suggestedPrice: number;
    reason: string;
    confidence: number;
    expectedImpact: {
      volumeChange: number;
      revenueChange: number;
    };
  }> {
    try {
      // Pobierz dane produktu
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      // Pobierz historię sprzedaży produktu
      const { data: salesHistory } = await supabase
        .from('quotation_items')
        .select(`
          quantity,
          unit_price,
          total_price,
          quotations!inner(
            status,
            created_at,
            discount
          )
        `)
        .eq('product_id', productId)
        .gte('quotations.created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      if (!product || !salesHistory) {
        throw new Error('Brak danych do analizy');
      }

      // Analiza konwersji przy różnych cenach
      const priceRanges = this.groupByPriceRange(salesHistory);
      const conversionByPrice = this.calculateConversionByPrice(priceRanges);
      
      // Oblicz optymalną cenę
      const currentPrice = product.base_price;
      let suggestedPrice = currentPrice;
      let reason = '';
      let confidence = 70;

      // Logika analizy cenowej
      const avgConversion = Object.values(conversionByPrice).reduce((a, b) => a + b, 0) / Object.keys(conversionByPrice).length;
      
      if (conversionByPrice[currentPrice] && conversionByPrice[currentPrice] > avgConversion * 1.2) {
        // Wysoka konwersja - możemy podnieść cenę
        suggestedPrice = Math.round(currentPrice * 1.05);
        reason = 'Wysoka konwersja przy obecnej cenie sugeruje możliwość podwyżki';
        confidence = 85;
      } else if (conversionByPrice[currentPrice] && conversionByPrice[currentPrice] < avgConversion * 0.8) {
        // Niska konwersja - rozważ obniżkę
        suggestedPrice = Math.round(currentPrice * 0.95);
        reason = 'Niska konwersja może wynikać z zbyt wysokiej ceny';
        confidence = 75;
      } else {
        reason = 'Obecna cena wydaje się optymalna';
        confidence = 80;
      }

      // Oblicz przewidywany wpływ
      const priceElasticity = -1.5; // Typowa elastyczność cenowa
      const priceChangePercent = ((suggestedPrice - currentPrice) / currentPrice) * 100;
      const volumeChange = priceChangePercent * priceElasticity;
      const revenueChange = priceChangePercent + volumeChange;

      return {
        currentPrice,
        suggestedPrice,
        reason,
        confidence,
        expectedImpact: {
          volumeChange: Math.round(volumeChange),
          revenueChange: Math.round(revenueChange)
        }
      };

    } catch (error) {
      console.error('Error analyzing pricing:', error);
      throw error;
    }
  }

  // Generowanie inteligentnych opisów produktów
  static async generateProductDescription(productId: string, tone: 'professional' | 'casual' | 'technical' = 'professional'): Promise<{
    description: string;
    keywords: string[];
    sellingPoints: string[];
  }> {
    try {
      const { data: product } = await supabase
        .from('products')
        .select(`
          *,
          materials (*)
        `)
        .eq('id', productId)
        .single();

      if (!product) throw new Error('Product not found');

      // Generuj opis na podstawie typu produktu i materiału
      let description = '';
      const keywords = [];
      const sellingPoints = [];

      // Analiza materiału
      const material = product.materials;
      if (material) {
        keywords.push(material.name.toLowerCase());
        if (material.properties) {
          Object.entries(material.properties).forEach(([key, value]) => {
            if (value) keywords.push(key);
          });
        }
      }

      // Generowanie opisu w zależności od tonu
      if (tone === 'professional') {
        description = `${product.name} to profesjonalne rozwiązanie wykonane z ${material?.name || 'wysokiej jakości materiału'}. `;
        description += `Produkt charakteryzuje się grubością ${product.thickness}mm, co zapewnia optymalną wytrzymałość i trwałość. `;
        description += `Maksymalne wymiary ${product.max_width}x${product.max_height}mm pozwalają na realizację nawet najbardziej wymagających projektów. `;
        
        sellingPoints.push('Najwyższa jakość wykonania');
        sellingPoints.push('Precyzyjne cięcie CNC');
        sellingPoints.push('Gwarancja satysfakcji');
      } else if (tone === 'technical') {
        description = `Specyfikacja techniczna: ${product.name}\n`;
        description += `• Materiał: ${material?.name}\n`;
        description += `• Grubość: ${product.thickness}mm (tolerancja ±0.1mm)\n`;
        description += `• Wymiary max: ${product.max_width} x ${product.max_height}mm\n`;
        description += `• Gęstość: ${material?.density || 'N/A'} g/cm³\n`;
        
        sellingPoints.push(`Tolerancja wymiarowa ±0.1mm`);
        sellingPoints.push('Certyfikat jakości');
        sellingPoints.push('Zgodność z normami EU');
      } else {
        description = `Szukasz ${product.name}? Świetny wybór! `;
        description += `Ten produkt z ${material?.name || 'super materiału'} to prawdziwy hit. `;
        description += `${product.thickness}mm grubości - w sam raz na Twoje projekty. `;
        description += `A wymiary? Aż ${product.max_width}x${product.max_height}mm - da radę! `;
        
        sellingPoints.push('Łatwy w obróbce');
        sellingPoints.push('Szybka dostawa');
        sellingPoints.push('Super cena!');
      }

      // Dodaj zastosowania
      if (product.category === 'plexi') {
        keywords.push('pleksi', 'pmma', 'akryl', 'przezroczysty');
        description += 'Idealne do produkcji ekspozytorów, osłon, oraz elementów dekoracyjnych. ';
      } else if (product.category === 'dibond') {
        keywords.push('dibond', 'kompozyt', 'aluminium', 'reklama');
        description += 'Doskonałe na tablice reklamowe, oznakowania i fasady. ';
      }

      return {
        description,
        keywords: [...new Set(keywords)], // Usuń duplikaty
        sellingPoints
      };

    } catch (error) {
      console.error('Error generating description:', error);
      throw error;
    }
  }

  // Funkcje pomocnicze
  private static groupByPriceRange(salesData: any[]): Map<number, any[]> {
    const ranges = new Map();
    salesData.forEach(sale => {
      const price = Math.round(sale.unit_price / 10) * 10; // Grupuj co 10 zł
      if (!ranges.has(price)) {
        ranges.set(price, []);
      }
      ranges.get(price).push(sale);
    });
    return ranges;
  }

  private static calculateConversionByPrice(priceRanges: Map<number, any[]>): Record<number, number> {
    const conversions: Record<number, number> = {};
    priceRanges.forEach((sales, price) => {
      const accepted = sales.filter(s => s.quotations.status === 'accepted').length;
      conversions[price] = accepted / sales.length;
    });
    return conversions;
  }

  // Analiza trendów i sezonowości
  static async analyzeTrends(period: 'week' | 'month' | 'quarter' = 'month'): Promise<{
    topProducts: Array<{ productId: string; name: string; growth: number; volume: number }>;
    categoryTrends: Array<{ category: string; trend: 'up' | 'down' | 'stable'; change: number }>;
    recommendations: string[];
  }> {
    // Implementacja analizy trendów
    const daysMap = { week: 7, month: 30, quarter: 90 };
    const days = daysMap[period];
    
    try {
      const { data: currentPeriod } = await supabase
        .from('quotation_items')
        .select(`
          product_id,
          quantity,
          products!inner(name, category)
        `)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      const { data: previousPeriod } = await supabase
        .from('quotation_items')
        .select(`
          product_id,
          quantity,
          products!inner(name, category)
        `)
        .gte('created_at', new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000).toISOString())
        .lt('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      // Analiza produktów
      const productStats = this.calculateProductStats(currentPeriod, previousPeriod);
      const topProducts = Object.entries(productStats)
        .map(([productId, stats]: [string, any]) => ({
          productId,
          name: stats.name,
          growth: stats.growth,
          volume: stats.volume
        }))
        .sort((a, b) => b.growth - a.growth)
        .slice(0, 5);

      // Analiza kategorii
      const categoryStats = this.calculateCategoryStats(currentPeriod, previousPeriod);
      const categoryTrends = Object.entries(categoryStats).map(([category, stats]: [string, any]) => ({
        category,
        trend: stats.change > 5 ? 'up' : stats.change < -5 ? 'down' : 'stable' as const,
        change: stats.change
      }));

      // Rekomendacje
      const recommendations = [];
      
      topProducts.forEach(product => {
        if (product.growth > 50) {
          recommendations.push(`🚀 ${product.name} notuje ${product.growth}% wzrost - zwiększ stan magazynowy`);
        }
      });

      categoryTrends.forEach(cat => {
        if (cat.trend === 'down' && cat.change < -20) {
          recommendations.push(`📉 Kategoria ${cat.category} spada o ${Math.abs(cat.change)}% - rozważ promocję`);
        }
      });

      return {
        topProducts,
        categoryTrends,
        recommendations
      };

    } catch (error) {
      console.error('Error analyzing trends:', error);
      throw error;
    }
  }

  private static calculateProductStats(current: any[], previous: any[]) {
    const stats: Record<string, any> = {};
    
    // Oblicz statystyki dla bieżącego okresu
    current.forEach(item => {
      if (!stats[item.product_id]) {
        stats[item.product_id] = {
          name: item.products.name,
          currentVolume: 0,
          previousVolume: 0
        };
      }
      stats[item.product_id].currentVolume += item.quantity;
    });

    // Dodaj dane z poprzedniego okresu
    previous.forEach(item => {
      if (stats[item.product_id]) {
        stats[item.product_id].previousVolume += item.quantity;
      }
    });

    // Oblicz wzrost
    Object.keys(stats).forEach(productId => {
      const stat = stats[productId];
      stat.volume = stat.currentVolume;
      stat.growth = stat.previousVolume > 0 
        ? Math.round(((stat.currentVolume - stat.previousVolume) / stat.previousVolume) * 100)
        : 100;
    });

    return stats;
  }

  private static calculateCategoryStats(current: any[], previous: any[]) {
    const stats: Record<string, any> = {};
    
    // Grupuj po kategoriach
    const groupByCategory = (items: any[]) => {
      const grouped: Record<string, number> = {};
      items.forEach(item => {
        const category = item.products.category;
        grouped[category] = (grouped[category] || 0) + item.quantity;
      });
      return grouped;
    };

    const currentByCategory = groupByCategory(current);
    const previousByCategory = groupByCategory(previous);

    // Oblicz zmiany
    const allCategories = new Set([...Object.keys(currentByCategory), ...Object.keys(previousByCategory)]);
    
    allCategories.forEach(category => {
      const currentVol = currentByCategory[category] || 0;
      const previousVol = previousByCategory[category] || 0;
      
      stats[category] = {
        change: previousVol > 0 
          ? Math.round(((currentVol - previousVol) / previousVol) * 100)
          : 100
      };
    });

    return stats;
  }
}
