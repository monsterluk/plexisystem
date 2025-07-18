import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, UserPlus, Building2, MapPin, Phone, Mail, Calendar, TrendingUp, 
  FileText, Loader2, RefreshCw, Download, Upload, CheckCircle, AlertCircle, 
  X, Hash, Globe, Target, DollarSign, Activity, Award
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { PageWrapper, Card, SectionTitle, LoadingState, EmptyState, StatCard } from '@/components/ui/PageWrapper';
import { Button } from '@/components/ui/Button';

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
      // Placeholder - implement actual GUS integration
      showNotification('error', 'Integracja z GUS w przygotowaniu');
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

  const pageActions = (
    <>
      <Button variant="secondary">
        <Upload className="w-5 h-5" />
        Import
      </Button>
      <Button variant="secondary">
        <Download className="w-5 h-5" />
        Eksport
      </Button>
      <Button onClick={() => setShowAddModal(true)} variant="primary">
        <UserPlus className="w-5 h-5" />
        Dodaj klienta
      </Button>
    </>
  );

  if (loading) {
    return (
      <PageWrapper title="Klienci" subtitle="Zarządzaj bazą klientów i integruj z GUS" actions={pageActions}>
        <LoadingState />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Klienci" 
      subtitle="Zarządzaj bazą klientów i integruj z GUS"
      actions={pageActions}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Building2 className="w-6 h-6" />}
          label="Wszyscy klienci"
          value={clients.length}
          color="purple"
          progress={75}
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="Aktywni klienci"
          value={Math.floor(clients.length * 0.7)}
          color="emerald"
          progress={70}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Nowi w tym miesiącu"
          value={12}
          trend={{ value: 15, isPositive: true }}
          color="amber"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="Top klienci"
          value={5}
          color="blue"
        />
      </div>

      <div className="flex gap-6">
        {/* Lista klientów */}
        <div className="flex-1">
          <Card className="p-6">
            {/* Wyszukiwarka */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  placeholder="Szukaj po nazwie, NIP lub adresie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-700/50 backdrop-blur rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Lista */}
            {filteredClients.length === 0 ? (
              <EmptyState
                icon={<Building2 className="w-12 h-12" />}
                title="Brak klientów"
                description="Dodaj pierwszego klienta do bazy"
                action={
                  <Button onClick={() => setShowAddModal(true)} variant="primary">
                    <UserPlus className="w-5 h-5" />
                    Dodaj klienta
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredClients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedClient?.id === client.id 
                        ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30' 
                        : 'bg-zinc-800/50 hover:bg-zinc-800/70 border border-zinc-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">{client.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">NIP: {client.nip}</p>
                          {client.address && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>{client.address}</span>
                            </div>
                          )}
                          <div className="flex gap-4 mt-2">
                            {client.email && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Mail className="w-3 h-3" />
                                <span>{client.email}</span>
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Phone className="w-3 h-3" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {client.last_gus_update && (
                        <div className="flex items-center gap-1 text-xs text-emerald-500">
                          <CheckCircle className="w-3 h-3" />
                          <span>GUS</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Panel szczegółów */}
        <AnimatePresence>
          {selectedClient && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="w-96"
            >
              <Card className="p-6" gradient>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold text-white">Szczegóły klienta</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedClient(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{selectedClient.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">NIP: {selectedClient.nip}</p>
                    {selectedClient.regon && (
                      <p className="text-sm text-gray-400">REGON: {selectedClient.regon}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedClient.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                        <span className="text-sm text-gray-300">{selectedClient.address}</span>
                      </div>
                    )}
                    {selectedClient.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <a href={`mailto:${selectedClient.email}`} className="text-sm text-purple-400 hover:text-purple-300">
                          {selectedClient.email}
                        </a>
                      </div>
                    )}
                    {selectedClient.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <a href={`tel:${selectedClient.phone}`} className="text-sm text-purple-400 hover:text-purple-300">
                          {selectedClient.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Statystyki */}
                  {clientStats && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Statystyki</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-800/50 p-3 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs">Oferty</span>
                          </div>
                          <p className="text-xl font-bold text-white">{clientStats.totalOffers}</p>
                        </div>
                        <div className="bg-emerald-900/20 p-3 rounded-xl border border-emerald-500/30">
                          <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs">Zaakceptowane</span>
                          </div>
                          <p className="text-xl font-bold text-emerald-400">{clientStats.acceptedOffers}</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-4 rounded-xl border border-amber-500/30">
                        <div className="flex items-center gap-2 text-amber-400 mb-2">
                          <DollarSign className="w-5 h-5" />
                          <span className="text-sm">Wartość współpracy</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-400">
                          {new Intl.NumberFormat('pl-PL', {
                            style: 'currency',
                            currency: 'PLN'
                          }).format(clientStats.totalValue * 1.23)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button variant="primary" className="w-full">
                      Zobacz oferty
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Edytuj dane
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Dodano: {new Date(selectedClient.created_at).toLocaleDateString('pl-PL')}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal dodawania klienta */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-800 rounded-2xl w-full max-w-md p-6 border border-zinc-700"
            >
              <h2 className="text-xl font-bold text-white mb-6">Dodaj nowego klienta</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">NIP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newClient.nip}
                      onChange={(e) => setNewClient({ ...newClient, nip: e.target.value })}
                      className="flex-1 px-4 py-3 bg-zinc-700/50 rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="1234567890"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchFromGUS(newClient.nip)}
                      disabled={!newClient.nip || gusLoading}
                      className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {gusLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nazwa firmy</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Adres</label>
                  <input
                    type="text"
                    value={newClient.address}
                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 rounded-xl text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Anuluj
                </Button>
                <Button
                  onClick={addClient}
                  disabled={!newClient.name || !newClient.nip}
                  variant="primary"
                  className="flex-1"
                >
                  Dodaj klienta
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notyfikacje */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg ${
              notification.type === 'success' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}