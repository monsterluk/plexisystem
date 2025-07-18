import React, { useState } from 'react';
import { Package, Save, X } from 'lucide-react';
import { CustomProduct } from '@/types/Offer';

interface CustomProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: CustomProduct) => void;
}

export const CustomProductModal: React.FC<CustomProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productData.name || productData.unitPrice <= 0 || productData.quantity <= 0) {
      alert('Wypełnij wszystkie wymagane pola');
      return;
    }

    const customProduct: CustomProduct = {
      id: Date.now(),
      name: productData.name,
      description: productData.description,
      quantity: productData.quantity,
      unitPrice: productData.unitPrice,
      totalPrice: productData.unitPrice * productData.quantity,
      isCustom: true
    };

    onAdd(customProduct);
    
    // Reset formularza
    setProductData({
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Package className="w-6 h-6 text-orange-500" />
            Produkt nietypowy
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nazwa produktu *
            </label>
            <input
              type="text"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="np. Grawer laserowy logo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Opis (opcjonalnie)
            </label>
            <textarea
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors resize-none"
              placeholder="Dodatkowy opis produktu lub usługi..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ilość *
              </label>
              <input
                type="number"
                value={productData.quantity}
                onChange={(e) => setProductData({ ...productData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-center font-mono focus:border-orange-500 focus:outline-none transition-colors"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cena jednostkowa *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={productData.unitPrice}
                  onChange={(e) => setProductData({ ...productData, unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-white text-center font-mono focus:border-orange-500 focus:outline-none transition-colors"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">zł</span>
              </div>
            </div>
          </div>

          {productData.unitPrice > 0 && productData.quantity > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Wartość całkowita:</span>
                <span className="text-2xl font-bold text-orange-400">
                  {(productData.unitPrice * productData.quantity).toFixed(2)} zł
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              Dodaj do oferty
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
