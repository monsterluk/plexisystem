// src/types/Offer.ts
import { LucideIcon } from 'lucide-react';

export interface Client {
  nip: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  regon: string;
  wojewodztwo?: string;
  powiat?: string;
  gmina?: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductParams {
  shelves: number;
  partitions: number;
  ledLength: number;
  hookRows: number;
  hookCols: number;
  pockets: number;
  kasetonType?: 'plexi' | 'dibond';
  bottomMaterial?: string;
  bottomThickness?: number;
}

// Dodane brakujące typy
export interface Product {
  id: string;
  name: string;
  icon: LucideIcon;
  multiplier: number;
  waste: number;
}

export interface Material {
  id: string;
  name: string;
  basePrice: number;
  density: number;
  fixedThickness?: number[];
  colorMultiplier?: number;
}

export interface AdditionalOption {
  id: string;
  name: string;
  icon: LucideIcon;
  price: number;
  unit: 'szt' | 'm²' | 'mb' | 'komplet' | 'special';
}

// Produkt nietypowy
export interface CustomProduct {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isCustom: true;
}

// Rozszerzone OfferItem o produkt nietypowy
export type OfferItemExtended = OfferItem | CustomProduct;

// Alias dla kompatybilności
export type CalculatorItem = OfferItem;

export interface OfferItem {
  id: number;
  product: string;
  productName: string;
  expositorType?: string;
  material: string;
  materialName: string;
  thickness: number;
  dimensions: Dimensions;
  quantity: number;
  options: Record<string, boolean>;
  optionQuantities: Record<string, number>;
  productParams: ProductParams;
  calculations: {
    surface: number;
    weight: number;
    materialCost: number;
    optionsCost: number;
    unitPrice: number;
    totalPrice: number;
    piecesPerPallet: number;
    piecesPerBox: number;
    totalWeight: number;
    boxDimensions: Dimensions;
    boxSurface: number;
    boxWeight: number;
    piecesPerBoxOptimal: number;
    boxesTotal: number;
    palletsTotal: number;
    palletLayers: number;
    boxesPerLayer: number;
    costBreakdown: {
      materialCost: number;
      wasteCost: number;
      laborCost: number;
      optionsCost: number;
      margin: number;
    };
  };
  unitPrice: number;
  totalPrice: number;
  costBreakdown?: {
    materialCost: number;
    wasteCost: number;
    laborCost: number;
    optionsCost: number;
    margin: number;
  };
}

export interface Terms {
  deliveryTime: string;
  deliveryMethod: string;
  paymentTerms: string;
  warranty: string;
  validity: string;
}

export interface Salesperson {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export type OfferStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Offer {
  id: number | null;
  number: string;
  date: string;
  client: Client;
  items: OfferItemExtended[];
  terms: Terms;
  status: OfferStatus;
  salesperson: Salesperson;
  comment: string;
  internalNotes: string;
  totalNet: number;
  discount: number;
  discountValue: number;
  totalNetAfterDiscount: number;
  version: number;
  projectName: string;
  validUntil: string;
  deliveryRegion: string;
  deliveryCost: number;
  shareLink: string;
}