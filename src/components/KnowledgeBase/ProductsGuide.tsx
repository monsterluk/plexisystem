import React, { useState } from 'react';
import { MessageSquare, ShieldCheck, Settings, Palette, Package, Cpu, Store, Eye, Book, Gift, Lightbulb, Mirror, ChevronDown, ChevronUp, Sparkles, Layers, Box, FileText } from 'lucide-react';

const ProductsGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">Rozszerzone Kompendium Produktów</h1>
        <p className="text-xl">Poznaj możliwości Plexisystem</p>
      </div>

      {/* Galeria inspiracji */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Galeria Inspiracji</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="bg-zinc-800 h-48 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition-colors cursor-pointer">
              <span className="text-gray-400 italic">Zdjęcie realizacji {num}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Katalog produktów */}
      <section className="bg-zinc-800 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Katalog Produktów</h2>

        {/* NOWA SEKCJA: Ekspozytory Reklamowe z Plexi */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-blue-400 border-b-2 border-zinc-700 pb-3 mb-6 flex items-center">
            <Store className="mr-3" />
            Ekspozytory Reklamowe z Plexi
          </h3>

          {/* Wprowadzenie */}
          <div className="bg-blue-900/20 p-6 rounded-lg mb-8">
            <p className="text-gray-300 leading-relaxed">
              Ekspozytory z plexi to wszechstronne narzędzia marketingowe, które łączą estetykę z funkcjonalnością. 
              Charakteryzują się trwałością, przezroczystością i możliwością personalizacji. Idealne dla każdej branży 
              - od kosmetyki po elektronikę.
            </p>
          </div>

          {/* Kategorie ekspozytorów */}
          <div className="space-y-6">
            {/* Ekspozytory Naladowe */}
            <div className="bg-zinc-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('naladowe')}
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-600 transition-colors"
              >
                <div className="flex items-center">
                  <Box className="w-10 h-10 text-blue-400 mr-4" />
                  <h4 className="text-xl font-bold text-white">Ekspozytory Naladowe</h4>
                </div>
                {expandedSection === 'naladowe' ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              {expandedSection === 'naladowe' && (
                <div className="p-6 bg-zinc-800">
                  <p className="text-gray-300 mb-4">
                    Kompaktowe ekspozytory POS przeznaczone do prezentacji produktów bezpośrednio na ladach, 
                    półkach sklepowych i stoiskach. Maksymalizują widoczność produktu na ograniczonej przestrzeni.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-blue-300 mb-2">Zastosowania:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Lakiery do paznokci - wyprofilowane miejsca</li>
                        <li>• Kosmetyki - z przegródkami organizacyjnymi</li>
                        <li>• Karmy dla zwierząt - kaskadowe półeczki</li>
                        <li>• Alkohole premium - podświetlane podstawy</li>
                        <li>• Biżuteria - z lustrzanym tłem</li>
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-green-300 mb-2">Zalety:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Zwiększenie sprzedaży impulsowej</li>
                        <li>• Łatwe utrzymanie czystości</li>
                        <li>• Konstrukcje kaskadowe - wszystko widoczne</li>
                        <li>• Personalizacja z logo i grafiką</li>
                        <li>• Opcja podświetlenia LED</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-gray-300">
                      <strong className="text-blue-400">💡 Wskazówka sprzedażowa:</strong> Zaproponuj klientowi 
                      ekspozytory z wymiennymi miejscami na plakaty - umożliwia to szybką zmianę komunikatu 
                      marketingowego przy nowych promocjach.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Ekspozytory Ścienne */}
            <div className="bg-zinc-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('scienne')}
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-600 transition-colors"
              >
                <div className="flex items-center">
                  <Layers className="w-10 h-10 text-green-400 mr-4" />
                  <h4 className="text-xl font-bold text-white">Ekspozytory Ścienne</h4>
                </div>
                {expandedSection === 'scienne' ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              {expandedSection === 'scienne' && (
                <div className="p-6 bg-zinc-800">
                  <p className="text-gray-300 mb-4">
                    Montowane na ścianach rozwiązania oszczędzające przestrzeń. Pozwalają na optymalne 
                    wykorzystanie powierzchni pionowej, tworząc "ściany sprzedażowe".
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-green-300 mb-2">Typy:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Kieszenie na ulotki (A4, A5, DL)</li>
                        <li>• Półki wielopoziomowe</li>
                        <li>• Systemy modułowe - rozbudowywalne</li>
                        <li>• Panele podświetlane</li>
                        <li>• Gabloty z plexi</li>
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-purple-300 mb-2">Branże:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Salony optyczne - ekspozycja okularów</li>
                        <li>• Drogerie - organizacja kosmetyków</li>
                        <li>• Biura - materiały informacyjne</li>
                        <li>• Placówki medyczne - broszury</li>
                        <li>• Galerie sztuki - katalogi</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded">
                    <p className="text-sm text-gray-300">
                      <strong className="text-green-400">💰 Argument biznesowy:</strong> Ekspozytory ścienne 
                      to inwestycja na lata - minimalna konserwacja, maksymalna efektywność przestrzeni. 
                      ROI widoczne już po pierwszym miesiącu!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Prezentery */}
            <div className="bg-zinc-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('prezentery')}
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-600 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-10 h-10 text-purple-400 mr-4" />
                  <h4 className="text-xl font-bold text-white">Prezentery z Plexi</h4>
                </div>
                {expandedSection === 'prezentery' ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              {expandedSection === 'prezentery' && (
                <div className="p-6 bg-zinc-800">
                  <p className="text-gray-300 mb-4">
                    Eleganckie stojaki na ulotki, wizytówki, menu i materiały informacyjne. Nieodzowny 
                    element każdego punktu obsługi klienta.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-purple-300 mb-2">Formaty:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• DL - wizytówki</li>
                        <li>• A6 - małe ulotki</li>
                        <li>• A5 - broszury</li>
                        <li>• A4 - katalogi</li>
                        <li>• Niestandardowe</li>
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-orange-300 mb-2">Konstrukcje:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Typ L lub T</li>
                        <li>• Wielokieszeniowe</li>
                        <li>• Obrotowe</li>
                        <li>• Ścienne</li>
                        <li>• Z klipsami</li>
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-red-300 mb-2">Miejsca:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Recepcje</li>
                        <li>• Restauracje</li>
                        <li>• Sklepy</li>
                        <li>• Targi</li>
                        <li>• Biura</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded">
                    <p className="text-sm text-gray-300">
                      <strong className="text-purple-400">🎨 Personalizacja:</strong> Oferuj grawerowanie 
                      logo lub nadruk UV. Prezenter z logo klienta to nie tylko nośnik ulotek, ale element 
                      budujący wizerunek marki!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Standy Reklamowe */}
            <div className="bg-zinc-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('standy')}
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-600 transition-colors"
              >
                <div className="flex items-center">
                  <Gift className="w-10 h-10 text-orange-400 mr-4" />
                  <h4 className="text-xl font-bold text-white">Standy Reklamowe</h4>
                </div>
                {expandedSection === 'standy' ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              {expandedSection === 'standy' && (
                <div className="p-6 bg-zinc-800">
                  <p className="text-gray-300 mb-4">
                    Większe konstrukcje do kompleksowej prezentacji produktów i marki. Idealne na targi, 
                    eventy i do galerii handlowych.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-orange-300 mb-2">Typy konstrukcji:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Słupy wolnostojące</li>
                        <li>• Kubiki podświetlane</li>
                        <li>• Wyspy ekspozycyjne</li>
                        <li>• Konstrukcje modułowe</li>
                        <li>• Standy z półkami</li>
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-yellow-300 mb-2">Dodatki:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• LED RGB - zmienne kolory</li>
                        <li>• Kółka - łatwe przemieszczanie</li>
                        <li>• Szafki na zapasy</li>
                        <li>• Ekrany dotykowe</li>
                        <li>• Łączenie z drewnem/metalem</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-orange-900/30 border-l-4 border-orange-500 p-4 rounded">
                    <p className="text-sm text-gray-300">
                      <strong className="text-orange-400">🚀 Pro tip:</strong> Zaproponuj stand z wymiennymi 
                      panelami graficznymi - jeden stand, wiele zastosowań! Klient może używać go na różnych 
                      eventach tylko zmieniając grafikę.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Postumenty podświetlane */}
            <div className="bg-zinc-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('postumenty')}
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-600 transition-colors"
              >
                <div className="flex items-center">
                  <Lightbulb className="w-10 h-10 text-yellow-400 mr-4" />
                  <h4 className="text-xl font-bold text-white">Postumenty z Podświetlanym Blatem</h4>
                </div>
                {expandedSection === 'postumenty' ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              {expandedSection === 'postumenty' && (
                <div className="p-6 bg-zinc-800">
                  <p className="text-gray-300 mb-4">
                    Luksusowe rozwiązania łączące plexi z oświetleniem LED. Tworzą efektowną poświatę, 
                    która podkreśla walory eksponowanego produktu.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-yellow-300 mb-2">Zastosowania premium:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Biżuteria - podkreśla blask</li>
                        <li>• Elektronika - efekt hi-tech</li>
                        <li>• Perfumy - luksusowa prezentacja</li>
                        <li>• Sztuka - galerie i muzea</li>
                        <li>• Trofea i nagrody</li>
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-blue-300 mb-2">Technologie LED:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Edge-lit - świeci tylko krawędź</li>
                        <li>• RGB - zmienne kolory</li>
                        <li>• Ciepła/zimna biel</li>
                        <li>• Sterowanie pilotem</li>
                        <li>• Efekty pulsowania</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-sm text-gray-300">
                      <strong className="text-yellow-400">✨ Efekt WOW:</strong> Postumenty LED to gwarancja 
                      efektu "wow" u klienta. Idealnie nadają się do prezentacji produktów flagowych i 
                      nowości - podświetlenie automatycznie przyciąga wzrok!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Ekspozytory z lustrem */}
            <div className="bg-zinc-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('lustrzane')}
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-600 transition-colors"
              >
                <div className="flex items-center">
                  <Mirror className="w-10 h-10 text-pink-400 mr-4" />
                  <h4 className="text-xl font-bold text-white">Ekspozytory z Lustrem</h4>
                </div>
                {expandedSection === 'lustrzane' ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              {expandedSection === 'lustrzane' && (
                <div className="p-6 bg-zinc-800">
                  <p className="text-gray-300 mb-4">
                    Eleganckie połączenie plexi z lustrem. Optycznie powiększają przestrzeń i zwiększają 
                    atrakcyjność prezentowanych produktów.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-pink-300 mb-2">Efekty wizualne:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Efekt nieskończoności</li>
                        <li>• Podwojenie ilości produktu</li>
                        <li>• Zwiększenie blasku biżuterii</li>
                        <li>• Przestrzenność ekspozycji</li>
                        <li>• Możliwość przymiarki</li>
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-indigo-300 mb-2">Kolory luster:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Srebrne - klasyczne</li>
                        <li>• Złote - luksusowe</li>
                        <li>• Grafitowe - nowoczesne</li>
                        <li>• Brązowe - eleganckie</li>
                        <li>• Z podświetleniem LED</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-pink-900/30 border-l-4 border-pink-500 p-4 rounded">
                    <p className="text-sm text-gray-300">
                      <strong className="text-pink-400">💎 Dla branży beauty:</strong> Ekspozytory z lustrem 
                      to must-have dla kosmetyków i biżuterii. Klient może od razu zobaczyć jak prezentuje 
                      się produkt - to zwiększa szansę na zakup!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Techniki obróbki */}
            <div className="bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg overflow-hidden mt-8">
              <button
                onClick={() => toggleSection('techniki')}
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-600/80 transition-colors"
              >
                <div className="flex items-center">
                  <Sparkles className="w-10 h-10 text-cyan-400 mr-4" />
                  <h4 className="text-xl font-bold text-white">Techniki Obróbki i Personalizacji</h4>
                </div>
                {expandedSection === 'techniki' ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              {expandedSection === 'techniki' && (
                <div className="p-6 bg-zinc-800">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-cyan-300 mb-2">Cięcie i kształtowanie:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Cięcie laserowe - precyzja 0.1mm</li>
                        <li>• Frezowanie CNC - 3D</li>
                        <li>• Gięcie termiczne - łuki</li>
                        <li>• Polerowanie diamentowe</li>
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-teal-300 mb-2">Zdobienie:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Grawerowanie laserowe</li>
                        <li>• Nadruk UV - full color</li>
                        <li>• Wyklejanie folią</li>
                        <li>• Sitodruk - duże serie</li>
                      </ul>
                    </div>
                    
                    <div className="bg-zinc-700 p-4 rounded">
                      <h5 className="font-semibold text-emerald-300 mb-2">Montaż:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Klejenie chemiczne</li>
                        <li>• Łączniki mechaniczne</li>
                        <li>• Systemy magnetyczne</li>
                        <li>• Montaż LED</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-cyan-900/30 border-l-4 border-cyan-500 p-4 rounded mt-4">
                    <p className="text-sm text-gray-300">
                      <strong className="text-cyan-400">🛠️ Przewaga konkurencyjna:</strong> Podkreślaj, że 
                      wszystkie techniki wykonujemy in-house! To gwarantuje jakość, terminowość i możliwość 
                      szybkich modyfikacji. Konkurencja często zleca obróbkę na zewnątrz.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Podsumowanie korzyści */}
          <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <Eye className="mr-3" />
              Dlaczego ekspozytory z plexi?
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong>Trwałość:</strong> Odporne na zarysowania i uszkodzenia</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong>Estetyka:</strong> Elegancki, profesjonalny wygląd</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong>Personalizacja:</strong> Dowolne kształty, kolory, grafiki</span>
                </li>
              </ul>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong>Funkcjonalność:</strong> Łatwe w utrzymaniu czystości</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong>ROI:</strong> Zwiększają sprzedaż i widoczność</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong>Uniwersalność:</strong> Dla każdej branży i budżetu</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reklama i Identyfikacja Wizualna */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-blue-400 border-b-2 border-zinc-700 pb-3 mb-6">
            Reklama i Identyfikacja Wizualna
          </h3>

          <div className="space-y-8">
            {/* Szyldy i Tablice */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="text-center">
                <MessageSquare className="w-20 h-20 text-blue-500 mx-auto mb-4" />
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xl font-bold text-white mb-3">Szyldy i Tablice Reklamowe</h4>
                <p className="text-gray-300 mb-4">
                  Wycinane w dowolnym kształcie, grawerowane lub z grafiką. Idealne do oznakowania biur, 
                  sklepów i budynków. Najczęściej wykonujemy je z Dibondu (trwałość na zewnątrz) 
                  lub PCV (opcja ekonomiczna).
                </p>
                <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-300">
                    <strong className="text-blue-400">Case Study:</strong> Dla lokalnej kancelarii prawnej 
                    wykonaliśmy elegancki szyld z czarnego, szczotkowanego Dibondu z frezowanymi literami, 
                    co podkreśliło prestiż i profesjonalizm firmy.
                  </p>
                </div>
              </div>
            </div>

            {/* Litery 3D */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-500 mx-auto">ABC</div>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xl font-bold text-white mb-3">Litery i Znaki 3D</h4>
                <p className="text-gray-300 mb-4">
                  Efektowne litery przestrzenne, które wyróżnią każdą markę. Mogą być podświetlane 
                  od tyłu (efekt halo). Używamy plexi na lico dla uzyskania głębi koloru i PCV 
                  na boki i tył.
                </p>
                <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-300">
                    <strong className="text-blue-400">Case Study:</strong> Dla nowej kawiarni stworzyliśmy 
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
          <h3 className="text-2xl font-bold text-blue-400 border-b-2 border-zinc-700 pb-3 mb-6">
            Przemysł i Technika
          </h3>

          <div className="space-y-8">
            {/* Osłony do maszyn */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="text-center">
                <ShieldCheck className="w-20 h-20 text-green-500 mx-auto mb-4" />
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xl font-bold text-white mb-3">Osłony do Maszyn</h4>
                <p className="text-gray-300 mb-4">
                  Trwałe i odporne na uderzenia osłony zapewniające bezpieczeństwo operatorów. 
                  Standardem jest tu poliwęglan lity (PC) ze względu na jego ekstremalną wytrzymałość. 
                  PETG jest alternatywą przy kontakcie z chemią.
                </p>
                <div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-sm text-gray-300">
                    <strong className="text-green-400">Case Study:</strong> Dla zakładu produkcyjnego 
                    dostarczyliśmy komplet osłon do nowej linii montażowej. Wykonane z PC o grubości 8mm, 
                    chronią pracowników przed odpryskami, nie ograniczając widoczności.
                  </p>
                </div>
              </div>
            </div>

            {/* Elementy konstrukcyjne */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="text-center">
                <Settings className="w-20 h-20 text-orange-500 mx-auto mb-4" />
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xl font-bold text-white mb-3">Elementy Konstrukcyjne i Prototypy</h4>
                <p className="text-gray-300 mb-4">
                  Precyzyjnie wykonane części maszyn, obudowy urządzeń oraz funkcjonalne prototypy. 
                  Tekstolit i polipropylen (PP) są idealne na elementy ślizgowe i konstrukcyjne.
                </p>
                <div className="bg-orange-900/30 border-l-4 border-orange-500 p-4 rounded">
                  <p className="text-sm text-gray-300">
                    <strong className="text-orange-400">Case Study:</strong> Dla startupu technologicznego 
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
          <div className="bg-zinc-700 p-6 rounded-lg shadow-lg hover:bg-zinc-600 transition-all cursor-pointer">
            <Palette className="w-12 h-12 text-purple-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Dekoracje i Wystrój Wnętrz</h4>
            <p className="text-sm text-gray-300">
              Panele ścienne, przegrody, elementy mebli, tablice informacyjne
            </p>
          </div>
          
          <div className="bg-zinc-700 p-6 rounded-lg shadow-lg hover:bg-zinc-600 transition-all cursor-pointer">
            <Package className="w-12 h-12 text-blue-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Opakowania i Displayе</h4>
            <p className="text-sm text-gray-300">
              Stojaki POS, ekspozytory, pudełka prezentowe, organizery
            </p>
          </div>
          
          <div className="bg-zinc-700 p-6 rounded-lg shadow-lg hover:bg-zinc-600 transition-all cursor-pointer">
            <Cpu className="w-12 h-12 text-red-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Elektronika i Technika</h4>
            <p className="text-sm text-gray-300">
              Obudowy urządzeń, panele czołowe, podstawki, uchwyty
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsGuide;
