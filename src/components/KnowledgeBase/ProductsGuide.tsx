import React from 'react';
import { MessageSquare, ShieldCheck, Settings, Palette, Package, Cpu } from 'lucide-react';

const ProductsGuide: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">Rozszerzone Kompendium Produktów</h1>
        <p className="text-xl">Poznaj możliwości Plexisystem</p>
      </div>

      {/* Galeria inspiracji */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Galeria Inspiracji</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 italic">Zdjęcie realizacji {num}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Katalog produktów */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Katalog Produktów</h2>

        {/* Reklama i Identyfikacja Wizualna */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-blue-700 border-b-2 border-gray-300 pb-3 mb-6">
            Reklama i Identyfikacja Wizualna
          </h3>

          <div className="space-y-8">
            {/* Szyldy i Tablice */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="text-center">
                <MessageSquare className="w-20 h-20 text-blue-700 mx-auto mb-4" />
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xl font-bold text-blue-900 mb-3">Szyldy i Tablice Reklamowe</h4>
                <p className="text-gray-700 mb-4">
                  Wycinane w dowolnym kształcie, grawerowane lub z grafiką. Idealne do oznakowania biur, 
                  sklepów i budynków. Najczęściej wykonujemy je z Dibondu (trwałość na zewnątrz) 
                  lub PCV (opcja ekonomiczna).
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm">
                    <strong className="text-blue-700">Case Study:</strong> Dla lokalnej kancelarii prawnej 
                    wykonaliśmy elegancki szyld z czarnego, szczotkowanego Dibondu z frezowanymi literami, 
                    co podkreśliło prestiż i profesjonalizm firmy.
                  </p>
                </div>
              </div>
            </div>

            {/* Litery 3D */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-700 mx-auto">ABC</div>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xl font-bold text-blue-900 mb-3">Litery i Znaki 3D</h4>
                <p className="text-gray-700 mb-4">
                  Efektowne litery przestrzenne, które wyróżnią każdą markę. Mogą być podświetlane 
                  od tyłu (efekt halo). Używamy plexi na lico dla uzyskania głębi koloru i PCV 
                  na boki i tył.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm">
                    <strong className="text-blue-700">Case Study:</strong> Dla nowej kawiarni stworzyliśmy 
                    podświetlany napis "COFFEE" z białej plexi. Po zmroku napis tworzy ciepłą, 
                    zachęcającą poświatę, która przyciąga klientów.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Przemysł i Technika */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-blue-700 border-b-2 border-gray-300 pb-3 mb-6">
            Przemysł i Technika
          </h3>

          <div className="space-y-8">
            {/* Osłony do maszyn */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="text-center">
                <ShieldCheck className="w-20 h-20 text-blue-700 mx-auto mb-4" />
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xl font-bold text-blue-900 mb-3">Osłony do Maszyn</h4>
                <p className="text-gray-700 mb-4">
                  Trwałe i odporne na uderzenia osłony zapewniające bezpieczeństwo operatorów. 
                  Standardem jest tu poliwęglan lity (PC) ze względu na jego ekstremalną wytrzymałość. 
                  PETG jest alternatywą przy kontakcie z chemią.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm">
                    <strong className="text-blue-700">Case Study:</strong> Dla zakładu produkcyjnego 
                    dostarczyliśmy komplet osłon do nowej linii montażowej. Wykonane z PC o grubości 8mm, 
                    chronią pracowników przed odpryskami, nie ograniczając widoczności.
                  </p>
                </div>
              </div>
            </div>

            {/* Elementy konstrukcyjne */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="text-center">
                <Settings className="w-20 h-20 text-blue-700 mx-auto mb-4" />
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xl font-bold text-blue-900 mb-3">Elementy Konstrukcyjne i Prototypy</h4>
                <p className="text-gray-700 mb-4">
                  Precyzyjnie wykonane części maszyn, obudowy urządzeń oraz funkcjonalne prototypy. 
                  Tekstolit i polipropylen (PP) są idealne na elementy ślizgowe i konstrukcyjne.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm">
                    <strong className="text-blue-700">Case Study:</strong> Dla startupu technologicznego 
                    wykonaliśmy serię prototypów obudowy do urządzenia IoT z frezowanego HIPS, 
                    co pozwoliło im na szybkie testy i prezentację produktu inwestorom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dodatkowe kategorie */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <Palette className="w-12 h-12 text-blue-700 mb-4" />
            <h4 className="text-lg font-bold text-blue-900 mb-2">Dekoracje i Wystrój Wnętrz</h4>
            <p className="text-sm text-gray-600">
              Panele ścienne, przegrody, elementy mebli, tablice informacyjne
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <Package className="w-12 h-12 text-blue-700 mb-4" />
            <h4 className="text-lg font-bold text-blue-900 mb-2">Opakowania i Displayе</h4>
            <p className="text-sm text-gray-600">
              Stojaki POS, ekspozytory, pudełka prezentowe, organizery
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <Cpu className="w-12 h-12 text-blue-700 mb-4" />
            <h4 className="text-lg font-bold text-blue-900 mb-2">Elektronika i Technika</h4>
            <p className="text-sm text-gray-600">
              Obudowy urządzeń, panele czołowe, podstawki, uchwyty
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsGuide;
