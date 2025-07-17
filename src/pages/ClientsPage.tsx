import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Building2, MapPin, Phone, Mail, Calendar, TrendingUp, FileText, Loader2, RefreshCw, Download, Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Client {
  id: number;
  name: string;
  nip: string;
  address?: string;
  email?: string;
  phone?: string;
  regon?: string;
  wojewodztwo?: string;
  powiat?: string;
  gmina?: string;
  created_at: string;
  last_gus_update?: string;
}

interface ClientStats {
  totalOffers: number;
  acceptedOffers: number;
  totalValue: number;
  lastOfferDate?: string;
}

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [gusLoading, setGusLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Nowy klient form
  const [newClient, setNewClient] = useState({
    nip: '',
    name: '',
    address: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchClientStats(selectedClient.id);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Błąd pobierania klientów:', error);
      showNotification('error', 'Błąd podczas pobierania listy klientów');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientStats = async (clientId: number) => {
    try {
      const { data: offers, error } = await supabase
        .from('offers')
        .select('status, total_net, created_at')
        .eq('client_id', clientId);

      if (error) throw error;

      const stats: ClientStats = {
        totalOffers: offers?.length || 0,
        acceptedOffers: offers?.filter(o => o.status === 'accepted').length || 0,
        totalValue: offers?.filter(o => o.status === 'accepted')
          .reduce((sum, o) => sum + (o.total_net || 0), 0) || 0,
        lastOfferDate: offers?.[0]?.created_at
      };

      setClientStats(stats);
    } catch (error) {
      console.error('Błąd pobierania statystyk:', error);
    }
  };

  const fetchFromGUS = async (nip: string) => {
    setGusLoading(true);
    try {
      const result = await gusService.searchByNIP(nip);
      
      if (result) {
        setNewClient(prev => ({
          ...prev,
          name: result.Nazwa,
          address: gusService.formatAddress(result),
          regon: result.Regon
        }));
        
        showNotification('success', 'Dane pobrane z GUS');
      } else {
        showNotification('error', 'Nie znaleziono firmy w bazie GUS');
      }
    } catch (error) {
      showNotification('error', 'Błąd podczas pobierania danych z GUS');
    } finally {
      setGusLoading(false);
    }
  };

  const addClient = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select()
        .single();

      if (error) throw error;

      setClients([...clients, data]);
      setShowAddModal(false);
      setNewClient({ nip: '', name: '', address: '', email: '', phone: '' });
      showNotification('success', 'Klient dodany pomyślnie');
    } catch (error) {
      console.error('Błąd dodawania klienta:', error);
      showNotification('error', 'Błąd podczas dodawania klienta');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.nip.includes(searchTerm) ||
    client.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nagłówek */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Klienci</h1>
              <p className="mt-1 text-sm text-gray-500">
                Zarządzaj bazą klientów i integruj z GUS
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Eksport
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Dodaj klienta
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Lista klientów */}
          <div className="flex-1">
            {/* Wyszukiwarka */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj po nazwie, NIP lub adresie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="bg-white rounded-lg shadow-sm border">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Brak klientów do wyświetlenia</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedClient?.id === client.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{client.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">NIP: {client.nip}</p>
                          {client.address && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                              <MapPin className="w-3 h-3" />
                              <span>{client.address}</span>
                            </div>
                          )}
                          <div className="flex gap-4 mt-2">
                            {client.email && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span>{client.email}</span>
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Phone className="w-3 h-3" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {client.last_gus_update && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span>GUS</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panel szczegółów */}
          {selectedClient && (
            <div className="w-96 bg-white rounded-lg shadow-sm border p-6 animate-slideIn">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Szczegóły klienta</h2>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{selectedClient.name}</h3>
                  <p className="text-sm text-gray-500">NIP: {selectedClient.nip}</p>
                  {selectedClient.regon && (
                    <p className="text-sm text-gray-500">REGON: {selectedClient.regon}</p>
                  )}
                </div>

                <div className="space-y-2">
                  {selectedClient.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm">{selectedClient.address}</span>
                    </div>
                  )}
                  {selectedClient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedClient.email}`} className="text-sm text-blue-600 hover:underline">
                        {selectedClient.email}
                      </a>
                    </div>
                  )}
                  {selectedClient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${selectedClient.phone}`} className="text-sm text-blue-600 hover:underline">
                        {selectedClient.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Statystyki */}
                {clientStats && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-4">Statystyki</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <FileText className="w-4 h-4" />
                          <span className="text-xs">Oferty</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{clientStats.totalOffers}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 mb-1">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Zaakceptowane</span>
                        </div>
                        <p className="text-xl font-bold text-green-900">{clientStats.acceptedOffers}</p>
                      </div>
                    </div>
                    <div className="mt-4 bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-600 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">Wartość współpracy</span>
                      </div>
                      <p className="text-xl font-bold text-orange-900">
                        {new Intl.NumberFormat('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        }).format(clientStats.totalValue * 1.23)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Zobacz oferty
                  </button>
                  <button className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Edytuj dane
                  </button>
                </div>

                <div className="text-xs text-gray-400 text-center">
                  Dodano: {new Date(selectedClient.created_at).toLocaleDateString('pl-PL')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal dodawania klienta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-scaleIn">
            <h2 className="text-xl font-bold mb-4">Dodaj nowego klienta</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newClient.nip}
                    onChange={(e) => setNewClient({ ...newClient, nip: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="1234567890"
                  />
                  <button
                    onClick={() => fetchFromGUS(newClient.nip)}
                    disabled={!newClient.nip || gusLoading}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {gusLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa firmy</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <input
                  type="text"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={addClient}
                disabled={!newClient.name || !newClient.nip}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Dodaj klienta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notyfikacje */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg animate-slideUp ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}