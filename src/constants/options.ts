// src/constants/options.ts
import { 
  Sparkles, 
  Package, 
  Lightbulb, 
  Zap, 
  Droplets, 
  Wrench, 
  Lock, 
  Footprints,
  FileText,
  Layers,
  CircleDot,
  Paperclip,
  type LucideIcon
} from 'lucide-react';

interface AdditionalOption {
  id: string;
  name: string;
  icon: LucideIcon;
  price: number;
  unit: 'szt' | 'm²' | 'mb' | 'komplet' | 'special';
}

export const additionalOptions: AdditionalOption[] = [
  { id: 'grafika', name: 'Grafika / zadruk', icon: FileText, price: 100, unit: 'm²' },
  { id: 'grafika_dwustronna', name: 'Grafika dwustronna', icon: Layers, price: 180, unit: 'm²' },
  { id: 'polerowanie', name: 'Polerowanie krawędzi', icon: Sparkles, price: 5, unit: 'mb' },
  { id: 'karton', name: 'Karton jednostkowy', icon: Package, price: 8, unit: 'szt' },
  { id: 'wieko', name: 'Wieko', icon: Package, price: 0, unit: 'special' },
  { id: 'zawiasy', name: 'Zawiasy', icon: Wrench, price: 25, unit: 'komplet' },
  { id: 'zamek', name: 'Zamek', icon: Lock, price: 35, unit: 'szt' },
  { id: 'nozki', name: 'Nóżki', icon: Footprints, price: 5, unit: 'szt' },
  { id: 'klejenie_uv', name: 'Klejenie UV', icon: Zap, price: 0, unit: 'special' },
  { id: 'dno_inny_material', name: 'Dno z innego materiału', icon: Layers, price: 0, unit: 'special' },
  { id: 'topper', name: 'Topper', icon: CircleDot, price: 0, unit: 'special' },
  { id: 'led_standard', name: 'LED Standard', icon: Lightbulb, price: 30, unit: 'mb' },
  { id: 'led_cob', name: 'LED COB', icon: Lightbulb, price: 50, unit: 'mb' },
  { id: 'led_rgb', name: 'LED RGB', icon: Lightbulb, price: 80, unit: 'mb' },
  { id: 'zasilacz_led', name: 'Zasilacz LED', icon: Zap, price: 80, unit: 'szt' },
  { id: 'projekt_led', name: 'Projekt oświetlenia', icon: FileText, price: 200, unit: 'szt' },
  { id: 'wodoodpornosc', name: 'Wodoodporność IP65', icon: Droplets, price: 0, unit: 'special' },
  { id: 'litery_podklejane', name: 'Litery podklejane', icon: FileText, price: 250, unit: 'm²' },
  { id: 'litery_zlicowane', name: 'Litery zlicowane', icon: FileText, price: 350, unit: 'm²' },
  { id: 'litery_wystajace', name: 'Litery wystające', icon: FileText, price: 450, unit: 'm²' },
  { id: 'litery_halo', name: 'Litery z efektem halo', icon: FileText, price: 550, unit: 'm²' },
  { id: 'tasma', name: 'Taśma dwustronna', icon: Paperclip, price: 12, unit: 'mb' }
];

export const getAvailableOptions = (productType: string, expositorType?: string) => {
  let options = [...additionalOptions];
  
  if (productType === 'kaseton') {
    return options.filter(o => ['litery_podklejane', 'litery_zlicowane', 'litery_wystajace', 'litery_halo', 'led_standard', 'led_cob', 'led_rgb', 'zasilacz_led'].includes(o.id));
  }
  
  if (productType === 'ledon') {
    return options.filter(o => ['led_standard', 'led_cob', 'led_rgb', 'projekt_led', 'wodoodpornosc', 'zasilacz_led'].includes(o.id));
  }
  
  if (productType === 'ekspozytor') {
    const baseOptions = ['grafika', 'grafika_dwustronna', 'polerowanie', 'karton'];
    if (['podstawkowy', 'z_haczykami', 'kosmetyczny'].includes(expositorType || '')) {
      baseOptions.push('topper', 'led_standard', 'zasilacz_led');
    }
    return options.filter(o => baseOptions.includes(o.id));
  }
  
  if (['pojemnik', 'gablota'].includes(productType)) {
    const baseOptions = ['grafika', 'polerowanie', 'zawiasy', 'zamek', 'karton', 'klejenie_uv', 'nozki'];
    if (productType === 'pojemnik') {
      baseOptions.push('dno_inny_material');
    }
    return options.filter(o => baseOptions.includes(o.id));
  }
  
  if (productType === 'obudowa') {
    return options.filter(o => ['grafika', 'polerowanie', 'karton', 'klejenie_uv', 'tasma'].includes(o.id));
  }
  
  if (productType === 'formatka') {
    return options.filter(o => ['polerowanie', 'karton'].includes(o.id));
  }
  
  if (productType === 'impuls') {
    return options.filter(o => ['grafika', 'grafika_dwustronna', 'polerowanie'].includes(o.id));
  }
  
  return options;
};