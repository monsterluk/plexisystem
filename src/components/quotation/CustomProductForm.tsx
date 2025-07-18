import React, { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { CustomProduct } from '@/types/Offer';
import { Button } from '@/components/ui/Button';

interface CustomProductFormProps {
  onAdd: (product: CustomProduct) => void;
}

export const CustomProductForm: React.FC<CustomProductFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nazwa produktu jest wymagana';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Opis produktu jest wymagany';
    }
    if (formData.quantity < 1) {
      newErrors.quantity = 'Ilość musi być większa niż 0';
    }
    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Cena musi być większa niż 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Dodaj produkt
    const customProduct: CustomProduct = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalPrice: formData.quantity * formData.unitPrice,
      isCustom: true,
    };

    onAdd(customProduct);

    // Reset formularza
    setFormData({
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
    });
    setErrors({});
    setIsOpen(false);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Usuń błąd dla pola przy zmianie
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="secondary"
        className="w-full"
      >
        <Package className="w-5 h-5 mr-2" />
        Dodaj produkt nietypowy
      </Button>
    );
  }

  return (
    <div className="bg-zinc-700 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold flex items-center">
          <Package className="w-5 h-5 mr-2 text-orange-500" />
          Produkt nietypowy
        </h4>
        <button
          onClick={() => {
            setIsOpen(false);
            setFormData({
              name: '',
              description: '',
              quantity: 1,
              unitPrice: 0,
            });
            setErrors({});
          }}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Nazwa produktu
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="np. Ekspozytory metalowe"
            className={`w-full bg-zinc-600 rounded-lg px-3 py-2 text-white border ${
              errors.name ? 'border-red-500' : 'border-zinc-500'
            } focus:border-orange-500 focus:outline-none`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Opis produktu
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Szczegółowy opis produktu..."
            rows={3}
            className={`w-full bg-zinc-600 rounded-lg px-3 py-2 text-white border ${
              errors.description ? 'border-red-500' : 'border-zinc-500'
            } focus:border-orange-500 focus:outline-none`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Ilość
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
              min="1"
              className={`w-full bg-zinc-600 rounded-lg px-3 py-2 text-white border ${
                errors.quantity ? 'border-red-500' : 'border-zinc-500'
              } focus:border-orange-500 focus:outline-none`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Cena jednostkowa (netto)
            </label>
            <input
              type="number"
              value={formData.unitPrice}
              onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              placeholder="0.00"
              className={`w-full bg-zinc-600 rounded-lg px-3 py-2 text-white border ${
                errors.unitPrice ? 'border-red-500' : 'border-zinc-500'
              } focus:border-orange-500 focus:outline-none`}
            />
            {errors.unitPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.unitPrice}</p>
            )}
          </div>
        </div>

        {formData.quantity > 0 && formData.unitPrice > 0 && (
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-gray-400">Wartość całkowita:</p>
            <p className="text-2xl font-bold text-orange-500">
              {(formData.quantity * formData.unitPrice).toFixed(2)} zł
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setFormData({
                name: '',
                description: '',
                quantity: 1,
                unitPrice: 0,
              });
              setErrors({});
            }}
            variant="secondary"
            className="flex-1"
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            <Plus className="w-5 h-5 mr-2" />
            Dodaj do oferty
          </Button>
        </div>
      </form>
    </div>
  );
};