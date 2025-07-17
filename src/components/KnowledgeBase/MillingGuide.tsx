import React from 'react';
import { AlertCircle, CheckCircle, Info, Wrench } from 'lucide-react';

const MillingGuide: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">Rozszerzona Instrukcja Frezowania</h1>
        <p className="text-xl">Kompendium wiedzy technicznej</p>
      </div>

      {/* Dobierz frez do zadania */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Dobierz Frez do Zadania</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-700">
            <Wrench className="w-12 h-12 text-blue-700 mb-4 mx-auto" />
            <h3 className="text-lg font-bold text-blue-900 mb-2">Frez 1-ostrzowy (do tworzyw)</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Idealny do:</strong> Plexi, PCV, PETG, HIPS
            </p>
            <p className="text-sm text-gray-600">
              <strong>Zalety:</strong> Doskonałe odprowadzanie wióra, minimalizuje topienie materiału, daje gładką krawędź.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-700">
            <Wrench className="w-12 h-12 text-blue-700 mb-4 mx-auto" />
            <h3 className="text-lg font-bold text-blue-900 mb-2">Frez 2/3-ostrzowy (do drewna)</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Idealny do:</strong> MDF, sklejka, drewno lite
            </p>
            <p className="text-sm text-gray-600">
              <strong>Zalety:</strong> Większa szybkość posuwu, dobra jakość wykończenia przy materiałach drewnopochodnych.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-700">
            <Wrench className="w-12 h-12 text-blue-700 mb-4 mx-auto" />
            <h3 className="text-lg font-bold text-blue-900 mb-2">Frez Kompresyjny</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Idealny do:</strong> Płyta meblowa, sklejka, Dibond
            </p>
            <p className="text-sm text-gray-600">
              <strong>Zalety:</strong> Eliminuje wyrwania na górnej i dolnej krawędzi laminatu. Niezbędny przy formatowaniu.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-700">
            <Wrench className="w-12 h-12 text-blue-700 mb-4 mx-auto" />
            <h3 className="text-lg font-bold text-blue-900 mb-2">Frez Grawerski (V-bit)</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Idealny do:</strong> Grawerowanie liter, logotypów, fazowanie
            </p>
            <p className="text-sm text-gray-600">
              <strong>Zalety:</strong> Pozwala uzyskać ostre, precyzyjne detale w grawerach. Różne kąty dla różnych efektów.
            </p>
          </div>
        </div>
      </section>

      {/* Parametry frezowania */}
      <section className="mb-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Szczegółowe Parametry Frezowania</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <div className="flex items-start">
            <Info className="w-6 h-6 text-blue-500 mt-1 mr-3" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">💡 Pro-Tip od Operatora:</h4>
              <p className="text-gray-700">
                Poniższe tabele to świetny punkt startowy. Zawsze wykonaj krótkie cięcie testowe na odpadzie. 
                Jeśli wiór jest sypki jak mąka - zwiększ posuw. Jeśli jest stopiony i sklejony - zmniejsz obroty 
                lub zwiększ posuw. Idealny wiór powinien być ciągły i sprężysty.
              </p>
            </div>
          </div>
        </div>

        {/* PMMA Parameters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">PMMA (Pleksi)</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-blue-50">
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">20000–24000</td>
                  <td className="px-4 py-3">800–1500</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Kluczowe jest dobre odprowadzanie wióra.</td>
                </tr>
                <tr className="border-b hover:bg-blue-50">
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">16000–20000</td>
                  <td className="px-4 py-3">1500–2800</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Utrzymuj wysoką prędkość posuwu, by uniknąć topienia.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dibond Parameters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">Dibond</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-blue-50">
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">14000–18000</td>
                  <td className="px-4 py-3">1500–3000</td>
                  <td className="px-4 py-3">1 lub 2-ostrzowy</td>
                  <td className="px-4 py-3">Do cięcia na wylot.</td>
                </tr>
                <tr className="border-b hover:bg-blue-50">
                  <td className="px-4 py-3">V-frez 90°</td>
                  <td className="px-4 py-3">12000–16000</td>
                  <td className="px-4 py-3">2000–3500</td>
                  <td className="px-4 py-3">Do bigowania</td>
                  <td className="px-4 py-3">Głębokość frezowania kluczowa dla prawidłowego zgięcia.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Rozwiązywanie problemów */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Zaawansowane Rozwiązywanie Problemów</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Problem</th>
                <th className="px-6 py-4 text-left">Możliwa przyczyna</th>
                <th className="px-6 py-4 text-left">Rozwiązanie</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-red-50">
                <td className="px-6 py-4 font-semibold">Topienie się materiału (głównie Plexi, PETG)</td>
                <td className="px-6 py-4">Za wysokie obroty (RPM) / Za wolny posuw / Tępy frez</td>
                <td className="px-6 py-4">
                  1. Zmniejsz obroty o 10-20%<br/>
                  2. Zwiększ posuw<br/>
                  3. Wymień frez na nowy/ostry<br/>
                  4. Sprawdź chłodzenie/odciąg
                </td>
              </tr>
              <tr className="border-b hover:bg-red-50">
                <td className="px-6 py-4 font-semibold">Postrzępione krawędzie (sklejka, płyta meblowa)</td>
                <td className="px-6 py-4">Niewłaściwy frez / Zbyt agresywne parametry</td>
                <td className="px-6 py-4">
                  1. Użyj frezu kompresyjnego<br/>
                  2. Zmniejsz głębokość skrawania na jedno przejście<br/>
                  3. Zastosuj strategię obróbki zgrubnej i wykańczającej
                </td>
              </tr>
              <tr className="border-b hover:bg-red-50">
                <td className="px-6 py-4 font-semibold">Silne wibracje, głośna praca</td>
                <td className="px-6 py-4">Złe mocowanie materiału / Zbyt długi frez / Zużyte łożyska wrzeciona</td>
                <td className="px-6 py-4">
                  1. Sprawdź i popraw mocowanie (vacuum, łapy)<br/>
                  2. Użyj jak najkrótszego frezu<br/>
                  3. Zmniejsz posuw i głębokość skrawania
                </td>
              </tr>
              <tr className="border-b hover:bg-red-50">
                <td className="px-6 py-4 font-semibold">Łamanie się cienkich frezów (np. 1-2mm)</td>
                <td className="px-6 py-4">Zbyt duży posuw lub głębokość / Bicie na wrzecionie</td>
                <td className="px-6 py-4">
                  1. Drastycznie zmniejsz posuw i głębokość (np. 0.5mm na przejście)<br/>
                  2. Sprawdź tulejkę zaciskową i czystość wrzeciona<br/>
                  3. Użyj strategii wejścia w materiał po rampie
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MillingGuide;
