// src/config/api.ts
// Konfiguracja API

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Konfiguracja API - zawsze używaj Render w produkcji
export const API_URL = isProduction 
  ? 'https://plexisystem-backend.onrender.com'  // Twój backend na Render
  : 'http://localhost:3001';                     // Lokalny backend

export const API_ENDPOINTS = {
  // Health check
  health: `${API_URL}/api/health`,
  
  // Email
  sendEmail: `${API_URL}/api/send-email`,
  
  // GUS
  gus: (nip: string) => `${API_URL}/api/gus/${nip}`,
  
  // Oferty
  offers: {
    list: `${API_URL}/api/offers`,
    get: (id: number) => `${API_URL}/api/offers/${id}`,
    create: `${API_URL}/api/offers`,
    updateStatus: (id: number) => `${API_URL}/api/offers/${id}/status`,
    share: (token: string) => `${API_URL}/api/offers/share/${token}`
  }
};

// Helper do obsługi błędów
export const handleApiError = (error: any) => {
  if (error.response) {
    // Błąd z odpowiedzią od serwera
    console.error('API Error:', error.response.data);
    return error.response.data.message || 'Błąd serwera';
  } else if (error.request) {
    // Brak odpowiedzi
    console.error('No response:', error.request);
    return 'Brak połączenia z serwerem';
  } else {
    // Inny błąd
    console.error('Error:', error.message);
    return 'Wystąpił nieoczekiwany błąd';
  }
};