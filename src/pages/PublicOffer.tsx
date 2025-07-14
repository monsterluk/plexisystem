// src/pages/PublicOffer.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Download, Building2, Package, Truck } from 'lucide-react';
import { getOfferByToken } from '@/api/quotations';
import { generatePDF } from '@/utils/generatePDF';
import { Offer } from '@/types/Offer';
import { deliveryRegions } from '@/constants/materials';

export const PublicOffer: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (token) {
      loadOffer(token);
    }
  }, [token]);

  const loadOffer = async (shareToken: string) => {
    try {
      const data = await getOfferByToken(shareToken);
      setOffer(data);
    } catch (error) {
      console.error('Error loading offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async () => {
    if (!offer || !token) return;
    
    setAccepting(true);
    try {
      // TODO: Implementuj akceptację oferty
      alert('Dziękujemy za akceptację oferty! Skontaktujemy się wkrótce.');
    } catch (error) {
      console.error('Error accepting offer:', error);
    } finally {
      setAccepting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!offer) return;
    
    try {
      const pdfBlob = await generatePDF(offer, 'client');
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Oferta_${offer.number}.pdf`;
      a.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Oferta nie została znaleziona</h1>
          <p className="text-gray-400">Link może być nieprawidłowy lub oferta wygasła.</p>
        </div>
      </div>
    );
  }

  const deliveryRegion = deliveryRegions.find(r => r.id === offer.deliveryRegion);
  const finalTotal = offer.totalNetAfterDiscount + offer.deliveryCost;

  return (
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Nagłówek */}
        <div className="bg-zinc-800 rounded-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Oferta {offer.number}
              </h1>
              <p className="text-gray-400">Data wystawienia: {offer.date}</p>
              <p className="text-gray-400">Ważna do: {offer.validUntil}</p>
            </div>
            <div className="text-right">
              <img 
                src="/logo.png" 
                alt="PlexiSystem" 
                className="h-12 mb-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-orange-500 font-bold">PlexiSystem S.C.</p>
            </div>
          </div>

          {offer.projectName && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-400">Projekt:</p>
              <p className="text-xl font-semibold text-white">{offer.projectName}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-400">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">{offer.client.name}</span>
          </div>
          {offer.client.address && (
            <p className="text-gray-400 ml-7">{offer.client.address}</p>
          )}
        </div>

        {/* Pozycje oferty */}
        <div className="bg-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-500" />
            Specyfikacja produktów
          </h2>
          
          <div className="space-y-4">
            {offer.items.map((item, index) => (
              <div key={item.id} className="bg-zinc-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {index + 1}. {item.productName}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {item.materialName}, {item.thickness} mm
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{item.totalPrice.toFixed(2)} zł</p>
                    <p className="text-sm text-gray-400">
                      {item.quantity} szt × {item.unitPrice.toFixed(2)} zł
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-400">
                  <div>
                    Wymiary: {item.dimensions.width} × {item.dimensions.height}
                    {item.dimensions.depth > 0 && ` × ${item.dimensions.depth}`} mm
                  </div>
                  <div>
                    Powierzchnia: {item.calculations?.surface.toFixed(3)} m²
                  </div>
                  <div>
                    Waga: {item.calculations?.weight.toFixed(2)} kg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Podsumowanie finansowe */}
        <div className="bg-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Podsumowanie</h2>
          
          <table className="w-full">
            <tbody>
              <tr className="border-b border-zinc-700">
                <td className="py-2">Wartość netto</td>
                <td className="py-2 text-right font-mono">{offer.totalNet.toFixed(2)} zł</td>
              </tr>
              {offer.discount > 0 && (
                <tr className="border-b border-zinc-700">
                  <td className="py-2">Rabat ({offer.discount}%)</td>
                  <td className="py-2 text-right font-mono text-green-500">
                    -{offer.discountValue.toFixed(2)} zł
                  </td>
                </tr>
              )}
              <tr className="border-b border-zinc-700">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-400" />
                    Dostawa ({deliveryRegion?.name})
                  </div>
                </td>
                <td className="py-2 text-right font-mono">
                  {offer.deliveryCost > 0 ? `${offer.deliveryCost.toFixed(2)} zł` : 'Gratis'}
                </td>
              </tr>
              <tr className="text-xl font-bold">
                <td className="pt-4">Do zapłaty netto</td>
                <td className="pt-4 text-right font-mono text-orange-500">
                  {finalTotal.toFixed(2)} zł
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Warunki */}
        <div className="bg-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Warunki realizacji</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Czas realizacji:</p>
              <p className="font-medium">{offer.terms.deliveryTime}</p>
            </div>
            <div>
              <p className="text-gray-400">Sposób dostawy:</p>
              <p className="font-medium">{offer.terms.deliveryMethod}</p>
            </div>
            <div>
              <p className="text-gray-400">Warunki płatności:</p>
              <p className="font-medium">{offer.terms.paymentTerms}</p>
            </div>
            <div>
              <p className="text-gray-400">Gwarancja:</p>
              <p className="font-medium">{offer.terms.warranty}</p>
            </div>
          </div>

          {offer.comment && (
            <div className="mt-4 p-4 bg-zinc-700 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Uwagi:</p>
              <p>{offer.comment}</p>
            </div>
          )}
        </div>

        {/* Przyciski akcji */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-all"
          >
            <Download className="w-5 h-5" />
            Pobierz PDF
          </button>
          
          <button
            onClick={handleAcceptOffer}
            disabled={accepting || offer.status === 'accepted'}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <Check className="w-5 h-5" />
            {accepting ? 'Przetwarzanie...' : 
             offer.status === 'accepted' ? 'Oferta zaakceptowana' : 
             'Akceptuję ofertę'}
          </button>
        </div>

        {/* Stopka */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>PlexiSystem S.C. | Ks. Dr. Leona Heyke 11, 84-206 Nowy Dwór Wejherowski</p>
          <p>Tel: 884 042 107 | Email: biuro@plexisystem.pl | NIP: 588-239-62-72</p>
        </div>
      </div>
    </div>
  );
};