// src/constants/materials.ts
import { Square, Package, Store, Megaphone, Lightbulb, Box, Shield, ShoppingCart } from 'lucide-react';

export const productTypes = [
  { id: 'formatka', name: 'Formatka / Płyta', icon: Square, multiplier: 1.3, waste: 0.05 },
  { id: 'pojemnik', name: 'Pojemnik / Organizer', icon: Package, multiplier: 1.4, waste: 0.08 },
  { id: 'ekspozytor', name: 'Ekspozytory', icon: Store, multiplier: 1.7, waste: 0.12 },
  { id: 'kaseton', name: 'Kaseton reklamowy', icon: Megaphone, multiplier: 1.5, waste: 0.08 },
  { id: 'ledon', name: 'LEDON (neon LED)', icon: Lightbulb, multiplier: 1.4, waste: 0.08 },
  { id: 'gablota', name: 'Gablota', icon: Box, multiplier: 1.4, waste: 0.08 },
  { id: 'obudowa', name: 'Obudowa / Osłona', icon: Shield, multiplier: 1.4, waste: 0.08 },
  { id: 'impuls', name: 'Impuls kasowy', icon: ShoppingCart, multiplier: 1.4, waste: 0.08 }
];

export const expositorTypes = [
  { id: 'podstawkowy', name: 'Podstawkowy', description: 'Podstawa + plecy + boki + opcjonalny topper' },
  { id: 'schodkowy', name: 'Schodkowy', description: '3-5 półek stopniowanych' },
  { id: 'z_haczykami', name: 'Z haczykami', description: 'Płyta perforowana pod haczyki' },
  { id: 'wiszacy', name: 'Wiszący', description: 'Montowany na ścianie' },
  { id: 'stojak', name: 'Stojak reklamowy', description: 'Wolnostojący z podstawą' },
  { id: 'kosmetyczny', name: 'Kosmetyczny', description: 'Półki z ogranicznikami' }
];

export const materials = [
  { id: 'plexi_clear', name: 'Plexi bezbarwna', basePrice: 30, density: 1190 },
  { id: 'plexi_white', name: 'Plexi mleczna', basePrice: 33, density: 1190 },
  { id: 'plexi_color', name: 'Plexi kolorowa', basePrice: 40, density: 1190, fixedThickness: [3, 5], colorMultiplier: 1.4 },
  { id: 'petg', name: 'PET-G', basePrice: 30, density: 1270 },
  { id: 'hips', name: 'HIPS', basePrice: 20, density: 1050 },
  { id: 'dibond', name: 'Dibond', basePrice: 80, density: 1500, fixedThickness: [3] },
  { id: 'pc', name: 'Poliwęglan', basePrice: 38, density: 1200 },
  { id: 'pcv', name: 'PCV spienione', basePrice: 180, density: 1400 }
];

export const deliveryRegions = [
  { id: 'trojmiasto', name: 'Trójmiasto i okolice (do 50km)', pricePerKg: 0.5, minPrice: 30 },
  { id: 'pomorskie', name: 'Pomorskie', pricePerKg: 0.8, minPrice: 50 },
  { id: 'polska_polnocna', name: 'Polska północna', pricePerKg: 1.2, minPrice: 80 },
  { id: 'polska_pozostala', name: 'Pozostałe regiony', pricePerKg: 1.5, minPrice: 100 },
  { id: 'odbior', name: 'Odbiór osobisty', pricePerKg: 0, minPrice: 0 }
];

export const salespeople = [
  { id: 'DB', name: 'Dorota Będkowska', phone: '884042109', email: 'dorota@plexisystem.pl' },
  { id: 'LS', name: 'Łukasz Sikorra', phone: '884042107', email: 'lukasz@plexisystem.pl' }
];

export const defaultTerms = {
  deliveryTime: '3-10 dni roboczych',
  deliveryMethod: 'Kurier / odbiór osobisty',
  paymentTerms: 'Przelew 7 dni',
  warranty: 'Produkty niestandardowe nie podlegają zwrotowi',
  validity: '7 dni'
};