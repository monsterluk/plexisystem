import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Star, Clock, Package, Eye, Edit, Heart, TrendingUp, Award, Filter, Search, ArrowRight, Ruler, Layers, Zap, CheckCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  complexity: 'Proste' | 'Średnie' | 'Złożone';
  icon: React.ReactNode;
  soldCount: number;
  rating: number;
  deliveryDays: number;
  shortDescription: string;
  detailedDescription: string;
  features: string[];
  applications: string[];
  materials: string[];
  defaultDimensions: {
    width?: number;
    height?: number;
    depth?: number;
    thickness?: number;
  };
  customizable: boolean;
  bestseller?: boolean;
  calculatorType: 'standard' | 'display' | 'organizer' | 'shield' | 'signage';
}

// Ulepszone komponenty ikon
const ProductIcons = {
  NailDisplay: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 to-purple-100/40 animate-pulse" />
      <div className="relative z-10">
        <div className="w-24 h-4 bg-gray-300 rounded-lg shadow-lg mb-2" />
        <div className="relative -mt-1">
          {[...Array(6)].map((_, level) => (
            <div key={level} className="flex justify-center space-x-1 mb-1" 
                 style={{ transform: `translateY(-${level * 4}px)` }}>
              {[...Array(level < 3 ? 8 : level < 5 ? 6 : 4)].map((_, i) => (
                <div key={i} className={`w-3 h-8 rounded-full shadow-sm ${
                  ['bg-pink-400', 'bg-purple-400', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-indigo-400'][i % 8]
                }`} />
              ))}
            </div>
          ))}
        </div>
        <div className="absolute -top-2 -right-2">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            ✨
          </div>
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
          60 miejsc
        </div>
      </div>
    </div>
  ),
  
  CosmeticsOrganizer: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 to-rose-100/30" />
      <div className="relative z-10">
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-pink-200/50">
          <div className="grid grid-cols-4 gap-1 mb-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-lg shadow-sm ${
                i % 4 === 0 ? 'bg-pink-300' : i % 4 === 1 ? 'bg-rose-300' : i % 4 === 2 ? 'bg-purple-300' : 'bg-red-300'
              }`} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-6 h-6 rounded-lg shadow-sm ${
                i % 3 === 0 ? 'bg-pink-400' : i % 3 === 1 ? 'bg-rose-400' : 'bg-purple-400'
              }`} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-md" />
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg shadow-md" />
          </div>
        </div>
        <div className="absolute -right-3 top-2 w-6 h-16 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 rounded-lg border-2 border-gray-300 shadow-lg" />
      </div>
    </div>
  ),
  
  ReceptionShield: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-cyan-100/20" />
      <div className="relative z-10">
        <div className="w-32 h-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg shadow-lg" />
        <div className="relative -mt-2">
          <div className="w-28 h-20 bg-gradient-to-b from-blue-100 to-blue-200 rounded-t-xl border-4 border-blue-300 shadow-xl" />
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-white rounded-lg border-2 border-blue-400 shadow-inner">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full animate-pulse" />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded shadow-md" />
        </div>
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
          <div className="text-white text-lg">+</div>
        </div>
      </div>
    </div>
  ),
  
  Dispenser: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-teal-100/20" />
      <div className="relative z-10">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-gray-400 to-gray-500 rounded shadow-md" />
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl border border-teal-200/50">
          <div className="w-16 h-20 bg-gradient-to-b from-teal-200 via-teal-300 to-teal-400 rounded-t-lg relative shadow-inner">
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-teal-400 via-teal-500 to-teal-600 rounded-t-lg" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="absolute right-1 w-2 h-0.5 bg-white/80 rounded" 
                   style={{ top: `${(i + 1) * 16}%` }} />
            ))}
            <div className="absolute top-1 left-1 text-xs text-teal-700 font-bold">1L</div>
          </div>
          <div className="w-16 h-4 bg-gradient-to-b from-teal-600 to-teal-700 rounded-b-lg relative shadow-lg">
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-inner" />
          </div>
        </div>
        <div className="absolute right-1 top-8 w-12 h-8 bg-gradient-to-l from-teal-600 to-teal-700 rounded-l-full flex items-center justify-center shadow-lg">
          <div className="text-white text-sm">👋</div>
        </div>
        <div className="absolute -top-4 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <CheckCircle className="w-3 h-3 text-white" />
        </div>
      </div>
    </div>
  ),
  
  MenuLED: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-orange-100/20" />
      <div className="relative z-10">
        <div className="w-20 h-28 bg-white rounded-xl border-4 border-amber-400 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-2 border-2 border-yellow-300 rounded-lg animate-pulse opacity-60" />
          <div className="p-3 space-y-1">
            <div className="h-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded shadow-sm" />
            <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded w-3/4 shadow-sm" />
            <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded w-1/2 shadow-sm" />
            <div className="h-0.5 bg-gray-300 rounded my-2" />
            <div className="space-y-0.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-0.5 bg-gray-600 rounded flex-1 mr-1" />
                  <div className="h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded w-2" />
                </div>
              ))}
            </div>
          </div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse shadow-sm"
                 style={{ 
                   left: i < 4 ? '2px' : 'auto',
                   right: i >= 4 ? '2px' : 'auto',
                   top: `${(i % 4 + 1) * 20}%`,
                   animationDelay: `${i * 0.2}s`
                 }} />
          ))}
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-black rounded shadow-md" />
        <div className="absolute -right-3 bottom-4 w-4 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded shadow-md" />
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <Zap className="w-4 h-4 text-yellow-500 animate-bounce" />
        </div>
      </div>
    </div>
  ),

  // Skrócone wersje pozostałych ikon z ulepszonym designem
  TableSeparator: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
      <div className="flex space-x-4 items-end">
        <div className="relative">
          <div className="w-8 h-6 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t shadow-lg" />
          <div className="w-1 h-8 bg-amber-800 mx-auto shadow-md" />
          <div className="w-6 h-2 bg-amber-800 rounded mx-auto shadow-lg" />
        </div>
        <div className="w-1 h-20 bg-gradient-to-b from-amber-900 to-amber-800 rounded relative shadow-lg">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-700 rounded-full shadow-md" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-700 rounded-full shadow-md" />
        </div>
        <div className="relative">
          <div className="w-8 h-6 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t shadow-lg" />
          <div className="w-1 h-8 bg-amber-800 mx-auto shadow-md" />
          <div className="w-6 h-2 bg-amber-800 rounded mx-auto shadow-lg" />
        </div>
      </div>
    </div>
  ),

  DessertDisplay: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-yellow-50 p-4">
      <div className="relative">
        <div className="w-24 h-16 bg-white/90 rounded-t-3xl border-2 border-gray-300 shadow-xl" />
        <div className="relative -mt-14 space-y-1">
          {[2, 1, 0].map((level) => (
            <div key={level} className="flex justify-center">
              <div className={`bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-lg ${
                level === 0 ? 'w-20 h-4' : level === 1 ? 'w-16 h-4' : 'w-12 h-4'
              }`}>
                <div className="flex space-x-1">
                  <div className={`${level === 0 ? 'w-3 h-3' : 'w-2 h-2'} bg-pink-500 rounded`} />
                  <div className={`${level === 0 ? 'w-3 h-3' : 'w-2 h-2'} bg-yellow-500 rounded`} />
                  {level === 0 && <div className="w-3 h-3 bg-orange-500 rounded" />}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-24 h-3 bg-gradient-to-b from-gray-400 to-gray-500 rounded-b-lg shadow-lg" />
      </div>
    </div>
  ),

  OfficeOrganizer: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="w-6 h-8 bg-gradient-to-b from-blue-200 to-blue-300 rounded-lg border shadow-md flex flex-col justify-center items-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-4 bg-blue-600 rounded shadow-sm" />
          ))}
        </div>
        <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg border shadow-md flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-600 rounded grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-sm" />
            ))}
          </div>
        </div>
        <div className="w-6 h-8 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg border shadow-md flex flex-col space-y-0.5 p-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full h-1 bg-yellow-500 rounded shadow-sm" />
          ))}
        </div>
        <div className="w-6 h-10 bg-gradient-to-b from-white to-gray-100 rounded-lg border shadow-md flex items-center justify-center col-span-2">
          <div className="w-4 h-6 bg-blue-600 rounded shadow-sm" />
        </div>
        <div className="w-6 h-4 bg-gradient-to-br from-green-200 to-green-300 rounded-lg border shadow-md flex items-center justify-center">
          <div className="w-3 h-2 bg-green-600 rounded shadow-sm" />
        </div>
      </div>
    </div>
  ),

  // Pozostałe ikony pozostają bez zmian ale z dodanymi gradientami
  KanbanBoard: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="grid grid-cols-4 gap-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`w-6 h-8 rounded shadow-sm ${
            i % 3 === 0 ? 'bg-gradient-to-b from-purple-400 to-purple-500' : 
            i % 3 === 1 ? 'bg-gradient-to-b from-indigo-400 to-indigo-500' : 
            'bg-gradient-to-b from-blue-400 to-blue-500'
          }`} />
        ))}
      </div>
    </div>
  ),
  
  MachineShield: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="relative">
        <div className="w-20 h-20 text-gray-700">🏭</div>
        <div className="absolute -top-2 -right-2 w-12 h-12 text-blue-600">🛡️</div>
      </div>
    </div>
  ),
  
  PLCEnclosure: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 p-4">
      <div className="relative">
        <div className="bg-gradient-to-b from-gray-300 to-gray-400 p-4 rounded-lg shadow-lg">
          <div className="w-16 h-16 text-green-600">💻</div>
        </div>
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs px-2 py-1 rounded shadow-md">IP65</div>
      </div>
    </div>
  ),
  
  Letters3D: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="relative">
        <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">ABC</div>
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 text-yellow-500 animate-pulse">💡</div>
      </div>
    </div>
  ),
  
  DibondSign: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-800 p-4">
      <div className="relative">
        <div className="w-20 h-20 text-gray-700">🏢</div>
        <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded" />
      </div>
    </div>
  ),
  
  VotingBox: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-b from-gray-200 to-gray-400 rounded-lg shadow-lg" />
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded" />
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 text-blue-600">📬</div>
      </div>
    </div>
  ),
  
  BrochureStand: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="relative">
        <div className="space-y-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-12 h-8 bg-gradient-to-b from-blue-400 to-blue-500 rounded shadow-sm" 
                 style={{ marginLeft: `${i * 4}px` }} />
          ))}
        </div>
      </div>
    </div>
  ),
  
  GiftBox: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-b from-red-400 to-red-500 rounded-lg shadow-lg" />
        <div className="absolute top-0 right-0 text-2xl">🎀</div>
      </div>
    </div>
  )
};

const projects: Project[] = [
  // Beauty & Kosmetyka
  {
    id: '1',
    name: 'Display Lakierów RAINBOW 60',
    category: 'beauty',
    priceRange: '450-650 zł',
    complexity: 'Średnie',
    icon: <ProductIcons.NailDisplay />,
    soldCount: 523,
    rating: 4.8,
    deliveryDays: 3,
    shortDescription: 'Schodkowy ekspozytor na 60 butelek lakieru do paznokci',
    detailedDescription: 'Profesjonalny ekspozytor lakierów w formie schodków, wykonany z wysokiej jakości plexi crystal clear. Idealne rozwiązanie dla salonów kosmetycznych i drogerii. Każdy poziom ma antypoślizgowe rowki zapobiegające zsuwaniu się butelek.',
    features: [
      '6 poziomów ekspozycyjnych',
      '10 miejsc na każdym poziomie', 
      'Antypoślizgowe rowki na każdym stopniu',
      'Możliwość łączenia modułów (stackowanie)',
      'Łatwe czyszczenie i konserwacja'
    ],
    applications: [
      'Salony kosmetyczne i fryzjerskie',
      'Drogerie i perfumerie',
      'Sklepy z kosmetykami',
      'Studia stylizacji paznokci'
    ],
    materials: ['PMMA 5mm crystal clear', 'PMMA 3mm (opcjonalnie)'],
    defaultDimensions: {
      width: 400,
      height: 350,
      depth: 300,
      thickness: 5
    },
    customizable: true,
    bestseller: true,
    calculatorType: 'display'
  },
  {
    id: '15',
    name: 'Organizer Kosmetyków GLAM',
    category: 'beauty',
    priceRange: '320-450 zł',
    complexity: 'Średnie',
    icon: <ProductIcons.CosmeticsOrganizer />,
    soldCount: 234,
    rating: 4.7,
    deliveryDays: 3,
    shortDescription: 'Luksusowy organizer kosmetyków z lustrem',
    detailedDescription: 'Elegancki organizer kosmetyków z lustrzanym tłem i wieloma przegródkami różnej wielkości. Idealny do przechowywania kosmetyków, pędzli i akcesoriów. Wyposażony w 3 szufladki na mniejsze przedmioty.',
    features: [
      '24 przegródki różnej wielkości',
      'Lustro akrylowe w zestawie',
      '3 wysuwnęe szufladki',
      'Antypoślizgowe nóżki',
      'Możliwość personalizacji grawerem'
    ],
    applications: [
      'Toaletki domowe',
      'Salony kosmetyczne',
      'Studia makijażu',
      'Pokoje hotelowe - premium'
    ],
    materials: ['PMMA 3mm satynowa', 'Lustro akrylowe 2mm'],
    defaultDimensions: {
      width: 300,
      height: 250,
      depth: 200,
      thickness: 3
    },
    customizable: true,
    calculatorType: 'organizer'
  },
  
  // Medycyna
  {
    id: '2',
    name: 'Osłona Recepcji MEDICAL',
    category: 'medical',
    priceRange: '380-550 zł',
    complexity: 'Złożone',
    icon: <ProductIcons.ReceptionShield />,
    soldCount: 156,
    rating: 4.9,
    deliveryDays: 5,
    shortDescription: 'Profesjonalna osłona ochronna dla recepcji medycznych',
    detailedDescription: 'Specjalistyczna osłona recepcji zaprojektowana dla placówek medycznych. Wyposażona w praktyczne okienko podawcze 30x20cm oraz półkę na dokumenty. Stabilne nóżki zapewniają pewne ustawienie na ladzie.',
    features: [
      'Okienko podawcze 30x20cm',
      'Wbudowana półka na dokumenty',
      'Stabilne nóżki antypoślizgowe',
      'Zaokrąglone krawędzie (bezpieczeństwo)',
      'Łatwa dezynfekcja powierzchni'
    ],
    applications: [
      'Przychodnie i kliniki',
      'Apteki i punkty szczepień',
      'Laboratoria medyczne',
      'Gabinety lekarskie'
    ],
    materials: ['PMMA 5mm crystal clear', 'PETG 4mm (opcja bezpieczna)'],
    defaultDimensions: {
      width: 1200,
      height: 800,
      depth: 300,
      thickness: 5
    },
    customizable: true,
    calculatorType: 'shield'
  },
  {
    id: '6',
    name: 'Dystrybutor Płynu TOUCH-FREE',
    category: 'medical',
    priceRange: '150-220 zł',
    complexity: 'Proste',
    icon: <ProductIcons.Dispenser />,
    soldCount: 678,
    rating: 4.9,
    deliveryDays: 2,
    shortDescription: 'Bezdotykowy dystrybutor na łokieć z pojemnikiem 1L',
    detailedDescription: 'Higieniczny dystrybutor płynu dezynfekującego aktywowany łokciem. Pojemność 1 litr zapewnia długotrwałe użytkowanie. Idealny do miejsc publicznych i placówek medycznych. Możliwość umieszczenia logo firmowego.',
    features: [
      'Mechanizm aktywacji łokciem',
      'Pojemność zbiornika 1 litr',
      'Dozowanie porcyjne (3-5ml)',
      'Mocowanie ścienne w zestawie',
      'Grawer logo w cenie'
    ],
    applications: [
      'Szpitale i przychodnie',
      'Szkoły i urzędy',
      'Sklepy i restauracje',
      'Miejsca publiczne'
    ],
    materials: ['PMMA 3mm', 'PETG 3mm', 'Elementy mocujące'],
    defaultDimensions: {
      width: 150,
      height: 400,
      depth: 150,
      thickness: 3
    },
    customizable: true,
    bestseller: true,
    calculatorType: 'standard'
  },
  
  // Gastronomia
  {
    id: '3',
    name: 'Menu LED Gastro PRO',
    category: 'gastro',
    priceRange: '280-380 zł',
    complexity: 'Średnie',
    icon: <ProductIcons.MenuLED />,
    soldCount: 89,
    rating: 4.7,
    deliveryDays: 4,
    shortDescription: 'Podświetlane menu LED w formacie A4',
    detailedDescription: 'Eleganckie podświetlane menu LED dedykowane dla restauracji i kawiarni. Wymienne wkładki pozwalają na łatwą aktualizację oferty. Równomierne podświetlenie LED zapewnia doskonałą czytelność.',
    features: [
      'Podświetlenie LED strip',
      'Wymienne wkładki A4',
      'Włącznik dotykowy',
      'Zasilanie 12V (adapter w zestawie)',
      'Możliwość łączenia w panele'
    ],
    applications: [
      'Restauracje i kawiarnie',
      'Bary i puby',
      'Hotele - recepcje',
      'Fast foody'
    ],
    materials: ['PMMA 5mm opal', 'LED strip 12V', 'Zasilacz'],
    defaultDimensions: {
      width: 210,
      height: 297,
      depth: 25,
      thickness: 5
    },
    customizable: true,
    calculatorType: 'signage'
  },
  {
    id: '5',
    name: 'Separator Stolików ELEGANT',
    category: 'gastro',
    priceRange: '230-350 zł',
    complexity: 'Proste',
    icon: <ProductIcons.TableSeparator />,
    soldCount: 312,
    rating: 4.8,
    deliveryDays: 2,
    shortDescription: 'Elegancki separator przestrzeni między stolikami',
    detailedDescription: 'Transparentny separator stolików wykonany z grubego plexi. Dostępny w trzech rozmiarach standardowych. Stabilna podstawa zapewnia bezpieczne ustawienie. Łatwy montaż bez narzędzi.',
    features: [
      'Stabilna podstawa chromowana',
      '3 rozmiary standardowe',
      'Montaż bez użycia narzędzi',
      'Transparentne plexi 8mm',
      'Zaokrąglone narożniki'
    ],
    applications: [
      'Restauracje fine dining',
      'Kawiarnie i bistro',
      'Hotele - restauracje',
      'Catering i eventy'
    ],
    materials: ['PMMA 8mm crystal clear', 'Podstawa metalowa'],
    defaultDimensions: {
      width: 1200,
      height: 600,
      depth: 200,
      thickness: 8
    },
    customizable: false,
    calculatorType: 'standard'
  }
];

const categories = [
  { id: 'all', name: 'Wszystkie', icon: '🏪', count: projects.length },
  { id: 'medical', name: 'Medycyna', icon: '🏥', count: projects.filter(p => p.category === 'medical').length },
  { id: 'gastro', name: 'Gastronomia', icon: '🍽️', count: projects.filter(p => p.category === 'gastro').length },
  { id: 'beauty', name: 'Beauty', icon: '💄', count: projects.filter(p => p.category === 'beauty').length },
  { id: 'office', name: 'Biuro', icon: '🏢', count: projects.filter(p => p.category === 'office').length },
  { id: 'industry', name: 'Przemysł', icon: '🏭', count: projects.filter(p => p.category === 'industry').length },
  { id: 'advertising', name: 'Reklama', icon: '📢', count: projects.filter(p => p.category === 'advertising').length },
  { id: 'universal', name: 'Uniwersalne', icon: '🎯', count: projects.filter(p => p.category === 'universal').length }
];

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.applications.some(app => app.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesComplexity = selectedComplexity === 'all' || project.complexity === selectedComplexity;
    return matchesCategory && matchesSearch && matchesComplexity;
  });

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const goToCalculator = (project: Project) => {
    // Zapisz dane w localStorage aby kalkulator mógł je odczytać
    const calculatorData = {
      productType: project.calculatorType,
      name: project.name,
      dimensions: project.defaultDimensions,
      materials: project.materials,
      description: project.detailedDescription,
      features: project.features,
      complexity: project.complexity
    };
    
    localStorage.setItem('calculatorPreset', JSON.stringify(calculatorData));
    
    // Prawdziwe przekierowanie do kalkulatora
    navigate('/calculator');
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Proste': return 'text-emerald-400 bg-emerald-900/30 border-emerald-500/30';
      case 'Średnie': return 'text-amber-400 bg-amber-900/30 border-amber-500/30';
      case 'Złożone': return 'text-red-400 bg-red-900/30 border-red-500/30';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-violet-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              🏪 Gotowe Projekty
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Profesjonalne rozwiązania z gotowymi specyfikacjami technicznymi
              <br />
              <span className="text-sm opacity-75">Kliknij w projekt aby przejść do kalkulatora z wypełnionymi danymi</span>
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-purple-300 w-6 h-6" />
            <input
              type="text"
              placeholder="Szukaj po nazwie, zastosowaniu lub branży..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white placeholder-purple-200 border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-lg"
            />
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-zinc-800/50 backdrop-blur-xl border-b border-zinc-700/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-xl shadow-purple-500/25 scale-105'
                      : 'bg-zinc-700/50 text-gray-300 hover:bg-zinc-600/50 hover:text-white border border-zinc-600/50'
                  }`}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-semibold">{category.count}</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-zinc-700/50 text-gray-300 rounded-xl hover:bg-zinc-600/50 transition-all border border-zinc-600/50"
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filtry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Bar */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: TrendingUp, label: 'Łącznie realizacji', value: '3,847', color: 'emerald' },
            { icon: Star, label: 'Średnia ocena', value: '4.8/5.0', color: 'amber' },
            { icon: Clock, label: 'Śr. czas realizacji', value: '3-5 dni', color: 'blue' },
            { icon: Package, label: 'Aktywnych wzorów', value: filteredProjects.length.toString(), color: 'purple' }
          ].map((stat, index) => (
            <div key={index} className="bg-zinc-800/50 backdrop-blur-xl p-6 rounded-2xl border border-zinc-700/50 hover:border-zinc-600/50 transition-all">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  stat.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                  stat.color === 'amber' ? 'from-amber-500 to-amber-600' :
                  stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  'from-purple-500 to-purple-600'
                } shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters (if shown) */}
        {showFilters && (
          <div className="mb-12 bg-zinc-800/50 backdrop-blur-xl p-8 rounded-2xl border border-zinc-700/50">
            <h3 className="text-white font-bold text-xl mb-6">Filtry zaawansowane</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <label className="text-gray-400 text-sm font-medium mb-3 block">Stopień złożoności</label>
                <select 
                  value={selectedComplexity}
                  onChange={(e) => setSelectedComplexity(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-700/50 text-white rounded-xl border border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Wszystkie</option>
                  <option value="Proste">Proste</option>
                  <option value="Średnie">Średnie</option>
                  <option value="Złożone">Złożone</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm font-medium mb-3 block">Czas realizacji</label>
                <select className="w-full px-4 py-3 bg-zinc-700/50 text-white rounded-xl border border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Dowolny</option>
                  <option>Do 2 dni</option>
                  <option>Do 5 dni</option>
                  <option>Do 7 dni</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm font-medium mb-3 block">Sortuj po</label>
                <select className="w-full px-4 py-3 bg-zinc-700/50 text-white rounded-xl border border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Popularności</option>
                  <option>Alfabetycznie</option>
                  <option>Czasie realizacji</option>
                  <option>Ocenie klientów</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div key={project.id} className="group bg-zinc-800/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
              {/* Image/Icon */}
              <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                {project.icon}
                {project.bestseller && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center shadow-xl animate-pulse">
                    <Award className="w-3 h-3 mr-1" />
                    BESTSELLER
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(project.id)}
                  className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all group-hover:scale-110"
                >
                  <Heart 
                    className={`w-5 h-5 transition-all ${
                      favorites.includes(project.id) 
                        ? 'fill-red-500 text-red-500 scale-110' 
                        : 'text-white hover:text-red-400'
                    }`} 
                  />
                </button>
                
                {/* Complexity badge */}
                <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-full text-xs font-bold border ${getComplexityColor(project.complexity)} backdrop-blur-sm`}>
                  {project.complexity}
                </div>
                
                {/* Rating */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-white text-sm font-bold">{project.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-4">
                  <h3 className="text-white font-bold text-xl leading-tight mb-2 group-hover:text-purple-200 transition-colors">{project.name}</h3>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {project.priceRange}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">({project.soldCount} realizacji)</span>
                </div>

                {/* Short Description */}
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">{project.shortDescription}</p>

                {/* Key Features */}
                <div className="mb-6">
                  <p className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">Kluczowe cechy</p>
                  <div className="space-y-2">
                    {project.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applications */}
                <div className="mb-6">
                  <p className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">Zastosowania</p>
                  <div className="flex flex-wrap gap-2">
                    {project.applications.slice(0, 2).map((app, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-900/30 border border-blue-700/30 text-blue-300 text-xs rounded-lg font-medium">
                        {app}
                      </span>
                    ))}
                    {project.applications.length > 2 && (
                      <span className="px-3 py-1 bg-gray-700/50 border border-gray-600/50 text-gray-400 text-xs rounded-lg">
                        +{project.applications.length - 2} więcej
                      </span>
                    )}
                  </div>
                </div>

                {/* Materials & Dimensions */}
                <div className="mb-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-700/30">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Layers className="w-4 h-4" />
                        <span className="font-medium">Materiał</span>
                      </div>
                      <p className="text-blue-300 font-medium">{project.materials[0]}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Ruler className="w-4 h-4" />
                        <span className="font-medium">Wymiary</span>
                      </div>
                      <p className="text-emerald-300 font-medium">
                        {project.defaultDimensions.width}×{project.defaultDimensions.height}×{project.defaultDimensions.depth}mm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Time & Customization */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">Realizacja: {project.deliveryDays} dni</span>
                  </div>
                  {project.customizable && (
                    <span className="text-xs text-purple-400 bg-purple-900/30 border border-purple-700/30 px-3 py-1 rounded-lg font-medium">
                      Personalizacja ✨
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button 
                    onClick={() => goToCalculator(project)}
                    className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-700 hover:via-violet-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center font-bold shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 group"
                  >
                    <Calculator className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                    Przejdź do kalkulatora
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-zinc-700/50 text-gray-300 py-3 px-4 rounded-xl hover:bg-zinc-600/50 hover:text-white transition-all flex items-center justify-center border border-zinc-600/50">
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="font-medium">Szczegóły</span>
                    </button>
                    <button className="bg-zinc-700/50 text-gray-300 py-3 px-4 rounded-xl hover:bg-zinc-600/50 hover:text-white transition-all flex items-center justify-center border border-zinc-600/50">
                      <Edit className="w-4 h-4 mr-2" />
                      <span className="font-medium">Dostosuj</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-400 text-xl mb-4">Nie znaleziono projektów spełniających kryteria</p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                setSelectedComplexity('all');
              }}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Wyczyść wszystkie filtry →
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-purple-900/50 via-violet-900/50 to-indigo-900/50 backdrop-blur-xl rounded-3xl p-12 text-center border border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-4xl font-bold text-white mb-6">
              Potrzebujesz projektu na wymiar?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              Nasz zespół inżynierów przygotuje dla Ciebie dedykowany projekt z pełną dokumentacją techniczną i specyfikacją materiałów.
            </p>
            <button className="bg-white text-purple-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105">
              Zapytaj o projekt indywidualny →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;