// src/api/gus.ts
// Integracja z API GUS przez backend

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

// Funkcja do pobierania danych z GUS przez backend
export const fetchCompanyData = async (nip: string): Promise<CompanyData | null> => {
  try {
    const cleanNip = nip.replace(/[-\s]/g, '');
    
    console.log('Pobieranie danych z GUS dla NIP:', cleanNip);

    // Określ URL backendu w zależności od środowiska
    const backendUrl = import.meta.env.VITE_API_URL || 
                      (import.meta.env.DEV ? 'http://localhost:3001' : 'https://plexisystem-backend.onrender.com');
    
    const response = await fetch(`${backendUrl}/api/gus/${cleanNip}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Status odpowiedzi:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Firma nie znaleziona w GUS');
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dane z GUS:', data);
    
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
    
  } catch (error) {
    console.error('Błąd pobierania danych z GUS:', error);
    
    // Dane testowe jako fallback
    const testData: Record<string, CompanyData> = {
      '5252344078': {
        nip: '5252344078',
        name: 'PLEXISYSTEM ŁUKASZ SIKORRA',
        address: 'ul. Kartuska 145B lok. 1, 80-122 Gdańsk',
        regon: '146866569',
        wojewodztwo: 'POMORSKIE',
        powiat: 'Gdańsk',
        gmina: 'Gdańsk',
        email: '',
        phone: ''
      },
      '5882396272': {
        nip: '5882396272',
        name: 'PlexiSystem S.C.',
        address: 'Ks. Dr. Leona Heyke 11, 84-206 Nowy Dwór Wejherowski',
        regon: '123456789',
        wojewodztwo: 'pomorskie',
        powiat: 'wejherowski',
        gmina: 'Wejherowo'
      }
    };
    
    return testData[nip.replace(/[-\s]/g, '')] || null;
  }
};
