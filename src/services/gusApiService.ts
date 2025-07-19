// src/services/gusApiService.ts
// Implementacja API GUS BIR1.2

import axios from 'axios';

// Konfiguracja API GUS
const GUS_API_KEY = 'cc8f3d1743644ffc9b15';
const GUS_API_URL = 'https://wl-api.mf.gov.pl';

// Środowisko produkcyjne
const GUS_ENVIRONMENT = 'prod';

interface GUSSession {
  sessionId: string;
  timestamp: number;
}

interface GUSCompanyData {
  Regon: string;
  Nip: string;
  StatusNip: string;
  Nazwa: string;
  Wojewodztwo: string;
  Powiat: string;
  Gmina: string;
  Miejscowosc: string;
  KodPocztowy: string;
  Ulica: string;
  NrNieruchomosci: string;
  NrLokalu: string;
  Typ: string;
  SilosID: string;
  DataZakonczeniaDzialalnosci: string;
}

export class GUSApiService {
  private session: GUSSession | null = null;

  // Logowanie do API GUS
  private async login(): Promise<string> {
    try {
      const response = await axios.post(
        `${GUS_API_URL}/api/UserLogin`,
        null,
        {
          headers: {
            'pKluczUzytkownika': GUS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const sessionId = response.data.Wynik;
      if (!sessionId) {
        throw new Error('Nie udało się uzyskać sesji GUS');
      }

      this.session = {
        sessionId,
        timestamp: Date.now()
      };

      return sessionId;
    } catch (error) {
      console.error('Błąd logowania do GUS:', error);
      throw new Error('Nie można połączyć się z API GUS');
    }
  }

  // Wylogowanie
  private async logout(sessionId: string): Promise<void> {
    try {
      await axios.get(`${GUS_API_URL}/api/UserLogout`, {
        headers: {
          'sid': sessionId
        }
      });
    } catch (error) {
      console.error('Błąd wylogowania z GUS:', error);
    }
  }

  // Sprawdź i odnów sesję jeśli potrzeba
  private async ensureSession(): Promise<string> {
    // Sesja wygasa po 1 godzinie
    const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 godzina w ms

    if (!this.session || (Date.now() - this.session.timestamp) > SESSION_TIMEOUT) {
      return await this.login();
    }

    return this.session.sessionId;
  }

  // Wyszukiwanie po NIP
  async searchByNIP(nip: string): Promise<GUSCompanyData | null> {
    try {
      const cleanNip = nip.replace(/[^0-9]/g, '');
      const sessionId = await this.ensureSession();

      const response = await axios.post(
        `${GUS_API_URL}/api/DataSearchEntity`,
        {
          pParametryWyszukiwania: {
            Nip: cleanNip
          }
        },
        {
          headers: {
            'sid': sessionId,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      if (!data || !data.Wynik || data.Wynik.length === 0) {
        console.log('Nie znaleziono firmy w GUS dla NIP:', cleanNip);
        return null;
      }

      return data.Wynik[0];
    } catch (error) {
      console.error('Błąd wyszukiwania w GUS:', error);
      
      // Jeśli błąd związany z sesją, spróbuj ponownie z nową sesją
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.session = null;
        return this.searchByNIP(nip); // Rekurencyjne wywołanie z nową sesją
      }
      
      return null;
    }
  }

  // Wyszukiwanie po REGON
  async searchByREGON(regon: string): Promise<GUSCompanyData | null> {
    try {
      const cleanRegon = regon.replace(/[^0-9]/g, '');
      const sessionId = await this.ensureSession();

      const response = await axios.post(
        `${GUS_API_URL}/api/DataSearchEntity`,
        {
          pParametryWyszukiwania: {
            Regon: cleanRegon
          }
        },
        {
          headers: {
            'sid': sessionId,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      if (!data || !data.Wynik || data.Wynik.length === 0) {
        console.log('Nie znaleziono firmy w GUS dla REGON:', cleanRegon);
        return null;
      }

      return data.Wynik[0];
    } catch (error) {
      console.error('Błąd wyszukiwania w GUS:', error);
      
      // Jeśli błąd związany z sesją, spróbuj ponownie z nową sesją
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.session = null;
        return this.searchByREGON(regon); // Rekurencyjne wywołanie z nową sesją
      }
      
      return null;
    }
  }

  // Formatowanie adresu z danych GUS
  formatAddress(data: GUSCompanyData): string {
    const parts = [];
    
    if (data.Ulica) {
      parts.push(data.Ulica);
    }
    
    if (data.NrNieruchomosci) {
      parts.push(data.NrNieruchomosci);
    }
    
    if (data.NrLokalu) {
      parts.push(`lok. ${data.NrLokalu}`);
    }
    
    const street = parts.join(' ');
    const city = data.KodPocztowy && data.Miejscowosc 
      ? `${data.KodPocztowy} ${data.Miejscowosc}` 
      : data.Miejscowosc;
    
    return [street, city].filter(Boolean).join(', ');
  }

  // Konwersja danych GUS na format używany w aplikacji
  convertToAppFormat(gusData: GUSCompanyData) {
    return {
      nip: gusData.Nip,
      name: gusData.Nazwa,
      address: this.formatAddress(gusData),
      regon: gusData.Regon,
      wojewodztwo: gusData.Wojewodztwo,
      powiat: gusData.Powiat,
      gmina: gusData.Gmina,
      status: gusData.StatusNip,
      type: gusData.Typ,
      isActive: !gusData.DataZakonczeniaDzialalnosci
    };
  }
}

// Eksportuj singleton
export const gusApiService = new GUSApiService();
