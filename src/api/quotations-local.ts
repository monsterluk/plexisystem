// src/api/quotations-local.ts - Tymczasowa wersja bez Supabase
import { Offer } from '@/types/Offer';
import { salespeople } from '@/constants/materials';

// Lokalne dane ofert (przykładowe)
let localOffers: Offer[] = [
  {
    id: 1,
    number: 'DB-2025-0001',
    date: '2025-01-17',
    shareLink: 'https://plexisystem.pl/oferta/example-token-1',
    client: {
      name: 'Firma Przykładowa Sp. z o.o.',
      nip: '1234567890',
      address: 'ul. Testowa 123, 00-001 Warszawa',
      email: 'kontakt@przykład.pl',
      phone: '123456789',
      regon: '123456789'
    },
    items: [],
    terms: {
      deliveryTime: '3-10 dni roboczych',
      deliveryMethod: 'Kurier / odbiór osobisty',
      paymentTerms: 'Przelew 7 dni',
      warranty: 'Produkty niestandardowe nie podlegają zwrotowi',
      validity: '7 dni'
    },
    status: 'sent',
    salesperson: salespeople[1], // Dorota
    comment: '',
    internalNotes: '',
    totalNet: 5000,
    discount: 10,
    discountValue: 500,
    totalNetAfterDiscount: 4500,
    deliveryRegion: 'odbior',
    deliveryCost: 0,
    projectName: 'Ekspozytory targowe 2025',
    validUntil: '2025-01-24',
    version: 1
  }
];

// Zapisz nową ofertę
export const saveOffer = async (offer: Offer): Promise<Offer> => {
  // Symulacja opóźnienia sieciowego
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const year = new Date().getFullYear();
  const offerNumber = `${offer.salesperson.id}-${year}-${String(Date.now()).slice(-4)}`;
  const shareToken = crypto.randomUUID();
  
  const savedOffer = {
    ...offer,
    id: Date.now(),
    number: offerNumber,
    shareLink: `${window.location.origin}/oferta/${shareToken}`,
    date: new Date().toISOString().split('T')[0]
  };
  
  localOffers.push(savedOffer);
  
  // Zapisz do localStorage
  localStorage.setItem('plexisystem_offers', JSON.stringify(localOffers));
  
  return savedOffer;
};

// Pobierz ofertę po ID
export const getOffer = async (id: string): Promise<Offer> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const offer = localOffers.find(o => o.id === parseInt(id));
  if (!offer) throw new Error('Oferta nie znaleziona');
  
  return offer;
};

// Pobierz wszystkie oferty
export const getOffers = async (): Promise<Offer[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Wczytaj z localStorage jeśli istnieją
  const stored = localStorage.getItem('plexisystem_offers');
  if (stored) {
    localOffers = JSON.parse(stored);
  }
  
  return localOffers;
};

// Pobierz ofertę po tokenie (dla klienta)
export const getOfferByToken = async (token: string): Promise<Offer> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const offer = localOffers.find(o => o.shareLink?.includes(token));
  if (!offer) throw new Error('Oferta nie znaleziona');
  
  // Zwróć ofertę bez danych wewnętrznych
  return {
    ...offer,
    internalNotes: '', // Nie pokazuj klientowi
    client: {
      ...offer.client,
      nip: '', // Ukryj wrażliwe dane
      email: '',
      phone: '',
      regon: ''
    }
  };
};

// Zaakceptuj ofertę
export const acceptOffer = async (offerId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = localOffers.findIndex(o => o.id === parseInt(offerId));
  if (index !== -1) {
    localOffers[index].status = 'accepted';
    localStorage.setItem('plexisystem_offers', JSON.stringify(localOffers));
    return true;
  }
  
  return false;
};

// Odrzuć ofertę
export const rejectOffer = async (offerId: number, reason?: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = localOffers.findIndex(o => o.id === offerId);
  if (index !== -1) {
    localOffers[index].status = 'rejected';
    localStorage.setItem('plexisystem_offers', JSON.stringify(localOffers));
    return true;
  }
  
  return false;
};

// Alias dla kompatybilności
export const getOfferByShareLink = getOfferByToken;
