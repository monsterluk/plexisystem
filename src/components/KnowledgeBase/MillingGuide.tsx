import React from 'react';
import { AlertCircle, CheckCircle, Info, Wrench, HelpCircle, DollarSign } from 'lucide-react';

const MillingGuide: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">Rozszerzona Instrukcja Frezowania</h1>
        <p className="text-xl">Kompendium wiedzy technicznej - wersja 4.0</p>
      </div>

      {/* Dobierz frez do zadania */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Dobierz Frez do Zadania</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border-t-4 border-blue-700 hover:bg-zinc-700 transition-colors">
            <Wrench className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-lg font-bold text-white mb-2">Frez 1-ostrzowy (do tworzyw)</h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-blue-400">Idealny do:</strong> Plexi, PCV, PETG, HIPS
            </p>
            <p className="text-sm text-gray-300">
              <strong className="text-blue-400">Zalety:</strong> Doskonałe odprowadzanie wióra, minimalizuje topienie materiału, daje gładką krawędź.
            </p>
          </div>

          <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border-t-4 border-blue-700 hover:bg-zinc-700 transition-colors">
            <Wrench className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-lg font-bold text-white mb-2">Frez 2/3-ostrzowy (do drewna)</h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-blue-400">Idealny do:</strong> MDF, sklejka, drewno lite
            </p>
            <p className="text-sm text-gray-300">
              <strong className="text-blue-400">Zalety:</strong> Większa szybkość posuwu, dobra jakość wykończenia przy materiałach drewnopochodnych.
            </p>
          </div>

          <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border-t-4 border-blue-700 hover:bg-zinc-700 transition-colors">
            <Wrench className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-lg font-bold text-white mb-2">Frez Kompresyjny</h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-blue-400">Idealny do:</strong> Płyta meblowa, sklejka, Dibond
            </p>
            <p className="text-sm text-gray-300">
              <strong className="text-blue-400">Zalety:</strong> Eliminuje wyrwania na górnej i dolnej krawędzi laminatu. Niezbędny przy formatowaniu.
            </p>
          </div>

          <div className="bg-zinc-800 rounded-lg shadow-lg p-6 border-t-4 border-blue-700 hover:bg-zinc-700 transition-colors">
            <Wrench className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-lg font-bold text-white mb-2">Frez Grawerski (V-bit)</h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-blue-400">Idealny do:</strong> Grawerowanie liter, logotypów, fazowanie
            </p>
            <p className="text-sm text-gray-300">
              <strong className="text-blue-400">Zalety:</strong> Pozwala uzyskać ostre, precyzyjne detale w grawerach. Różne kąty dla różnych efektów.
            </p>
          </div>
        </div>
      </section>

      {/* Parametry frezowania - rozszerzone */}
      <section className="mb-12 bg-zinc-800 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Szczegółowe Parametry Frezowania</h2>
        
        <div className="bg-blue-900/30 border-l-4 border-blue-500 p-6 mb-8 rounded">
          <div className="flex items-start">
            <Info className="w-6 h-6 text-blue-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-blue-400 mb-2">💡 Pro-Tip od Operatora:</h4>
              <p className="text-gray-300">
                Poniższe tabele to świetny punkt startowy. Zawsze wykonaj krótkie cięcie testowe na odpadzie. 
                Jeśli wiór jest sypki jak mąka - zwiększ posuw. Jeśli jest stopiony i sklejony - zmniejsz obroty 
                lub zwiększ posuw. Idealny wiór powinien być ciągły i sprężysty.
              </p>
            </div>
          </div>
        </div>

        {/* PMMA Parameters - rozszerzone */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">PMMA (Pleksi) - Pełna tabela parametrów</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-zinc-700 rounded-lg shadow overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">20000–24000</td>
                  <td className="px-4 py-3">500–1500</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Do konturów i drobnych detali</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">20000–24000</td>
                  <td className="px-4 py-3">800–1800</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Delikatne detale, czysta krawędź</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">16000–20000</td>
                  <td className="px-4 py-3">1200–2500</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Standardowe kontury</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">16000–20000</td>
                  <td className="px-4 py-3">1500–3000</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Czysta krawędź, dobra przejrzystość</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">8</td>
                  <td className="px-4 py-3">14000–18000</td>
                  <td className="px-4 py-3">2000–3500</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Do grubszych formatów</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">10</td>
                  <td className="px-4 py-3">12000–16000</td>
                  <td className="px-4 py-3">2000–3500</td>
                  <td className="px-4 py-3">1-ostrzowy lub MCD</td>
                  <td className="px-4 py-3">Gładkie krawędzie, wolniejsze wykańczanie</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PETG Parameters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">PETG - Pełna tabela parametrów</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-zinc-700 rounded-lg shadow overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">16000–20000</td>
                  <td className="px-4 py-3">400–1000</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Wolniejsze posunięcia, ostrożnie z temperaturą</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">16000–20000</td>
                  <td className="px-4 py-3">600–1200</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Kontrola temperatury</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">14000–18000</td>
                  <td className="px-4 py-3">1000–2000</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Dobre odprowadzanie wiórów</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">14000–18000</td>
                  <td className="px-4 py-3">1000–2000</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Lekka tendencja do topienia</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">8</td>
                  <td className="px-4 py-3">12000–16000</td>
                  <td className="px-4 py-3">1800–2700</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Stabilna praca</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PC Parameters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">PC (Poliwęglan) - Pełna tabela parametrów</h3>
          <div className="bg-orange-900/30 border-l-4 border-orange-500 p-4 rounded mb-4">
            <div className="flex items-start">
              <DollarSign className="w-6 h-6 text-orange-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-orange-400 mb-2">Uwaga cenowa:</h4>
                <p className="text-gray-300">
                  Poliwęglan jest drogi w obróbce! Wymaga wolniejszych posuwów i specjalnych frezów. 
                  Dolicz +20-30% do czasu pracy maszyny. Gięcie na gorąco wymaga suszenia - dodatkowy koszt.
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-zinc-700 rounded-lg shadow overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">14000–18000</td>
                  <td className="px-4 py-3">300–800</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Materiał trudny, wolne posuwy</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">14000–18000</td>
                  <td className="px-4 py-3">500–1000</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Ostre narzędzie konieczne</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">12000–16000</td>
                  <td className="px-4 py-3">800–1600</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Częste sprawdzanie ostrza</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">12000–16000</td>
                  <td className="px-4 py-3">800–1600</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Powolne wcinanie</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">8</td>
                  <td className="px-4 py-3">10000–14000</td>
                  <td className="px-4 py-3">1400–2100</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Stabilne parametry</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">10</td>
                  <td className="px-4 py-3">8000–12000</td>
                  <td className="px-4 py-3">1400–2100</td>
                  <td className="px-4 py-3">1-ostrzowy lub MCD</td>
                  <td className="px-4 py-3">MCD zalecane dla długich serii</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dibond Parameters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">Dibond - Pełna tabela parametrów</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-zinc-700 rounded-lg shadow overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">16000–20000</td>
                  <td className="px-4 py-3">900–1800</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Kontrola głębokości</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">14000–18000</td>
                  <td className="px-4 py-3">1500–3000</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Dobra ewakuacja wiórów</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">12000–16000</td>
                  <td className="px-4 py-3">2700–4050</td>
                  <td className="px-4 py-3">1-2 ostrzowy</td>
                  <td className="px-4 py-3">Uwaga na delaminację</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">V-frez 90°</td>
                  <td className="px-4 py-3">12000–16000</td>
                  <td className="px-4 py-3">2000–3500</td>
                  <td className="px-4 py-3">Do bigowania</td>
                  <td className="px-4 py-3">Głębokość frezowania kluczowa dla prawidłowego zgięcia</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PCV Spienione Parameters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">PCV Spienione - Pełna tabela parametrów</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-zinc-700 rounded-lg shadow overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">20000–24000</td>
                  <td className="px-4 py-3">1200–2400</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Minimalne opory skrawania</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">18000–22000</td>
                  <td className="px-4 py-3">2000–4000</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Lekki materiał</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">16000–20000</td>
                  <td className="px-4 py-3">3600–5400</td>
                  <td className="px-4 py-3">1-2 ostrzowy</td>
                  <td className="px-4 py-3">Bardzo wysokie posuwy</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">8</td>
                  <td className="px-4 py-3">15000–18000</td>
                  <td className="px-4 py-3">4800–6400</td>
                  <td className="px-4 py-3">2-ostrzowy</td>
                  <td className="px-4 py-3">Efektywne usuwanie wiórów</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* HIPS Parameters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">HIPS - Pełna tabela parametrów</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-zinc-700 rounded-lg shadow overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">18000–20000</td>
                  <td className="px-4 py-3">900–1800</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Łatwa obróbka</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">16000–18000</td>
                  <td className="px-4 py-3">1500–3000</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Szybkie posuwy możliwe</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">15000–18000</td>
                  <td className="px-4 py-3">2700–3600</td>
                  <td className="px-4 py-3">1-ostrzowy</td>
                  <td className="px-4 py-3">Płynna praca, mało zadziorów</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sklejka Parameters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">Sklejka - Pełna tabela parametrów</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-zinc-700 rounded-lg shadow overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">16000–20000</td>
                  <td className="px-4 py-3">2000–4000</td>
                  <td className="px-4 py-3">2-ostrzowy</td>
                  <td className="px-4 py-3">Standardowe kontury</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">14000–18000</td>
                  <td className="px-4 py-3">3600–5400</td>
                  <td className="px-4 py-3">2-3 ostrzowy</td>
                  <td className="px-4 py-3">Dobra jakość krawędzi</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">8</td>
                  <td className="px-4 py-3">12000–16000</td>
                  <td className="px-4 py-3">4800–6400</td>
                  <td className="px-4 py-3">3-ostrzowy (lub kompresyjny)</td>
                  <td className="px-4 py-3">Kompresyjny = czyste krawędzie góra/dół</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MDF Parameters */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">MDF - Pełna tabela parametrów</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-zinc-700 rounded-lg shadow overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Średnica [mm]</th>
                  <th className="px-4 py-3 text-left">RPM</th>
                  <th className="px-4 py-3 text-left">Posuw [mm/min]</th>
                  <th className="px-4 py-3 text-left">Typ freza</th>
                  <th className="px-4 py-3 text-left">Uwagi</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">18000–22000</td>
                  <td className="px-4 py-3">2500–5000</td>
                  <td className="px-4 py-3">2-ostrzowy</td>
                  <td className="px-4 py-3">Wysokie posuwy możliwe</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">6</td>
                  <td className="px-4 py-3">16000–20000</td>
                  <td className="px-4 py-3">4500–6750</td>
                  <td className="px-4 py-3">2-3 ostrzowy</td>
                  <td className="px-4 py-3">Stabilna praca, dużo pyłu</td>
                </tr>
                <tr className="border-b border-zinc-600 hover:bg-zinc-600">
                  <td className="px-4 py-3">8</td>
                  <td className="px-4 py-3">14000–18000</td>
                  <td className="px-4 py-3">6000–8000</td>
                  <td className="px-4 py-3">3-ostrzowy</td>
                  <td className="px-4 py-3">Konieczne efektywne odprowadzanie wiórów</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Rozwiązywanie problemów - rozszerzone */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Zaawansowane Rozwiązywanie Problemów</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Problem</th>
                <th className="px-6 py-4 text-left">Możliwa przyczyna</th>
                <th className="px-6 py-4 text-left">Rozwiązanie</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-zinc-700 hover:bg-zinc-700">
                <td className="px-6 py-4 font-semibold text-orange-400">Topienie się materiału (głównie Plexi, PETG)</td>
                <td className="px-6 py-4">Za wysokie obroty (RPM) / Za wolny posuw / Tępy frez</td>
                <td className="px-6 py-4">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Zmniejsz obroty o 10-20%</li>
                    <li>Zwiększ posuw</li>
                    <li>Wymień frez na nowy/ostry</li>
                    <li>Sprawdź chłodzenie/odciąg</li>
                  </ol>
                </td>
              </tr>
              <tr className="border-b border-zinc-700 hover:bg-zinc-700">
                <td className="px-6 py-4 font-semibold text-orange-400">Postrzępione krawędzie (sklejka, płyta meblowa)</td>
                <td className="px-6 py-4">Niewłaściwy frez / Zbyt agresywne parametry</td>
                <td className="px-6 py-4">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Użyj frezu kompresyjnego</li>
                    <li>Zmniejsz głębokość skrawania na jedno przejście</li>
                    <li>Zastosuj strategię obróbki zgrubnej i wykańczającej</li>
                  </ol>
                </td>
              </tr>
              <tr className="border-b border-zinc-700 hover:bg-zinc-700">
                <td className="px-6 py-4 font-semibold text-orange-400">Silne wibracje, głośna praca</td>
                <td className="px-6 py-4">Złe mocowanie materiału / Zbyt długi frez / Zużyte łożyska wrzeciona</td>
                <td className="px-6 py-4">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Sprawdź i popraw mocowanie (vacuum, łapy)</li>
                    <li>Użyj jak najkrótszego frezu</li>
                    <li>Zmniejsz posuw i głębokość skrawania</li>
                  </ol>
                </td>
              </tr>
              <tr className="border-b border-zinc-700 hover:bg-zinc-700">
                <td className="px-6 py-4 font-semibold text-orange-400">Łamanie się cienkich frezów (np. 1-2mm)</td>
                <td className="px-6 py-4">Zbyt duży posuw lub głębokość / Bicie na wrzecionie</td>
                <td className="px-6 py-4">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Drastycznie zmniejsz posuw i głębokość (np. 0.5mm na przejście)</li>
                    <li>Sprawdź tulejkę zaciskową i czystość wrzeciona</li>
                    <li>Użyj strategii wejścia w materiał po rampie</li>
                  </ol>
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
