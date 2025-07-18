// @ts-nocheck
import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { productDescriptionGenerator } from '@/services/ai/productDescriptionGenerator';

interface ProductDescriptionProps {
  item: any; // CalculatorItem type
  onDescriptionGenerated?: (description: string) => void;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ item, onDescriptionGenerated }) => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateDescription = async () => {
    setIsGenerating(true);
    try {
      const generatedDesc = await productDescriptionGenerator.generateDescription(item);
      setDescription(generatedDesc);
      if (onDescriptionGenerated) {
        onDescriptionGenerated(generatedDesc);
      }
    } catch (error) {
      console.error('Błąd generowania opisu:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Błąd kopiowania:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Opis produktu AI
        </h3>
        {!description && (
          <button
            onClick={generateDescription}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isGenerating 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generowanie...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Wygeneruj opis
              </>
            )}
          </button>
        )}
      </div>

      {description && (
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Skopiowano!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopiuj
                </>
              )}
            </button>
            
            <button
              onClick={generateDescription}
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generuj nowy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};