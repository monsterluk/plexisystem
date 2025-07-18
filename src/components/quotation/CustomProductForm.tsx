import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, X, Hash, DollarSign, FileText, ShoppingCart } from 'lucide-react';
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4 cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <Package className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-lg font-semibold text-white mb-2">Produkt nietypowy</h3>
          <p className="text-sm text-gray-400 mb-4 max-w-md">
            Dodaj produkt spoza standardowej oferty z własną nazwą, opisem i ceną
          </p>
          <Button
            onClick={() => setIsOpen(true)}
            variant="primary"
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Dodaj produkt nietypowy
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur rounded-2xl p-6 border border-purple-500/30"
      >
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold flex items-center text-white">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mr-3">
              <Package className="w-5 h-5 text-white" />
            </div>
            Produkt nietypowy
          </h4>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
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
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium mb-2 text-gray-400">
              <ShoppingCart className="w-4 h-4 inline mr-1" />
              Nazwa produktu
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="np. Ekspozytory metalowe"
              className={`w-full bg-zinc-700/50 backdrop-blur rounded-xl px-4 py-3 text-white border ${
                errors.name ? 'border-red-500' : 'border-zinc-600'
              } focus:border-purple-500 focus:outline-none transition-all`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium mb-2 text-gray-400">
              <FileText className="w-4 h-4 inline mr-1" />
              Opis produktu
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Szczegółowy opis produktu..."
              rows={3}
              className={`w-full bg-zinc-700/50 backdrop-blur rounded-xl px-4 py-3 text-white border ${
                errors.description ? 'border-red-500' : 'border-zinc-600'
              } focus:border-purple-500 focus:outline-none transition-all resize-none`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-2 text-gray-400">
                <Hash className="w-4 h-4 inline mr-1" />
                Ilość
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                min="1"
                className={`w-full bg-zinc-700/50 backdrop-blur rounded-xl px-4 py-3 text-white border ${
                  errors.quantity ? 'border-red-500' : 'border-zinc-600'
                } focus:border-purple-500 focus:outline-none transition-all`}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium mb-2 text-gray-400">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Cena jednostkowa (netto)
              </label>
              <input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                placeholder="0.00"
                className={`w-full bg-zinc-700/50 backdrop-blur rounded-xl px-4 py-3 text-white border ${
                  errors.unitPrice ? 'border-red-500' : 'border-zinc-600'
                } focus:border-purple-500 focus:outline-none transition-all`}
              />
              {errors.unitPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.unitPrice}</p>
              )}
            </motion.div>
          </div>

          {formData.quantity > 0 && formData.unitPrice > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/20"
            >
              <p className="text-sm text-gray-400 mb-1">Wartość całkowita:</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {(formData.quantity * formData.unitPrice).toFixed(2)} zł
              </p>
            </motion.div>
          )}

          <div className="flex gap-3 pt-4">
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
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="primary"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                Dodaj do oferty
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};