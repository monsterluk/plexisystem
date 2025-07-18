import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Download,
  Eye,
  Copy,
  Link,
  Send,
  Printer,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  TrendingUp,
  Calendar,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { Offer } from '@/types/Offer';
import { getOffers } from '@/api/quotations';
import { Button } from '@/components/ui/Button';
import { PageWrapper, Card, SectionTitle, EmptyState, LoadingState } from '@/components/ui/PageWrapper';
import { printPDF } from '@/utils/generatePDF';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await getOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      offer.number.toLowerCase().includes(query) ||
      offer.client.name.toLowerCase().includes(query) ||
      offer.client.nip.includes(query) ||
      offer.salesperson.name.toLowerCase().includes(query) ||
      offer.projectName?.toLowerCase().includes(query);
    
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'sent':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'accepted':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Szkic';
      case 'sent':
        return 'Wysłana';
      case 'accepted':
        return 'Zaakceptowana';
      case 'rejected':
        return 'Odrzucona';
      default:
        return status;
    }
  };

  const duplicateOffer = async (offer: Offer) => {
    const baseNumber = offer.number.split('-v')[0];
    const existingVersions = offers.filter((o) => o.number.startsWith(baseNumber));
    const nextVersion = Math.max(...existingVersions.map((o) => o.version || 1)) + 1;

    const duplicatedOffer: Offer = {
      ...offer,
      id: Date.now(),
      number: `${baseNumber}-v${nextVersion}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      version: nextVersion,
      items: offer.items.map((item) => ({
        ...item,
        id: Date.now() + Math.random(),
      })),
      shareLink: `https://plexisystem.pl/oferta/${baseNumber}-v${nextVersion}-${Math.random().toString(36).substring(2, 9)}`,
    };

    setOffers([...offers, duplicatedOffer]);
    navigate(`/offer/${duplicatedOffer.id}`);
  };

  const handleShareLink = (offer: Offer) => {
    navigator.clipboard.writeText(offer.shareLink || '');
    alert('Link do oferty skopiowany do schowka!');
  };

  const exportToCSV = () => {
    const headers = [
      'Numer',
      'Data',
      'Klient',
      'NIP',
      'Wartość netto',
      'Rabat %',
      'Po rabacie',
      'Status',
      'Handlowiec',
      'Projekt',
    ];
    const rows = filteredOffers.map((offer) => [
      offer.number,
      offer.date,
      offer.client.name,
      offer.client.nip,
      offer.totalNet.toFixed(2),
      offer.discount,
      offer.totalNetAfterDiscount.toFixed(2),
      getStatusText(offer.status),
      offer.salesperson.name,
      offer.projectName || '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `oferty_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const updateOfferStatus = async (offerId: number, newStatus: string) => {
    const updatedOffers = offers.map((offer) =>
      offer.id === offerId ? { ...offer, status: newStatus } : offer
    );
    setOffers(updatedOffers);
    // TODO: Zapisz zmianę statusu w API
  };

  // Calculate stats
  const stats = {
    total: offers.length,
    draft: offers.filter(o => o.status === 'draft').length,
    sent: offers.filter(o => o.status === 'sent').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    totalValue: offers.reduce((sum, o) => sum + o.totalNetAfterDiscount, 0),
  };

  const pageActions = (
    <>
      <Button onClick={exportToCSV} variant="secondary">
        <Download className="w-5 h-5" />
        Eksport CSV
      </Button>
      <Button onClick={() => navigate('/offer/new')} variant="primary">
        <Plus className="w-5 h-5" />
        Nowa oferta
      </Button>
    </>
  );

  if (loading) {
    return (
      <PageWrapper title="Historia ofert">
        <LoadingState />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Historia ofert" 
      subtitle="Zarządzaj swoimi ofertami i śledź ich status"
      actions={pageActions}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Wszystkie oferty</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Zaakceptowane</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.accepted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">W trakcie</p>
                <p className="text-2xl font-bold text-blue-400">{stats.sent}</p>
              </div>
              <Send className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Łączna wartość</p>
                <p className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat('pl-PL', {
                    style: 'currency',
                    currency: 'PLN',
                    minimumFractionDigits: 0,
                  }).format(stats.totalValue)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-400" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj po numerze, kliencie, NIP, projekcie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-700/50 rounded-xl pl-10 pr-4 py-3 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-zinc-700/50 rounded-xl px-4 py-3 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="draft">Szkice</option>
              <option value="sent">Wysłane</option>
              <option value="accepted">Zaakceptowane</option>
              <option value="rejected">Odrzucone</option>
            </select>
            <button className="p-3 bg-zinc-700/50 rounded-xl border border-zinc-600 hover:border-purple-500 transition-all">
              <Filter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </Card>

      {/* Offers Table */}
      <Card className="overflow-hidden">
        {filteredOffers.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title="Brak ofert do wyświetlenia"
            description="Utwórz swoją pierwszą ofertę, aby rozpocząć"
            action={
              <Button onClick={() => navigate('/offer/new')} variant="primary">
                <Plus className="w-5 h-5" />
                Nowa oferta
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left p-4 text-gray-400 font-medium">Numer</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Data</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Klient / Projekt</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Wartość</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Handlowiec</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer, index) => {
                  const daysUntilExpiry = Math.ceil(
                    (new Date(offer.validUntil) - new Date()) / (1000 * 60 * 60 * 24)
                  );
                  const isExpiringSoon =
                    daysUntilExpiry <= 2 && daysUntilExpiry > 0 && offer.status === 'sent';

                  return (
                    <motion.tr
                      key={offer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-zinc-700/50 hover:bg-zinc-800/30 transition-all ${
                        isExpiringSoon ? 'bg-yellow-900/10' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-white">{offer.number}</span>
                          {offer.version > 1 && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
                              v{offer.version}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-300">{offer.date}</span>
                        </div>
                        {isExpiringSoon && (
                          <div className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Wygasa za {daysUntilExpiry} dni
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">{offer.client.name}</p>
                          <p className="text-sm text-gray-500">NIP: {offer.client.nip}</p>
                          {offer.projectName && (
                            <p className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                              {offer.projectName}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-mono font-medium text-white">
                            {offer.totalNet.toFixed(2)} zł
                          </p>
                          {offer.discount > 0 && (
                            <>
                              <p className="text-sm text-orange-400">-{offer.discount}%</p>
                              <p className="text-sm font-mono font-bold text-emerald-400">
                                {offer.totalNetAfterDiscount.toFixed(2)} zł
                              </p>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={offer.status}
                          onChange={(e) => updateOfferStatus(offer.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border ${getStatusColor(
                            offer.status
                          )} bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                        >
                          <option value="draft">Szkic</option>
                          <option value="sent">Wysłana</option>
                          <option value="accepted">Zaakceptowana</option>
                          <option value="rejected">Odrzucona</option>
                        </select>
                      </td>
                      <td className="p-4 text-gray-300">{offer.salesperson.name}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/offer/${offer.id}`)}
                            className="p-2 hover:bg-zinc-700 rounded-lg transition-all group"
                            title="Podgląd oferty"
                          >
                            <Eye className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => duplicateOffer(offer)}
                            className="p-2 hover:bg-zinc-700 rounded-lg transition-all group"
                            title="Powiel ofertę"
                          >
                            <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleShareLink(offer)}
                            className="p-2 hover:bg-zinc-700 rounded-lg transition-all group"
                            title="Kopiuj link"
                          >
                            <Link className="w-4 h-4 text-gray-400 group-hover:text-emerald-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => printPDF(offer, true)}
                            className="p-2 hover:bg-zinc-700 rounded-lg transition-all group"
                            title="Drukuj PDF"
                          >
                            <Printer className="w-4 h-4 text-gray-400 group-hover:text-amber-400" />
                          </motion.button>
                          <div className="relative group">
                            <button className="p-2 hover:bg-zinc-700 rounded-lg transition-all">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageWrapper>
  );
};