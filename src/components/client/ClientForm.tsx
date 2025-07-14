// src/components/client/ClientForm.tsx
import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Hash, Search, Loader2 } from 'lucide-react';
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
      return;
    }
    
    setSearchingGus(true);
    setError('');
    
    try {
      console.log('Szukam NIP:', nip);
      console.log('GUS URL:', import.meta.env.VITE_GUS_WEBHOOK_URL);

      // Użyj funkcji z api/gus.ts
      const companyData = await fetchGUSData(nip);
      
      if (companyData) {
        onChange({
          ...client,
          ...companyData,
          nip: nip,
        });
        console.log('Znaleziono dane:', companyData);
      } else {
        console.log('Nie znaleziono danych dla NIP:', nip);
        
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
    }
  };

  return (
    <div className="bg-zinc-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Building2 className="w-6 h-6 text-orange-500" />
        Dane klienta
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NIP */}
        <div className="relative">
          <label htmlFor="nip" className="block text-sm font-medium mb-2 text-gray-400">
            NIP
          </label>
          <div className="relative">
            <input
              id="nip"
              name="nip"
              type="text"
              value={client.nip}
              onChange={handleNipChange}
              placeholder="0000000000"
              className={`w-full bg-zinc-700 rounded-lg px-3 py-2 pr-10 text-white border ${
                error && client.nip.length === 10 ? 'border-red-500' : 'border-zinc-600'
              } focus:border-orange-500 focus:outline-none`}
            />
            {searchingGus && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
              </div>
            )}
            {!searchingGus && client.nip.length === 10 && (
              <button
                type="button"
                onClick={() => fetchCompanyData(client.nip)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                title="Szukaj w GUS"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Wpisz 10-cyfrowy NIP aby automatycznie pobrać dane
          </p>
        </div>

        {/* REGON */}
        <div>
          <label htmlFor="regon" className="block text-sm font-medium mb-2 text-gray-400">
            REGON
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="regon"
              name="regon"
              type="text"
              value={client.regon}
              onChange={(e) => onChange({ ...client, regon: e.target.value })}
              placeholder="000000000"
              className="w-full bg-zinc-700 rounded-lg pl-10 pr-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Nazwa firmy */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-400">
            Nazwa firmy <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              value={client.name}
              onChange={(e) => onChange({ ...client, name: e.target.value })}
              placeholder="Nazwa firmy"
              required
              className="w-full bg-zinc-700 rounded-lg pl-10 pr-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Adres */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium mb-2 text-gray-400">
            Adres
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="address"
              name="address"
              type="text"
              value={client.address}
              onChange={(e) => onChange({ ...client, address: e.target.value })}
              placeholder="ul. Przykładowa 1, 00-001 Warszawa"
              className="w-full bg-zinc-700 rounded-lg pl-10 pr-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-400">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              value={client.email}
              onChange={(e) => onChange({ ...client, email: e.target.value })}
              placeholder="firma@example.com"
              className="w-full bg-zinc-700 rounded-lg pl-10 pr-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-400">
            Telefon
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={client.phone}
              onChange={(e) => onChange({ ...client, phone: e.target.value })}
              placeholder="+48 123 456 789"
              className="w-full bg-zinc-700 rounded-lg pl-10 pr-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Dodatkowe pola lokalizacyjne (ukryte domyślnie, wypełniane z GUS) */}
        {(client.wojewodztwo || client.powiat || client.gmina) && (
          <div className="md:col-span-2 grid grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Województwo
              </label>
              <input
                type="text"
                value={client.wojewodztwo}
                readOnly
                className="w-full bg-zinc-700/50 rounded px-2 py-1 text-sm text-gray-300"
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
                className="w-full bg-zinc-700/50 rounded px-2 py-1 text-sm text-gray-300"
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
                className="w-full bg-zinc-700/50 rounded px-2 py-1 text-sm text-gray-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Informacja o danych testowych */}
      {!import.meta.env.VITE_GUS_WEBHOOK_URL && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            ℹ️ Dane testowe NIP: 5882396272, 1234567890, 5213870274, 5252344078
          </p>
        </div>
      )}
    </div>
  );
};