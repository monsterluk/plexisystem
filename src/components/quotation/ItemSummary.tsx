import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Package, Layers, Ruler, Weight, Palette, Box } from 'lucide-react';
import { OfferItemExtended, CustomProduct } from '@/types/Offer';
import { expositorTypes } from '@/constants/materials';
import { additionalOptions } from '@/constants/options';

interface ItemSummaryProps {
  item: OfferItemExtended;
  onRemove: () => void;
}

export const ItemSummary: React.FC<ItemSummaryProps> = ({ item, onRemove }) => {
  // Sprawdź czy to produkt nietypowy
  if ('isCustom' in item && item.isCustom) {
    const customItem = item as CustomProduct;
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-700/50 backdrop-blur rounded-xl p-5 border border-zinc-600 hover:border-purple-500/50 transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-white">
                    {customItem.name}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">{customItem.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-white">{customItem.totalPrice.toFixed(2)} zł</p>
                <p className="text-sm text-gray-400 mt-1">{customItem.quantity} szt × {customItem.unitPrice.toFixed(2)} zł</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full border border-purple-500/30">
                Produkt nietypowy
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRemove}
            className="ml-4 p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400 hover:text-red-300"
            title="Usuń pozycję"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const getOptionsText = () => {
    const options = Object.entries(item.options || {})
      .filter(([key, value]) => value && key !== 'wieko')
      .map(([key]) => {
        const option = additionalOptions.find((o) => o.id === key);
        const qty = item.optionQuantities?.[key];
        return option ? `${option.name}${qty && qty > 1 ? ` (${qty}x)` : ''}` : null;
      })
      .filter(Boolean)
      .join(', ');
    
    return options || '-';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-zinc-700/50 backdrop-blur rounded-xl p-5 border border-zinc-600 hover:border-purple-500/50 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                <Box className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-white">{item.productName}</h4>
                {item.expositorType && (
                  <p className="text-sm text-gray-400">
                    {expositorTypes.find((t) => t.id === item.expositorType)?.name}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-bold text-white">{item.totalPrice.toFixed(2)} zł</p>
              <p className="text-sm text-gray-400 mt-1">{item.quantity} szt × {item.unitPrice.toFixed(2)} zł</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-400">Materiał:</p>
                <p className="text-white font-medium">{item.materialName}, {item.thickness} mm</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-400">Wymiary:</p>
                <p className="text-white font-medium">
                  {item.dimensions.width} × {item.dimensions.height}
                  {item.dimensions.depth > 0 && ` × ${item.dimensions.depth}`} mm
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-400">Opcje:</p>
                <p className="text-white font-medium">{getOptionsText()}</p>
              </div>
            </div>
          </div>

          {item.calculations && (
            <div className="mt-4 pt-4 border-t border-zinc-600 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-zinc-800/50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Box className="w-3 h-3" />
                  Powierzchnia
                </p>
                <p className="font-mono text-sm font-medium text-white">
                  {item.calculations.surface.toFixed(3)} m²
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Weight className="w-3 h-3" />
                  Waga
                </p>
                <p className="font-mono text-sm font-medium text-white">
                  {item.calculations.weight.toFixed(2)} kg
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400">Na palecie</p>
                <p className="font-mono text-sm font-medium text-white">
                  {item.calculations.piecesPerPallet} szt
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400">Palet</p>
                <p className="font-mono text-sm font-medium text-white">
                  {item.calculations.palletsTotal}
                </p>
              </div>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          className="ml-4 p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400 hover:text-red-300"
          title="Usuń pozycję"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};