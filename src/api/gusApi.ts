// src/api/gusApi.ts
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

interface GusData {
  nip: string;
  name: string;
  address: string;
  regon: string;
  wojewodztwo?: string;
  powiat?: string;
  gmina?: string;
  email?: string;
  phone?: string;
}

export const fetchCompanyByNip = async (nip: string): Promise<GusData | null> => {
  try {
    // Używamy konfiguracji z api.ts
    const response = await axios.get(API_ENDPOINTS.gus(nip));
    return response.data;
  } catch (error) {
    console.error('Error fetching from GUS:', error);
    
    // Opcja 2: Dane testowe (gdy API nie działa)
    const testData: Record<string, GusData> = {
      '5882396272': {
        nip: '5882396272',
        name: 'PlexiSystem S.C.',
        address: 'Ks. Dr. Leona Heyke 11, 84-206 Nowy Dwór Wejherowski',
        regon: '123456789',
        wojewodztwo: 'pomorskie',
        powiat: 'wejherowski',
        gmina: 'Wejherowo'
      },
      '5213870274': {
        nip: '5213870274',
        name: 'Google Poland Sp. z o.o.',
        address: 'ul. Emilii Plater 53, 00-113 Warszawa',
        regon: '380871946',
        wojewodztwo: 'mazowieckie',
        powiat: 'warszawski',
        gmina: 'Warszawa'
      }
    };
    
    return testData[nip] || null;
  }
};