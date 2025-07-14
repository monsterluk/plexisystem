import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Download, Phone, Mail } from 'lucide-react';
import { Offer } from '@/types/Offer';
import { getOfferByShareLink, acceptOffer, rejectOffer } from '@/api/quotations';
import { generatePDF } from '@/utils/generatePDF';
import { Button } from '@/components/ui/Button';
import { expositorTypes } from '@/constants/materials';
import { additionalOptions } from '@/constants/options';

export const OfferAcceptance: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [decision, setDecision] = useState<'accepted' | 'rejected' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (shareId) {
      loadOffer(shareId);
    }
  }, [shareId]);

  const loadOffer = async (id: string) => {
    setLoading(true);
    try {
      const data = await getOfferByShareLink(id);
      setOffer(data);
      if (data.status === 'accepted' || data.status === 'rejected') {
        setDecision(data.status);
      }
    } catch (error) {
      console.error('Error loading offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!offer || !shareId) return;

    setProcessing(true);
    try {
      await acceptOffer(offer.id);
      setDecision('accepted');
      setOffer({ ...offer, status: 'accepted' });
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('Wystąpił błąd podczas akceptacji oferty');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!offer || !shareId || !rejectionReason.trim()) {
      alert('Proszę podać powód odrzucenia oferty');
      return;
    }

    setProcessing(true);
    try {
      await rejectOffer(offer.id, rejectionReason);
      setDecision('rejected');
      setOffer({ ...offer, status: 'rejected' });
    } catch (error) {
      console.error('Error rejecting offer:', error);
      alert('Wystąpił błąd podczas odrzucania oferty');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!offer) return;
    generatePDF(offer, 'client');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Nie znaleziono oferty
          </h1>
          <p className="text-gray-600">
            Link do oferty jest nieprawidłowy lub oferta została usunięta.
          </p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(offer.validUntil) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nagłówek */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-orange-500 mb-2">PlexiSystem</h1>
              <p className="text-gray-600">Producent wyrobów z plexi i tworzyw sztucznych</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Oferta nr</p>
              <p className="text-xl font-bold text-gray-800">{offer.number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status oferty */}
      {decision && (
        <div className={`${decision === 'accepted' ? 'bg-green-50' : 'bg-red-50'} border-b`}>
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              {decision === 'accepted' ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-800 font-medium">
                    Oferta została zaakceptowana
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600" />
                  <p className="text-red-800 font-medium">Oferta została odrzucona</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Treść oferty */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Informacje o kliencie */}
          <div className="mb-8 pb-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Oferta dla:</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-lg">{offer.client.name}</p>
                <p className="text-gray-600">{offer.client.address}</p>
                <p className="text-gray-600">NIP: {offer.client.nip}</p>
              </div>
              <div>
                <p className="text-gray-600">Data wystawienia: {offer.date}</p>
                <p className="text-gray-600">Ważna do: {offer.validUntil}</p>
                {offer.projectName && (
                  <p className="text-gray-600 mt-2">
                    Projekt: <span className="font-medium">{offer.projectName}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pozycje oferty */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Specyfikacja produktów</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Lp.</th>
                    <th className="text-left p-2">Produkt</th>
                    <th className="text-left p-2">Wymiary</th>
                    <th className="text-left p-2">Materiał</th>
                    <th className="text-center p-2">Ilość</th>
                    <th className="text-right p-2">Cena jedn.</th>
                    <th className="text-right p-2">Wartość</th>
                  </tr>
                </thead>
                <tbody>
                  {offer.items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                        <p className="font-medium">{item.productName}</p>
                        {item.expositorType && (
                          <p className="text-sm text-gray-600">
                            {expositorTypes.find((t) => t.id === item.expositorType)?.name}
                          </p>
                        )}
                      </td>
                      <td className="p-2 text-sm">
                        {item.dimensions.width} × {item.dimensions.height}
                        {item.dimensions.depth > 0 && ` × ${item.dimensions.depth}`} mm
                      </td>
                      <td className="p-2">
                        <p>{item.materialName}</p>
                        <p className="text-sm text-gray-600">{item.thickness} mm</p>
                      </td>
                      <td className="p-2 text-center">{item.quantity} szt</td>
                      <td className="p-2 text-right font-mono">
                        {item.unitPrice.toFixed(2)} zł
                      </td>
                      <td className="p-2 text-right font-mono font-bold">
                        {item.totalPrice.toFixed(2)} zł
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={6} className="p-2 text-right font-semibold">
                      Wartość netto:
                    </td>
                    <td className="p-2 text-right font-mono font-bold">
                      {offer.totalNet.toFixed(2)} zł
                    </td>
                  </tr>
                  {offer.discount > 0 && (
                    <tr>
                      <td colSpan={6} className="p-2 text-right">
                        Rabat {offer.discount}%:
                      </td>
                      <td className="p-2 text-right font-mono text-orange-600">
                        -{offer.discountValue.toFixed(2)} zł
                      </td>
                    </tr>
                  )}
                  {offer.deliveryCost > 0 && (
                    <tr>
                      <td colSpan={6} className="p-2 text-right">
                        Koszt dostawy:
                      </td>
                      <td className="p-2 text-right font-mono">
                        {offer.deliveryCost.toFixed(2)} zł
                      </td>
                    </tr>
                  )}
                  <tr className="bg-orange-50">
                    <td colSpan={6} className="p-3 text-right font-bold text-lg">
                      RAZEM NETTO:
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-xl">
                      {(offer.totalNetAfterDiscount + offer.deliveryCost).toFixed(2)} zł
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Warunki handlowe */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Warunki realizacji</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Czas realizacji:</span>{' '}
                {offer.terms.deliveryTime}
              </p>
              <p>
                <span className="font-medium">Dostawa:</span>{' '}
                {offer.terms.deliveryMethod}
              </p>
              <p>
                <span className="font-medium">Płatność:</span>{' '}
                {offer.terms.paymentTerms}
              </p>
              <p>
                <span className="font-medium">Gwarancja:</span> {offer.terms.warranty}
              </p>
              {offer.comment && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium">Uwagi:</p>
                  <p className="text-gray-700">{offer.comment}</p>
                </div>
              )}
            </div>
          </div>

          {/* Kontakt */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Kontakt w sprawie oferty:</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">{offer.salesperson.name}</p>
                  <p className="text-blue-600">{offer.salesperson.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <a
                  href={`mailto:${offer.salesperson.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {offer.salesperson.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Przyciski akcji */}
        {!decision && !isExpired && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Decyzja dotycząca oferty</h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Button
                  onClick={handleAccept}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={processing}
                >
                  <CheckCircle className="w-5 h-5" />
                  Akceptuję ofertę
                </Button>

                <Button
                  onClick={() => setDecision('rejected')}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  disabled={processing}
                >
                  <XCircle className="w-5 h-5" />
                  Odrzucam ofertę
                </Button>
              </div>

              {decision === 'rejected' && !processing && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Powód odrzucenia (opcjonalnie)
                    </span>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                      placeholder="Proszę podać powód odrzucenia oferty..."
                    />
                  </label>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleReject}
                      variant="secondary"
                      className="flex-1"
                      disabled={processing}
                    >
                      Potwierdź odrzucenie
                    </Button>
                    <Button
                      onClick={() => {
                        setDecision(null);
                        setRejectionReason('');
                      }}
                      variant="secondary"
                      className="flex-1"
                    >
                      Anuluj
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button onClick={handleDownloadPDF} variant="secondary" className="w-full">
                <Download className="w-5 h-5" />
                Pobierz ofertę PDF
              </Button>
            </div>
          </div>
        )}

        {isExpired && !decision && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">
              Ta oferta wygasła dnia {offer.validUntil}
            </p>
            <p className="text-yellow-700 mt-2">
              Skontaktuj się z nami w celu otrzymania nowej oferty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};