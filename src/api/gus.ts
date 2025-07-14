// src/api/gus.ts

const GUS_WEBHOOK_URL = import.meta.env.VITE_GUS_WEBHOOK_URL;

export interface CompanyData {
  nip: string;
  name: string;
  address: string;
  email?: string;
  phone?: string;
  regon?: string;
  krs?: string;
  wojewodztwo?: string;
  powiat?: string;
  gmina?: string;
}

// Funkcja do pobierania danych z GUS przez webhook
export const fetchCompanyData = async (nip: string): Promise<CompanyData | null> => {
  try {
    const cleanNip = nip.replace(/[-\s]/g, '');
    
    if (!GUS_WEBHOOK_URL) {
      console.error('Brak konfiguracji VITE_GUS_WEBHOOK_URL');
      return null;
    }

    console.log('Wysyłam zapytanie do GUS (GET):', GUS_WEBHOOK_URL);

    // Używamy GET zamiast POST - Google Apps Script lepiej to obsługuje
    const url = `${GUS_WEBHOOK_URL}?nip=${cleanNip}`;
    console.log('Pełny URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Status odpowiedzi:', response.status);
    
    const text = await response.text();
    console.log('Odpowiedź GUS (raw):', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Odpowiedź GUS (parsed):', data);
      
      if (data.error) {
        console.error('GUS zwrócił błąd:', data.error);
        return null;
      }

      if (data.name) {
        return {
          nip: cleanNip,
          name: data.name || '',
          address: data.address || '',
          regon: data.regon || '',
          email: data.email || '',
          phone: data.phone || '',
          krs: data.krs || '',
          wojewodztwo: data.wojewodztwo || '',
          powiat: data.powiat || '',
          gmina: data.gmina || '',
        };
      }
      
      if (data.success === false) {
        console.log('Firma nie znaleziona w GUS');
        return null;
      }
      
    } catch (parseError) {
      console.error('Błąd parsowania odpowiedzi:', parseError);
      console.error('Tekst odpowiedzi:', text);
    }

    return null;
  } catch (error) {
    console.error('Błąd pobierania danych z GUS:', error);
    
    // Jeśli fetch nie działa, spróbuj przez dynamiczny skrypt (JSONP-style)
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.log('Próbuję alternatywną metodę...');
      
      return new Promise((resolve) => {
        const cleanNip = nip.replace(/[-\s]/g, '');
        const callbackName = `gusCallback${Date.now()}`;
        
        // Utwórz globalną funkcję callback
        (window as any)[callbackName] = (data: any) => {
          console.log('GUS callback response:', data);
          delete (window as any)[callbackName];
          
          if (data && data.name) {
            resolve({
              nip: cleanNip,
              name: data.name || '',
              address: data.address || '',
              regon: data.regon || '',
              email: data.email || '',
              phone: data.phone || '',
              wojewodztwo: data.wojewodztwo || '',
              powiat: data.powiat || '',
              gmina: data.gmina || '',
            });
          } else {
            resolve(null);
          }
        };
        
        // Dodaj skrypt
        const script = document.createElement('script');
        script.src = `${GUS_WEBHOOK_URL}?nip=${cleanNip}&callback=${callbackName}`;
        script.onerror = () => {
          console.error('Błąd ładowania skryptu GUS');
          delete (window as any)[callbackName];
          resolve(null);
        };
        document.body.appendChild(script);
        
        // Cleanup po 5 sekundach
        setTimeout(() => {
          if ((window as any)[callbackName]) {
            delete (window as any)[callbackName];
            document.body.removeChild(script);
            resolve(null);
          }
        }, 5000);
      });
    }
    
    return null;
  }
};