// src/components/client/ClientForm.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, MapPin, Hash, Search, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Client } from '@/types/Offer';
import { fetchCompanyData as fetchGUSData } from '@/api/gus';

interface ClientFormProps {
  client: Client;
  onChange: (client: Client) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ client, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchingGus, setSearchingGus] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Formatowanie NIP - tylko cyfry
  const formatNip = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  // Walidacja NIP
  const validateNip = (nip: string): boolean => {
    if (nip.length !== 10) return false;
    
    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(nip[i]) * weights[i];
    }
    
    const checkSum = sum % 11;
    const lastDigit = parseInt(nip[9]);
    
    return checkSum === lastDigit;
  };

  // Pobieranie danych z GUS
  const fetchCompanyData = async (nip: string) => {
    if (!nip || nip.length !== 10) {
      return;
    }

    if (!validateNip(nip)) {
      setError('Nieprawidłowy NIP');
      setSuccessMessage('');
      return;
    }
    
    setSearchingGus(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Użyj funkcji z api/gus.ts
      const companyData = await fetchGUSData(nip);
      
      if (companyData) {
        onChange({
          ...client,
          ...companyData,
          nip: nip,
        });
        setSuccessMessage('Dane pobrane z GUS');
      } else {
        // Dane testowe jako fallback
        const mockData: Record<string, any> = {
          '5882396272': {
            name: 'PlexiSystem S.C.',
            address: 'Ks. Dr. Leona Heyke 11, 84-206 Nowy Dwór Wejherowski',
            regon: '221645384',
            wojewodztwo: 'pomorskie',
            powiat: 'wejherowski',
            gmina: 'Wejherowo',
            email: 'biuro@plexisystem.pl',
            phone: '884042107'
          },
          '1234567890': {
            name: 'Przykładowa Firma Sp. z o.o.',
            address: 'ul. Testowa 123, 00-001 Warszawa',
            regon: '987654321',
            wojewodztwo: 'mazowieckie',
            powiat: 'warszawski',
            gmina: 'Warszawa'
          },
          '5213870274': {
            name: 'Google Poland Sp. z o.o.',
            address: 'ul. Emilii Plater 53, 00-113 Warszawa',
            regon: '380871946',
            wojewodztwo: 'mazowieckie',
            powiat: 'warszawski',
            gmina: 'Warszawa'
          },
          '5252344078': {
            name: 'Test Company Ltd.',
            address: 'ul. Przykładowa 456, 80-001 Gdańsk',
            regon: '123456789',
            wojewodztwo: 'pomorskie',
            powiat: 'gdański',
            gmina: 'Gdańsk'
          }
        };
        
        const mockCompany = mockData[nip];
        if (mockCompany) {
          onChange({
            ...client,
            nip: nip,
            name: mockCompany.name,
            address: mockCompany.address,
            regon: mockCompany.regon,
            wojewodztwo: mockCompany.wojewodztwo || '',
            powiat: mockCompany.powiat || '',
            gmina: mockCompany.gmina || '',
            email: mockCompany.email || client.email,
            phone: mockCompany.phone || client.phone
          });
          setSuccessMessage('Dane testowe załadowane');
        } else {
          setError('Nie znaleziono firmy. Wprowadź dane ręcznie.');
        }
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
      setError('Wystąpił błąd. Wprowadź dane ręcznie.');
    } finally {
      setSearchingGus(false);
    }
  };

  // Automatyczne wyszukiwanie po wpisaniu 10 cyfr
  useEffect(() => {
    if (client.nip && client.nip.length === 10 && validateNip(client.nip)) {
      const timer = setTimeout(() => {
        fetchCompanyData(client.nip);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [client.nip]);

  const handleNipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNip = formatNip(e.target.value);
    onChange({ ...client, nip: formattedNip });
    
    if (formattedNip.length < 10) {
      setError('');
      setSuccessMessage('');
    }
  };

  const inputVariants = {
    initial: { scale: 0.98 },
    focus: { scale: 1 },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NIP */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <label htmlFor="nip" className="block text-sm font-medium mb-2 text-gray-400">
            NIP
          </label>
          <div className="relative">
            <motion.input
              id="nip"
              name="nip"
              type="text"
              value={client.nip}
              onChange={handleNipChange}
              placeholder="0000000000"
              whileFocus="focus"
              variants={inputVariants}
              className={`w-full bg-zinc-700/50 backdrop-blur rounded-xl px-4 py-3 pr-12 text-white border ${
                error && client.nip.length === 10 ? 'border-red-500' : 
                successMessage ? 'border-emerald-500' : 'border-zinc-600'
              } focus:border-purple-500 focus:outline-none transition-all`}
            />
            {searchingGus && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
              </div>
            )}
            {!searchingGus && client.nip.length === 10 && validateNip(client.nip) && (
              <motion.button
                type="button"
                onClick={() => fetchCompanyData(client.nip)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                title="Szukaj w GUS"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            )}
            {successMessage && (
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
            )}
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {error}
            </motion.p>
          )}
          {successMessage && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-emerald-500 flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" />
              {successMessage}
            </motion.p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Wpisz 10-cyfrowy NIP aby automatycznie pobrać dane
          </p>
        </motion.div>

        {/* REGON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label htmlFor="regon" className="block text-sm font-medium mb-2 text-gray-400">
            REGON
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <motion.input
              id="regon"
              name="regon"
              type="text"
              value={client.regon}
              onChange={(e) => onChange({ ...client, regon: e.target.value })}
              placeholder="000000000"
              whileFocus="focus"
              variants={inputVariants}
              className="w-full bg-zinc-700/50 backdrop-blur rounded-xl pl-10 pr-4 py-3 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Nazwa firmy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-400">
            Nazwa firmy <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <motion.input
              id="name"
              name="name"
              type="text"
              value={client.name}
              onChange={(e) => onChange({ ...client, name: e.target.value })}
              placeholder="Nazwa firmy"
              required
              whileFocus="focus"
              variants={inputVariants}
              className="w-full bg-zinc-700/50 backdrop-blur rounded-xl pl-10 pr-4 py-3 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Adres */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="md:col-span-2"
        >
          <label htmlFor="address" className="block text-sm font-medium mb-2 text-gray-400">
            Adres
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <motion.input
              id="address"
              name="address"
              type="text"
              value={client.address}
              onChange={(e) => onChange({ ...client, address: e.target.value })}
              placeholder="ul. Przykładowa 1, 00-001 Warszawa"
              whileFocus="focus"
              variants={inputVariants}
              className="w-full bg-zinc-700/50 backdrop-blur rounded-xl pl-10 pr-4 py-3 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-400">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <motion.input
              id="email"
              name="email"
              type="email"
              value={client.email}
              onChange={(e) => onChange({ ...client, email: e.target.value })}
              placeholder="firma@example.com"
              whileFocus="focus"
              variants={inputVariants}
              className="w-full bg-zinc-700/50 backdrop-blur rounded-xl pl-10 pr-4 py-3 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Telefon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-400">
            Telefon
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <motion.input
              id="phone"
              name="phone"
              type="tel"
              value={client.phone}
              onChange={(e) => onChange({ ...client, phone: e.target.value })}
              placeholder="+48 123 456 789"
              whileFocus="focus"
              variants={inputVariants}
              className="w-full bg-zinc-700/50 backdrop-blur rounded-xl pl-10 pr-4 py-3 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Dodatkowe pola lokalizacyjne (ukryte domyślnie, wypełniane z GUS) */}
        {(client.wojewodztwo || client.powiat || client.gmina) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:col-span-2 grid grid-cols-3 gap-4 mt-2"
          >
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Województwo
              </label>
              <input
                type="text"
                value={client.wojewodztwo}
                readOnly
                className="w-full bg-zinc-800/50 rounded-lg px-3 py-2 text-sm text-gray-400 border border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Powiat
              </label>
              <input
                type="text"
                value={client.powiat}
                readOnly
                className="w-full bg-zinc-800/50 rounded-lg px-3 py-2 text-sm text-gray-400 border border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Gmina
              </label>
              <input
                type="text"
                value={client.gmina}
                readOnly
                className="w-full bg-zinc-800/50 rounded-lg px-3 py-2 text-sm text-gray-400 border border-zinc-700"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Informacja o danych testowych */}
      {!import.meta.env.VITE_GUS_WEBHOOK_URL && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-xl"
        >
          <p className="text-sm text-amber-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Dane testowe NIP: 5882396272, 1234567890, 5213870274, 5252344078
          </p>
        </motion.div>
      )}
    </div>
  );
};