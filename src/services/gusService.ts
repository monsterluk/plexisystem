// API GUS REGON Service - wersja z proxy
// Klucz API: cc8f3d1743644ffc9b15

interface GUSSearchResult {
  Regon: string;
  Nip: string;
  Nazwa: string;
  Wojewodztwo: string;
  Miejscowosc: string;
  KodPocztowy: string;
  Ulica: string;
}

export class GUSService {
  // Używamy proxy endpoint zamiast bezpośredniego połączenia (CORS)
  private proxyUrl = '/api/gus';

  async searchByNIP(nip: string): Promise<GUSSearchResult | null> {
    try {
      const cleanNip = nip.replace(/[^0-9]/g, '');
      
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'search',
          nip: cleanNip
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Błąd wyszukiwania w GUS:', error);
      return null;
    }
  }

  async searchByREGON(regon: string): Promise<GUSSearchResult | null> {
    try {
      const cleanRegon = regon.replace(/[^0-9]/g, '');
      
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'search',
          regon: cleanRegon
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Błąd wyszukiwania w GUS:', error);
      return null;
    }
  }

  // Metoda pomocnicza do formatowania adresu
  formatAddress(data: GUSSearchResult): string {
    const parts = [
      data.Ulica,
      data.KodPocztowy && data.Miejscowosc ? `${data.KodPocztowy} ${data.Miejscowosc}` : data.Miejscowosc,
    ].filter(Boolean);
    
    return parts.join(', ');
  }
}

// Eksportuj singleton
export const gusService = new GUSService();
