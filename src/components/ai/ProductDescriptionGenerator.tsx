import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader, Copy, Check, Wand2, Package, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface ProductDescriptionGeneratorProps {
  productType: string;
  material?: string;
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
  };
  features?: string[];
  onDescriptionGenerated: (description: string) => void;
}

export const ProductDescriptionGenerator: React.FC<ProductDescriptionGeneratorProps> = ({
  productType,
  material,
  dimensions,
  features = [],
  onDescriptionGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<'professional' | 'marketing' | 'technical'>('professional');

  const generateDescription = async () => {
    setIsGenerating(true);
    
    try {
      // Przygotowanie promptu
      const prompt = `
        Wygeneruj ${tone === 'professional' ? 'profesjonalny' : tone === 'marketing' ? 'marketingowy' : 'techniczny'} opis produktu:
        
        Typ produktu: ${productType}
        ${material ? `Materiał: ${material}` : ''}
        ${dimensions ? `Wymiary: ${dimensions.width}x${dimensions.height}${dimensions.depth ? `x${dimensions.depth}` : ''} mm` : ''}
        ${features.length > 0 ? `Cechy: ${features.join(', ')}` : ''}
        
        Opis powinien:
        - Być w języku polskim
        - Zawierać 3-5 zdań
        - Podkreślać zalety i zastosowania
        ${tone === 'marketing' ? '- Być zachęcający i perswazyjny' : ''}
        ${tone === 'technical' ? '- Zawierać szczegóły techniczne' : ''}
      `;

      // Symulacja generowania AI (w przyszłości zastąp prawdziwym API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Przykładowe opisy w zależności od typu
      let description = '';
      
      if (productType.toLowerCase().includes('ekspozytor')) {
        if (tone === 'professional') {
          description = `Ekspozytor ${material || 'z plexi'} o wymiarach ${dimensions?.width || '400'}x${dimensions?.height || '600'}mm to eleganckie rozwiązanie ekspozycyjne dla Twojej marki. Wysokiej jakości wykonanie gwarantuje trwałość i estetyczny wygląd przez długi czas użytkowania. Idealny do prezentacji produktów w punktach sprzedaży, na targach czy w showroomach. Przejrzysta konstrukcja zapewnia doskonałą widoczność eksponowanych towarów z każdej strony.`;
        } else if (tone === 'marketing') {
          description = `Przyciągnij wzrok klientów naszym wyjątkowym ekspozytorem! Ta nowoczesna konstrukcja ${material ? `z ${material}` : ''} nie tylko prezentuje Twoje produkty, ale sprawia, że wyróżniają się na tle konkurencji. Zwiększ sprzedaż dzięki profesjonalnej prezentacji - Twoi klienci docenią dbałość o detale. Inwestycja, która zwróci się wielokrotnie!`;
        } else {
          description = `Ekspozytor wykonany z ${material || 'PMMA'} o grubości 5mm, wymiary: ${dimensions?.width || '400'}x${dimensions?.height || '600'}x${dimensions?.depth || '300'}mm. Konstrukcja samonośna, łączenie klejone UV lub mechaniczne. Możliwość wykonania z plexi transparentnej, mlecznej lub kolorowej. Opcjonalnie: podświetlenie LED, nadruk UV, grawerowanie laserowe. Maksymalne obciążenie półki: 10kg.`;
        }
      } else if (productType.toLowerCase().includes('kaseton')) {
        if (tone === 'professional') {
          description = `Kaseton reklamowy ${material ? `z ${material}` : ''} stanowi skuteczne narzędzie identyfikacji wizualnej Twojej firmy. Trwała konstrukcja i możliwość podświetlenia LED zapewniają doskonałą widoczność zarówno w dzień, jak i w nocy. Odporna na warunki atmosferyczne powłoka gwarantuje wieloletnią eksploatację bez utraty walorów estetycznych.`;
        } else if (tone === 'marketing') {
          description = `Spraw, aby Twoja marka świeciła jasno! Nasz podświetlany kaseton to gwarancja, że Twój biznes będzie widoczny 24/7. Przyciągające wzrok podświetlenie LED i nowoczesny design sprawią, że klienci nie przejdą obojętnie obok Twojej firmy. To inwestycja w rozpoznawalność marki, która pracuje dla Ciebie non-stop!`;
        } else {
          description = `Kaseton dwustronny, konstrukcja aluminiowa, lico z ${material || 'plexi mlecznej 3mm'}. Wymiary: ${dimensions?.width || '1000'}x${dimensions?.height || '800'}x${dimensions?.depth || '150'}mm. Podświetlenie: moduły LED 12V, moc 40W/m². Klasa szczelności IP65. Montaż: wsporniki dystansowe lub bezpośrednio do elewacji. Zasilanie 230V z transformatorem.`;
        }
      }
      
      setGeneratedDescription(description);
      onDescriptionGenerated(description);
      
    } catch (error) {
      toast.error('Błąd podczas generowania opisu');
      console.error('Error generating description:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDescription);
    setCopied(true);
    toast.success('Skopiowano do schowka!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Generator opisów AI</h3>
          <p className="text-sm text-gray-400">Wygeneruj profesjonalny opis produktu</p>
        </div>
      </div>

      {/* Wybór tonu */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Styl opisu
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTone('professional')}
            className={`p-3 rounded-lg border transition-all ${
              tone === 'professional' 
                ? 'bg-purple-900/30 border-purple-500 text-purple-300' 
                : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600'
            }`}
          >
            <FileText className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Profesjonalny</span>
          </button>
          <button
            onClick={() => setTone('marketing')}
            className={`p-3 rounded-lg border transition-all ${
              tone === 'marketing' 
                ? 'bg-purple-900/30 border-purple-500 text-purple-300' 
                : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600'
            }`}
          >
            <Sparkles className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Marketingowy</span>
          </button>
          <button
            onClick={() => setTone('technical')}
            className={`p-3 rounded-lg border transition-all ${
              tone === 'technical' 
                ? 'bg-purple-900/30 border-purple-500 text-purple-300' 
                : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600'
            }`}
          >
            <Package className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Techniczny</span>
          </button>
        </div>
      </div>

      {/* Informacje o produkcie */}
      <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Produkt:</span>
            <span className="text-white ml-2">{productType}</span>
          </div>
          {material && (
            <div>
              <span className="text-gray-500">Materiał:</span>
              <span className="text-white ml-2">{material}</span>
            </div>
          )}
          {dimensions && (
            <div>
              <span className="text-gray-500">Wymiary:</span>
              <span className="text-white ml-2">
                {dimensions.width}x{dimensions.height}
                {dimensions.depth && `x${dimensions.depth}`} mm
              </span>
            </div>
          )}
          {features.length > 0 && (
            <div className="col-span-2">
              <span className="text-gray-500">Cechy:</span>
              <span className="text-white ml-2">{features.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={generateDescription}
        variant="primary"
        className="w-full mb-4"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Generowanie opisu...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Wygeneruj opis
          </>
        )}
      </Button>

      {/* Wygenerowany opis */}
      {generatedDescription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-medium text-gray-300">Wygenerowany opis:</h4>
              <button
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-zinc-700 rounded transition-all"
                title="Kopiuj do schowka"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {generatedDescription}
            </p>
          </div>
        </motion.div>
      )}
    </Card>
  );
};