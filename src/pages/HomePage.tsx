import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Offer } from '@/types/Offer';
import { getOffers } from '@/api/quotations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { deliveryRegions } from '@/constants/materials';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    return (
      offer.number.toLowerCase().includes(query) ||
      offer.client.name.toLowerCase().includes(query) ||
      offer.client.nip.includes(query) ||
      offer.salesperson.name.toLowerCase().includes(query) ||
      offer.projectName?.toLowerCase().includes(query)
    );
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
        return 'bg-gray-500';
      case 'sent':
        return 'bg-blue-500';
      case 'accepted':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Historia ofert</h2>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="secondary">
            <Download className="w-5 h-5" />
            Eksport CSV
          </Button>
          <Button onClick={() => navigate('/offer/new')} variant="primary">
            <Plus className="w-5 h-5" />
            Nowa oferta
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj po numerze, kliencie, NIP, projekcie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white"
          />
        </div>
      </div>

      <div className="bg-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left p-4">Numer</th>
              <th className="text-left p-4">Data</th>
              <th className="text-left p-4">Klient / Projekt</th>
              <th className="text-left p-4">Wartość</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Handlowiec</th>
              <th className="text-left p-4">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.map((offer) => {
              const daysUntilExpiry = Math.ceil(
                (new Date(offer.validUntil) - new Date()) / (1000 * 60 * 60 * 24)
              );
              const isExpiringSoon =
                daysUntilExpiry <= 2 && daysUntilExpiry > 0 && offer.status === 'sent';

              return (
                <tr
                  key={offer.id}
                  className={`border-b border-zinc-700 hover:bg-zinc-700/50 ${
                    isExpiringSoon ? 'bg-yellow-900/20' : ''
                  }`}
                >
                  <td className="p-4 font-mono">
                    {offer.number}
                    {offer.version > 1 && (
                      <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                        v{offer.version}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {offer.date}
                    {isExpiringSoon && (
                      <div className="text-xs text-yellow-400 mt-1">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        Wygasa za {daysUntilExpiry} dni
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{offer.client.name}</p>
                      <p className="text-sm text-gray-400">NIP: {offer.client.nip}</p>
                      {offer.projectName && (
                        <p className="text-xs text-blue-400 mt-1">📁 {offer.projectName}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-mono">{offer.totalNet.toFixed(2)} zł</p>
                      {offer.discount > 0 && (
                        <>
                          <p className="text-sm text-orange-400">-{offer.discount}%</p>
                          <p className="text-sm font-mono font-semibold">
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
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${getStatusColor(
                        offer.status
                      )} text-white border-0`}
                    >
                      <option value="draft">Szkic</option>
                      <option value="sent">Wysłana</option>
                      <option value="accepted">Zaakceptowana</option>
                      <option value="rejected">Odrzucona</option>
                    </select>
                  </td>
                  <td className="p-4">{offer.salesperson.name}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/offer/${offer.id}`)}
                        className="p-2 hover:bg-zinc-600 rounded transition-all"
                        title="Podgląd oferty"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateOffer(offer)}
                        className="p-2 hover:bg-zinc-600 rounded transition-all"
                        title="Powiel ofertę"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShareLink(offer)}
                        className="p-2 hover:bg-zinc-600 rounded transition-all"
                        title="Kopiuj link"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/offer/${offer.id}`)}
                        className="p-2 hover:bg-zinc-600 rounded transition-all"
                        title="Drukuj PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Brak ofert do wyświetlenia</p>
          </div>
        )}
      </div>
    </div>
  );
};