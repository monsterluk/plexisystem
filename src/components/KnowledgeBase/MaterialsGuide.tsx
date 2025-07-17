import React from 'react';
import { Star, Layers, Shield, Sun, FlaskConical, Thermometer } from 'lucide-react';

const MaterialsGuide: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 inline ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">Rozszerzone Kompendium Tworzyw</h1>
        <p className="text-xl">Profesjonalny przewodnik po materiałach</p>
      </div>

      {/* Szybkie porównanie */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Szybkie Porównanie Materiałów</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Cecha / Materiał</th>
                <th className="px-4 py-3 text-center">PMMA (Plexi)</th>
                <th className="px-4 py-3 text-center">PETG</th>
                <th className="px-4 py-3 text-center">PC Lity</th>
                <th className="px-4 py-3 text-center">PCV Spienione</th>
                <th className="px-4 py-3 text-center">Dibond</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">Odporność na uderzenia</td>
                <td className="px-4 py-3 text-center">{renderStars(2)}</td>
                <td className="px-4 py-3 text-center">{renderStars(4)}</td>
                <td className="px-4 py-3 text-center">{renderStars(5)}</td>
                <td className="px-4 py-3 text-center">{renderStars(1)}</td>
                <td className="px-4 py-3 text-center">{renderStars(4)}</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">Przezroczystość</td>
                <td className="px-4 py-3 text-center">{renderStars(5)}</td>
                <td className="px-4 py-3 text-center">{renderStars(4)}</td>
                <td className="px-4 py-3 text-center">{renderStars(4)}</td>
                <td className="px-4 py-3 text-center">Brak</td>
                <td className="px-4 py-3 text-center">Brak</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">Odporność na zarysowania</td>
                <td className="px-4 py-3 text-center">{renderStars(3)}</td>
                <td className="px-4 py-3 text-center">{renderStars(2)}</td>
                <td className="px-4 py-3 text-center">{renderStars(1)}</td>
                <td className="px-4 py-3 text-center">{renderStars(1)}</td>
                <td className="px-4 py-3 text-center">{renderStars(3)}</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">Łatwość obróbki (Frezowanie)</td>
                <td className="px-4 py-3 text-center">{renderStars(5)}</td>
                <td className="px-4 py-3 text-center">{renderStars(3)}</td>
                <td className="px-4 py-3 text-center">{renderStars(2)}</td>
                <td className="px-4 py-3 text-center">{renderStars(5)}</td>
                <td className="px-4 py-3 text-center">{renderStars(4)}</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">Odporność na UV</td>
                <td className="px-4 py-3 text-center">{renderStars(5)}</td>
                <td className="px-4 py-3 text-center">{renderStars(2)}</td>
                <td className="px-4 py-3 text-center">{renderStars(4)}</td>
                <td className="px-4 py-3 text-center">{renderStars(2)}</td>
                <td className="px-4 py-3 text-center">{renderStars(5)}</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">Waga</td>
                <td className="px-4 py-3 text-center">Niska</td>
                <td className="px-4 py-3 text-center">Niska</td>
                <td className="px-4 py-3 text-center">Niska</td>
                <td className="px-4 py-3 text-center">Bardzo niska</td>
                <td className="px-4 py-3 text-center">Bardzo niska</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Katalog tworzyw */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Katalog Tworzyw</h2>

        {/* PMMA (Plexi) */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-700">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">PMMA (Plexi / Szkło akrylowe)</h3>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-700" />
              <span className="text-sm">Przezroczystość</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-6 h-6 text-blue-700" />
              <span className="text-sm">Odporność UV</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-blue-500 rounded"></div>
              <span className="text-sm">Wiele kolorów</span>
            </div>
          </div>

          <p className="mb-4 text-gray-700">
            Najpopularniejsze tworzywo, znane z doskonałej przezroczystości i łatwości obróbki. 
            Występuje w wersji wylewanej (GS) - lepszej do frezowania i grawerowania, 
            oraz ekstrudowanej (XT) - idealnej do termoformowania.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Zalety
              </h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✓ Wysoka przezroczystość (do 92%)</li>
                <li>✓ Naturalna odporność na UV</li>
                <li>✓ Niska waga</li>
                <li>✓ Łatwość obróbki i klejenia</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-bold text-red-800 mb-2">Wady</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✗ Niska odporność na zarysowania</li>
                <li>✗ Kruchość w porównaniu do PC</li>
                <li>✗ Ograniczona odporność chemiczna</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <strong className="text-blue-900">Najlepszy wybór do:</strong>
            <p className="text-sm mt-1">
              Szyldów, gablot, displayów reklamowych, barier ochronnych, przeszkleń, 
              elementów dekoracyjnych, statuetek.
            </p>
          </div>
        </div>

        {/* PETG */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-700">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">PETG (Politereftalan etylenu z glikolem)</h3>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-700" />
              <span className="text-sm">Wysoka udarność</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-blue-700" />
              <span className="text-sm">Termoformowanie</span>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-blue-700" />
              <span className="text-sm">Odporność chemiczna</span>
            </div>
          </div>

          <p className="mb-4 text-gray-700">
            Materiał o wysokiej udarności i dobrej odporności chemicznej. 
            Łączy zalety plexi (łatwość formowania) i poliwęglanu (wytrzymałość). 
            Posiada atesty do kontaktu z żywnością.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Zalety
              </h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✓ Bardzo wysoka odporność na uderzenia</li>
                <li>✓ Doskonały do termoformowania</li>
                <li>✓ Dobra odporność chemiczna</li>
                <li>✓ Atest do kontaktu z żywnością</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-bold text-red-800 mb-2">Wady</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✗ Mniejsza odporność na zarysowania</li>
                <li>✗ Wrażliwość na UV (bez dodatków)</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <strong className="text-blue-900">Najlepszy wybór do:</strong>
            <p className="text-sm mt-1">
              Osłon maszyn, pojemników na żywność, displayów POS, elementów formowanych próżniowo.
            </p>
          </div>
        </div>

        {/* PC Lity */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-700">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">PC Lity (Poliwęglan Lity)</h3>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-700" />
              <span className="text-sm">Ekstremalna udarność</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-blue-700" />
              <span className="text-sm">Szeroki zakres temp.</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-700" />
              <span className="text-sm">Szyby bezpieczne</span>
            </div>
          </div>

          <p className="mb-4 text-gray-700">
            Niezwykle wytrzymałe tworzywo, praktycznie "niezniszczalne". 
            Charakteryzuje się 25-krotnie większą odpornością na uderzenia niż plexi. 
            Stosowany tam, gdzie bezpieczeństwo jest priorytetem.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Zalety
              </h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✓ Ekstremalna odporność na uderzenia</li>
                <li>✓ Praca w temp. -40°C do +120°C</li>
                <li>✓ Dobre właściwości izolacyjne</li>
                <li>✓ Wysoka klasa palności</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-bold text-red-800 mb-2">Wady</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✗ Niska odporność na zarysowania</li>
                <li>✗ Trudniejszy w obróbce</li>
                <li>✗ Niska odporność chemiczna</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <strong className="text-blue-900">Najlepszy wybór do:</strong>
            <p className="text-sm mt-1">
              Osłon maszyn przemysłowych, szyb bezpiecznych, świetlików dachowych, elementów kasków.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaterialsGuide;
