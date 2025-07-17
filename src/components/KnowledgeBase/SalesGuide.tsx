import React from 'react';
import { HelpCircle, DollarSign, AlertTriangle, CheckCircle, Shield, MessageSquare, TrendingUp, Lightbulb } from 'lucide-react';

const SalesGuide: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-orange-900 to-orange-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">Przewodnik Handlowca v4.0</h1>
        <p className="text-xl">Kompletny przewodnik sprzedaży i wyceny</p>
      </div>

      {/* Osłony do maszyn */}
      <section className="mb-12">
        <div className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 flex items-center gap-4">
            <Shield className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Produkt: Osłony do Maszyn</h2>
              <p className="text-blue-200">Kluczowy element bezpieczeństwa w przemyśle</p>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-300 mb-6">
              <strong>Opis:</strong> Chroni operatorów przed odpryskami, ruchomymi częściami maszyn i innymi zagrożeniami, 
              jednocześnie zapewniając dobrą widoczność pola roboczego.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Pytania kontrolne */}
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
                <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Pytania Kontrolne dla Klienta
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Jakie jest główne zagrożenie (uderzenia, chemia, temperatura)?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Czy wymagana jest idealna przezroczystość?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Czy osłona będzie miała kontakt z żywnością? (Jeśli tak → PETG)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Jaki jest przewidziany budżet?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Czy potrzebne są otwory montażowe lub gięcia?</span>
                  </li>
                </ul>
              </div>

              {/* Pułapki cenowe */}
              <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6">
                <h4 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pułapki i Wskazówki do Wyceny
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span><strong>Poliwęglan jest drogi w obróbce!</strong> Wymaga wolniejszych posuwów i specjalnych frezów. Dolicz +20-30% do czasu pracy maszyny.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Gięcie poliwęglanu na zimno jest możliwe, ale na gorąco wymaga suszenia. To dodatkowy koszt.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>PETG może się topić przy frezowaniu. Wyceniaj ostrożnie, zakładając wolniejszą pracę niż przy plexi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Zawsze doliczaj koszt materiału na testy parametrów.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Rekomendacje materiałowe */}
            <h3 className="text-xl font-bold text-white mb-4">Rekomendacje Materiałowe</h3>
            
            <div className="space-y-4">
              {/* Poliwęglan */}
              <div className="bg-zinc-700 rounded-lg p-6 hover:bg-zinc-600 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-blue-400">1. Poliwęglan Lity (PC) - Opcja "Twierdza"</h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400">Wytrzymałość: <span className="text-yellow-400">★★★★★</span></span>
                    <span className="text-gray-400">Cena: <span className="text-yellow-400">★☆☆☆☆</span></span>
                  </div>
                </div>
                <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-gray-300">
                    <strong className="text-blue-400">Argument sprzedażowy:</strong> "To jest najbezpieczniejsze rozwiązanie na rynku. 
                    Poliwęglan jest praktycznie niezniszczalny, zapewni pełną ochronę operatorom. To inwestycja w spokój i bezpieczeństwo."
                  </p>
                </div>
              </div>

              {/* PETG */}
              <div className="bg-zinc-700 rounded-lg p-6 hover:bg-zinc-600 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-green-400">2. PETG - Opcja "Uniwersalna"</h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400">Wytrzymałość: <span className="text-yellow-400">★★★★☆</span></span>
                    <span className="text-gray-400">Cena: <span className="text-yellow-400">★★★☆☆</span></span>
                  </div>
                </div>
                <div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-gray-300">
                    <strong className="text-green-400">Argument sprzedażowy:</strong> "PETG to świetny kompromis między wytrzymałością a ceną. 
                    Jest znacznie mocniejszy od plexi, a dodatkowo ma atest do kontaktu z żywnością i lepszą odporność chemiczną."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Szyldy i litery 3D */}
      <section className="mb-12">
        <div className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 flex items-center gap-4">
            <MessageSquare className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Produkt: Szyldy, Kasetony i Litery 3D</h2>
              <p className="text-purple-200">Podstawa identyfikacji wizualnej firmy</p>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-300 mb-6">
              <strong>Opis:</strong> Od prostych tablic po skomplikowane, podświetlane litery przestrzenne. 
              Muszą być estetyczne i odporne na warunki atmosferyczne.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Pytania kontrolne */}
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
                <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Pytania Kontrolne dla Klienta
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Czy szyld będzie na zewnątrz czy wewnątrz?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Czy ma być podświetlany? (LED, neon, światło odbite)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Jaka jest maksymalna dostępna przestrzeń?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Czy są wymagania co do kolorystyki (RAL, Pantone)?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Czy potrzebny jest montaż?</span>
                  </li>
                </ul>
              </div>

              {/* Wskazówki cenowe */}
              <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6">
                <h4 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Wskazówki do Zwiększenia Marży
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Proponuj podświetlenie LED - marża na elektronice +40%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Oferuj projekt graficzny jako pakiet - dodatkowe 500-1500 zł</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Montaż własną ekipą = kontrola jakości + dodatkowa marża</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Kontrakt serwisowy na czyszczenie i konserwację</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Rekomendacje materiałowe */}
            <h3 className="text-xl font-bold text-white mb-4">Rekomendacje Materiałowe</h3>
            
            <div className="space-y-4">
              {/* Dibond */}
              <div className="bg-zinc-700 rounded-lg p-6 hover:bg-zinc-600 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-purple-400">1. Dibond - Na tła i szyldy płaskie</h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400">Estetyka: <span className="text-yellow-400">★★★★★</span></span>
                    <span className="text-gray-400">Trwałość: <span className="text-yellow-400">★★★★★</span></span>
                  </div>
                </div>
                <div className="bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded">
                  <p className="text-gray-300">
                    <strong className="text-purple-400">Argument sprzedażowy:</strong> "Wybierając Dibond, inwestuje Pan w prestiż i spokój na lata. 
                    Materiał jest sztywny, nie odkształca się i jest w pełni odporny na deszcz czy słońce."
                  </p>
                </div>
              </div>

              {/* Plexi */}
              <div className="bg-zinc-700 rounded-lg p-6 hover:bg-zinc-600 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-pink-400">2. Plexi (PMMA) - Na fronty liter i elementy świecące</h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400">Estetyka: <span className="text-yellow-400">★★★★★</span></span>
                    <span className="text-gray-400">Przep. światła: <span className="text-yellow-400">★★★★★</span></span>
                  </div>
                </div>
                <div className="bg-pink-900/30 border-l-4 border-pink-500 p-4 rounded">
                  <p className="text-gray-300">
                    <strong className="text-pink-400">Argument sprzedażowy:</strong> "Fronty liter wykonujemy z plexi, ponieważ żaden inny materiał 
                    nie daje takiej głębi i soczystości koloru. Przy podświetleniu uzyskujemy idealnie równomierną, elegancką poświatę."
                  </p>
                </div>
              </div>

              {/* PCV Spienione */}
              <div className="bg-zinc-700 rounded-lg p-6 hover:bg-zinc-600 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-yellow-400">3. PCV Spienione - Na "plecy" i elementy budżetowe</h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400">Lekkość: <span className="text-yellow-400">★★★★★</span></span>
                    <span className="text-gray-400">Cena: <span className="text-yellow-400">★★★★★</span></span>
                  </div>
                </div>
                <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="text-gray-300">
                    <strong className="text-yellow-400">Argument sprzedażowy:</strong> "Tył liter wykonujemy z lekkiego PCV, co obniża wagę 
                    całej reklamy i ułatwia montaż, jednocześnie redukując koszty bez utraty jakości widocznej części."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Techniki sprzedażowe */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Złote Zasady Sprzedaży</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-green-300 text-4xl mb-4">1.</div>
              <h3 className="text-xl font-bold text-white mb-3">Zawsze oferuj 3 opcje</h3>
              <p className="text-green-100">
                Budżetowa, optymalna i premium. Większość klientów wybiera środkową - 
                zaplanuj marże odpowiednio.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-green-300 text-4xl mb-4">2.</div>
              <h3 className="text-xl font-bold text-white mb-3">Sprzedawaj wartość, nie cenę</h3>
              <p className="text-green-100">
                "Ten materiał posłuży Panu 10 lat, co daje koszt tylko X zł miesięcznie" 
                brzmi lepiej niż sama cena.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-green-300 text-4xl mb-4">3.</div>
              <h3 className="text-xl font-bold text-white mb-3">Buduj pakiety</h3>
              <p className="text-green-100">
                Projekt + produkcja + montaż + serwis = wyższa marża i zadowolony klient 
                z kompleksową obsługą.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesGuide;
