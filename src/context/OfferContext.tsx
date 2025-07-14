// src/context/OfferContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Offer, OfferItem, Client } from '../types/Offer';
import { defaultTerms, salespeople } from '../constants/materials';

interface OfferContextType {
  currentOffer: Offer;
  setCurrentOffer: React.Dispatch<React.SetStateAction<Offer>>;
  addItem: (item: OfferItem) => void;
  removeItem: (itemId: number) => void;
  updateClient: (client: Partial<Client>) => void;
  updateDiscount: (discount: number) => void;
  updateDeliveryRegion: (regionId: string) => void;
  updateOfferField: (field: string, value: any) => void;
  updateOfferTerms: (field: string, value: string) => void;
  calculateTotals: () => void;
  resetOffer: () => void;
}

const OfferContext = createContext<OfferContextType | null>(null);

export const useOffer = () => {
  const context = useContext(OfferContext);
  if (!context) {
    throw new Error('useOffer must be used within OfferProvider');
  }
  return context;
};

// Alias dla kompatybilności
export const useOfferContext = useOffer;

const createEmptyOffer = (): Offer => ({
  id: Date.now(),
  number: generateOfferNumber(),
  date: new Date().toISOString().split('T')[0],
  client: {
    nip: '',
    name: '',
    address: '',
    email: '',
    phone: '',
    regon: ''
  },
  items: [],
  terms: { ...defaultTerms },
  status: 'draft',
  salesperson: salespeople[0],
  comment: '',
  internalNotes: '',
  totalNet: 0,
  discount: 10,
  discountValue: 0,
  totalNetAfterDiscount: 0,
  version: 1,
  projectName: '',
  validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  deliveryRegion: 'odbior',
  deliveryCost: 0,
  shareLink: ''
});

function generateOfferNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${salespeople[0].id}-${year}-${month}${random}`;
}

export const OfferProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOffer, setCurrentOffer] = useState<Offer>(createEmptyOffer());

  const calculateTotals = useCallback(() => {
    setCurrentOffer(prev => {
      const totalNet = prev.items.reduce((sum, item) => sum + item.totalPrice, 0);
      const discountValue = (totalNet * prev.discount) / 100;
      const totalNetAfterDiscount = totalNet - discountValue;
      
      return {
        ...prev,
        totalNet,
        discountValue,
        totalNetAfterDiscount
      };
    });
  }, []);

  const addItem = useCallback((item: OfferItem) => {
    setCurrentOffer(prev => {
      const newItems = [...prev.items, item];
      const totalNet = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
      const discountValue = (totalNet * prev.discount) / 100;
      const totalNetAfterDiscount = totalNet - discountValue;
      
      return {
        ...prev,
        items: newItems,
        totalNet,
        discountValue,
        totalNetAfterDiscount
      };
    });
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setCurrentOffer(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      const totalNet = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const discountValue = (totalNet * prev.discount) / 100;
      const totalNetAfterDiscount = totalNet - discountValue;
      
      return {
        ...prev,
        items: newItems,
        totalNet,
        discountValue,
        totalNetAfterDiscount
      };
    });
  }, []);

  const updateClient = useCallback((clientData: Partial<Client>) => {
    setCurrentOffer(prev => ({
      ...prev,
      client: { ...prev.client, ...clientData }
    }));
  }, []);

  const updateOfferField = useCallback((field: string, value: any) => {
    setCurrentOffer(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateOfferTerms = useCallback((field: string, value: string) => {
    setCurrentOffer(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        [field]: value
      }
    }));
  }, []);

  const updateDiscount = useCallback((discount: number) => {
    setCurrentOffer(prev => {
      const discountValue = (prev.totalNet * discount) / 100;
      const totalNetAfterDiscount = prev.totalNet - discountValue;
      
      return {
        ...prev,
        discount,
        discountValue,
        totalNetAfterDiscount
      };
    });
  }, []);

  const updateDeliveryRegion = useCallback((regionId: string) => {
    setCurrentOffer(prev => ({
      ...prev,
      deliveryRegion: regionId,
      deliveryCost: regionId === 'odbior' ? 0 : calculateDeliveryCost(prev.items, regionId)
    }));
  }, []);

  const resetOffer = useCallback(() => {
    setCurrentOffer(createEmptyOffer());
  }, []);

  const value = {
    currentOffer,
    setCurrentOffer,
    addItem,
    removeItem,
    updateClient,
    updateOfferField,
    updateOfferTerms,
    updateDiscount,
    updateDeliveryRegion,
    calculateTotals,
    resetOffer
  };

  return (
    <OfferContext.Provider value={value}>
      {children}
    </OfferContext.Provider>
  );
};

function calculateDeliveryCost(items: OfferItem[], regionId: string): number {
  // Implementacja kalkulacji kosztów dostawy
  const totalWeight = items.reduce((sum, item) => 
    sum + (item.calculations?.totalWeight || 0), 0
  );
  
  const regions = {
    trojmiasto: { pricePerKg: 0.5, minPrice: 30 },
    pomorskie: { pricePerKg: 0.8, minPrice: 50 },
    polska_polnoc: { pricePerKg: 1.2, minPrice: 80 },
    polska_pozostala: { pricePerKg: 1.5, minPrice: 100 }
  };
  
  const region = regions[regionId as keyof typeof regions];
  if (!region) return 0;
  
  return Math.max(region.pricePerKg * totalWeight, region.minPrice);
}