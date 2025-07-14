import React from 'react';
import { Percent, Truck } from 'lucide-react';
import { Offer } from '@/types/Offer';
import { deliveryRegions } from '@/constants/materials';

interface OfferSummaryProps {
  offer: Offer;
  onDiscountChange: (discount: number) => void;
  onDeliveryChange: (regionId: string) => void;
}

export const OfferSummary: React.FC<OfferSummaryProps> = ({
  offer,
  onDiscountChange,
  onDeliveryChange,
}) => {
  return (
    <div className="mt-6 pt-6 border-t border-zinc-600">
      <table className="w-full">
        <tbody>
          {/* Wartość netto */}
          <tr>
            <td className="p-2 text-right font-semibold" colSpan={5}>
              Wartość netto:
            </td>
            <td className="p-2 text-right font-mono font-bold text-xl">
              {offer.totalNet.toFixed(2)} zł
            </td>
          </tr>

          {/* Rabat */}
          <tr>
            <td className="p-2 text-right" colSpan={5}>
              <div className="flex items-center justify-end gap-2">
                <Percent className="w-4 h-4 text-orange-400" />
                <span>Rabat:</span>
                <input
                  type="number"
                  value={offer.discount}
                  onChange={(e) =>
                    onDiscountChange(Math.max(0, Math.min(100, Number(e.target.value))))
                  }
                  className="w-16 bg-zinc-700 rounded px-2 py-1 text-center"
                  min="0"
                  max="100"
                />
                <span>%</span>
              </div>
            </td>
            <td className="p-2 text-right font-mono text-orange-400">
              -{offer.discountValue.toFixed(2)} zł
            </td>
          </tr>

          {/* Dostawa */}
          <tr>
            <td className="p-2 text-right" colSpan={5}>
              <div className="flex items-center justify-end gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Region dostawy:</span>
                <select
                  value={offer.deliveryRegion}
                  onChange={(e) => onDeliveryChange(e.target.value)}
                  className="bg-zinc-700 rounded px-2 py-1"
                >
                  {deliveryRegions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </td>
            <td className="p-2 text-right font-mono">
              {offer.deliveryCost > 0 ? `+${offer.deliveryCost.toFixed(2)} zł` : 'Gratis'}
            </td>
          </tr>

          {/* Suma końcowa */}
          <tr className="border-t-2 border-orange-500 bg-orange-500/10">
            <td className="p-3 text-right font-bold text-lg" colSpan={5}>
              DO ZAPŁATY:
            </td>
            <td className="p-3 text-right font-mono font-bold text-2xl text-orange-500">
              {(offer.totalNetAfterDiscount + offer.deliveryCost).toFixed(2)} zł
            </td>
          </tr>
        </tbody>
      </table>

      {/* Podsumowanie logistyczne */}
      {offer.items.length > 0 && (
        <div className="mt-4 p-4 bg-zinc-700 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Podsumowanie logistyczne:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Łączna waga:</p>
              <p className="font-mono">
                {offer.items
                  .reduce((sum, item) => sum + (item.calculations?.totalWeight || 0), 0)
                  .toFixed(2)}{' '}
                kg
              </p>
            </div>
            <div>
              <p className="text-gray-400">Liczba palet:</p>
              <p className="font-mono">
                {Math.max(
                  ...offer.items.map((item) => item.calculations?.palletsTotal || 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Liczba kartonów:</p>
              <p className="font-mono">
                {offer.items
                  .reduce((sum, item) => sum + (item.calculations?.boxesTotal || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Czas realizacji:</p>
              <p>{offer.terms.deliveryTime}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};