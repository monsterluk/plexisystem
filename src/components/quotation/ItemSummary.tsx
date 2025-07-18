import React from 'react';
import { Trash2, Package } from 'lucide-react';
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
      <div className="bg-zinc-700 rounded-lg p-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-lg flex items-center">
                <Package className="w-5 h-5 mr-2 text-orange-500" />
                {customItem.name}
              </h4>
              <p className="text-sm text-gray-400 mt-1">{customItem.description}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-bold">{customItem.totalPrice.toFixed(2)} zł</p>
              <p className="text-sm text-gray-400">{customItem.quantity} szt × {customItem.unitPrice.toFixed(2)} zł</p>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-400">
            <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded">Produkt nietypowy</span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="ml-4 p-2 hover:bg-zinc-600 rounded transition-all text-red-400"
          title="Usuń pozycję"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
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
    <div className="bg-zinc-700 rounded-lg p-4 flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-lg">{item.productName}</h4>
            {item.expositorType && (
              <p className="text-sm text-gray-400">
                {expositorTypes.find((t) => t.id === item.expositorType)?.name}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-bold">{item.totalPrice.toFixed(2)} zł</p>
            <p className="text-sm text-gray-400">{item.quantity} szt × {item.unitPrice.toFixed(2)} zł</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Materiał:</p>
            <p>{item.materialName}, {item.thickness} mm</p>
          </div>
          <div>
            <p className="text-gray-400">Wymiary:</p>
            <p>
              {item.dimensions.width} × {item.dimensions.height}
              {item.dimensions.depth > 0 && ` × ${item.dimensions.depth}`} mm
            </p>
          </div>
          <div>
            <p className="text-gray-400">Opcje:</p>
            <p>{getOptionsText()}</p>
          </div>
        </div>

        {item.calculations && (
          <div className="mt-3 pt-3 border-t border-zinc-600 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Powierzchnia:</span>{' '}
              <span className="font-mono">{item.calculations.surface.toFixed(3)} m²</span>
            </div>
            <div>
              <span className="text-gray-400">Waga:</span>{' '}
              <span className="font-mono">{item.calculations.weight.toFixed(2)} kg</span>
            </div>
            <div>
              <span className="text-gray-400">Na palecie:</span>{' '}
              <span className="font-mono">{item.calculations.piecesPerPallet} szt</span>
            </div>
            <div>
              <span className="text-gray-400">Palet:</span>{' '}
              <span className="font-mono">{item.calculations.palletsTotal}</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onRemove}
        className="ml-4 p-2 hover:bg-zinc-600 rounded transition-all text-red-400"
        title="Usuń pozycję"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};