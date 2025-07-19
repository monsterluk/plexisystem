import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Minus, Save, Printer } from 'lucide-react';

interface NewWZModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: any) => void;
}

interface WZItem {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unit: string;
  price: number;
  vat: number;
  total: number;
}

export function NewWZModal({ isOpen, onClose, onSave }: NewWZModalProps) {
  const [formData, setFormData] = useState({
    orderNumber: '',
    clientId: '',
    clientName: '',
    clientAddress: '',
    clientNIP: '',
    deliveryAddress: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [items, setItems] = useState<WZItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);

  // Przykładowe dane klientów
  const clients = [
    { id: '1', name: 'Firma ABC Sp. z o.o.', address: 'ul. Przykładowa 1, 00-001 Warszawa', nip: '1234567890' },
    { id: '2', name: 'Studio Reklamy XYZ', address: 'ul. Testowa 2, 00-002 Kraków', nip: '0987654321' }
  ];

  // Przykładowe produkty
  const products = [
    { id: '1', name: 'Kaseton LED 100x50cm', code: 'KAS-LED-100-50', unit: 'szt', price: 800 },
    { id: '2', name: 'Plexi mleczne 3mm', code: 'PLEXI-ML-3', unit: 'm²', price: 120 },
    { id: '3', name: 'Litery przestrzenne 30cm', code: 'LIT-3D-30', unit: 'szt', price: 300 },
    { id: '4', name: 'Dibond 3mm', code: 'DIB-3', unit: 'm²', price: 180 }
  ];

  const generateDocumentNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `WZ/${year}/${month}/${random}`;
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        documentNumber: generateDocumentNumber()
      }));
    }
  }, [isOpen]);

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.name,
        clientAddress: client.address,
        clientNIP: client.nip,
        deliveryAddress: client.address
      }));
    }
  };

  const addProduct = (product: any) => {
    const newItem: WZItem = {
      id: Date.now().toString(),
      productName: product.name,
      productCode: product.code,
      quantity: 1,
      unit: product.unit,
      price: product.price,
      vat: 23,
      total: product.price * 1.23
    };
    setItems([...items, newItem]);
    setShowProductSearch(false);
    setSearchQuery('');
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, quantity, total: item.price * quantity * (1 + item.vat / 100) }
        : item
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const calculateTotals = () => {
    const netTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vatTotal = items.reduce((sum, item) => sum + (item.price * item.quantity * item.vat / 100), 0);
    const grossTotal = netTotal + vatTotal;
    return { netTotal, vatTotal, grossTotal };
  };

  const handleSave = () => {
    const totals = calculateTotals();
    const document = {
      ...formData,
      items,
      ...totals,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    onSave(document);
    onClose();
  };

  if (!isOpen) return null;

  const { netTotal, vatTotal, grossTotal } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Nowy dokument WZ</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Informacje podstawowe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Numer dokumentu
                </label>
                <input
                  type="text"
                  value={formData.documentNumber}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Numer zamówienia
                </label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  placeholder="np. ZAM/2024/07/001"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Dane klienta */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Dane odbiorcy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Wybierz klienta
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">-- Wybierz klienta --</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nazwa firmy
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    NIP
                  </label>
                  <input
                    type="text"
                    value={formData.clientNIP}
                    onChange={(e) => setFormData({ ...formData, clientNIP: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Adres
                  </label>
                  <input
                    type="text"
                    value={formData.clientAddress}
                    onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Dane dostawy */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Dane dostawy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Adres dostawy
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    placeholder="Pozostaw puste jeśli taki sam jak adres firmy"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Data wydania
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Pozycje dokumentu */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-white">Pozycje dokumentu</h3>
                <button
                  onClick={() => setShowProductSearch(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj produkt
                </button>
              </div>

              {/* Wyszukiwarka produktów */}
              {showProductSearch && (
                <div className="mb-4 p-4 bg-gray-700/50 rounded-lg">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Szukaj produktu..."
                      className="w-full pl-10 pr-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {products
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  p.code.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(product => (
                        <button
                          key={product.id}
                          onClick={() => addProduct(product)}
                          className="w-full text-left p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-white">{product.name}</p>
                              <p className="text-xs text-gray-400">{product.code}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-white">{product.price} zł/{product.unit}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={() => setShowProductSearch(false)}
                    className="mt-2 text-sm text-gray-400 hover:text-white"
                  >
                    Anuluj
                  </button>
                </div>
              )}

              {/* Lista pozycji */}
              {items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-700">
                        <th className="pb-2 text-sm font-medium text-gray-400">Produkt</th>
                        <th className="pb-2 text-sm font-medium text-gray-400 text-center">Ilość</th>
                        <th className="pb-2 text-sm font-medium text-gray-400 text-right">Cena netto</th>
                        <th className="pb-2 text-sm font-medium text-gray-400 text-center">VAT</th>
                        <th className="pb-2 text-sm font-medium text-gray-400 text-right">Wartość brutto</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} className="border-b border-gray-700/50">
                          <td className="py-3">
                            <p className="text-sm font-medium text-white">{item.productName}</p>
                            <p className="text-xs text-gray-400">{item.productCode}</p>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                className="w-16 text-center px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded"
                              />
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <span className="text-sm text-gray-400 ml-1">{item.unit}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <p className="text-sm text-white">{(item.price * item.quantity).toFixed(2)} zł</p>
                          </td>
                          <td className="py-3 text-center">
                            <p className="text-sm text-gray-400">{item.vat}%</p>
                          </td>
                          <td className="py-3 text-right">
                            <p className="text-sm font-medium text-white">{item.total.toFixed(2)} zł</p>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 hover:bg-gray-700 rounded transition-colors text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Brak pozycji w dokumencie</p>
                  <p className="text-sm mt-1">Kliknij "Dodaj produkt" aby dodać pozycje</p>
                </div>
              )}
            </div>

            {/* Podsumowanie */}
            {items.length > 0 && (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Wartość netto:</span>
                    <span className="text-white font-medium">{netTotal.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">VAT:</span>
                    <span className="text-white font-medium">{vatTotal.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-600">
                    <span className="text-white">Wartość brutto:</span>
                    <span className="text-orange-500">{grossTotal.toFixed(2)} zł</span>
                  </div>
                </div>
              </div>
            )}

            {/* Uwagi */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Uwagi
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Dodatkowe informacje..."
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            Anuluj
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {/* TODO: Implementacja podglądu */}}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              <Printer className="w-4 h-4" />
              Podgląd wydruku
            </button>
            <button
              onClick={handleSave}
              disabled={items.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" />
              Zapisz dokument
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}