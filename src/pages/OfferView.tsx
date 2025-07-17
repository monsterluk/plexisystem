import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, FileText, Send, ExternalLink, Trash2, Lock } from 'lucide-react';
import { Offer, CalculatorItem } from '@/types/Offer';
import { saveOffer, getOffer } from '@/api/quotations';
import { generatePDF } from '@/utils/generatePDF';
import { sendOfferEmail } from '@/utils/sendEmail';
import { deliveryRegions, salespeople } from '@/constants/materials';
import { useOffer } from '@/context/OfferContext';
import { useUser } from '@/context/UserContext';
import { ClientForm } from '@/components/client/ClientForm';
import { Calculator } from '@/components/quotation/Calculator';
import { ItemSummary } from '@/components/quotation/ItemSummary';
import { OfferSummary } from '@/components/offer/OfferSummary';
import { Button } from '@/components/ui/Button';

export const OfferView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOffer, setCurrentOffer, updateClient } = useOffer();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [viewMode, setViewMode] = useState<'salesperson' | 'client'>('salesperson');

  // Funkcje pomocnicze do aktualizacji
  const updateOfferField = (field: string, value: any) => {
    setCurrentOffer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateOfferTerms = (field: string, value: string) => {
    setCurrentOffer(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        [field]: value
      }
    }));
  };

  useEffect(() => {
    if (id && id !== 'new') {
      loadOffer(parseInt(id));
    } else {
      // Nowa oferta
      const newOffer: Offer = {
        id: Date.now(),
        number: generateOfferNumber(),
        date: new Date().toISOString().split('T')[0],
        client: {
          nip: '',
          name: '',
          address: '',
          email: '',
          phone: '',
          regon: '',
        },
        items: [],
        terms: {
          deliveryTime: '3-10 dni roboczych',
          deliveryMethod: 'Kurier / odbiór osobisty',
          paymentTerms: 'Przelew 7 dni',
          warranty: 'Produkty niestandardowe nie podlegają zwrotowi',
          validity: '7 dni',
        },
        status: 'draft',
        salesperson: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.id === 'LS' ? '884 042 107' : '884 042 109'
        },
        comment: '',
        internalNotes: '',
        totalNet: 0,
        discount: 10,
        discountValue: 0,
        totalNetAfterDiscount: 0,
        version: 1,
        projectName: '',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        deliveryRegion: 'odbior',
        deliveryCost: 0,
        shareLink: '',
      };
      setCurrentOffer(newOffer);
      setLoading(false);
    }
  }, [id]);

  const loadOffer = async (offerId: number) => {
    setLoading(true);
    try {
      const data = await getOffer(offerId);
      setCurrentOffer(data);
    } catch (error) {
      console.error('Error loading offer:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const generateOfferNumber = () => {
    const year = new Date().getFullYear();
    const userPrefix = currentUser.id;
    const nextNumber = Math.floor(Math.random() * 9999) + 1;
    return `${userPrefix}-${year}-${String(nextNumber).padStart(4, '0')}`;
  };

  const handleAddItem = (item: CalculatorItem) => {
    if (!currentOffer) return;

    const newTotal = currentOffer.totalNet + item.totalPrice;
    const discountValue = (newTotal * currentOffer.discount) / 100;

    setCurrentOffer({
      ...currentOffer,
      items: [...currentOffer.items, item],
      totalNet: newTotal,
      discountValue: discountValue,
      totalNetAfterDiscount: newTotal - discountValue,
    });
  };

  const handleRemoveItem = (itemId: number) => {
    if (!currentOffer) return;

    const item = currentOffer.items.find((i) => i.id === itemId);
    if (item) {
      const newTotal = currentOffer.totalNet - item.totalPrice;
      const discountValue = (newTotal * currentOffer.discount) / 100;

      setCurrentOffer({
        ...currentOffer,
        items: currentOffer.items.filter((i) => i.id !== itemId),
        totalNet: newTotal,
        discountValue: discountValue,
        totalNetAfterDiscount: newTotal - discountValue,
      });
    }
  };

  const updateDiscount = (discount: number) => {
    if (!currentOffer) return;

    const discountValue = (currentOffer.totalNet * discount) / 100;
    setCurrentOffer({
      ...currentOffer,
      discount,
      discountValue,
      totalNetAfterDiscount: currentOffer.totalNet - discountValue,
    });
  };

  const updateDelivery = (regionId: string) => {
    if (!currentOffer) return;

    const region = deliveryRegions.find((r) => r.id === regionId);
    if (region) {
      const totalWeight = currentOffer.items.reduce(
        (sum, item) => sum + (item.calculations?.totalWeight || 0),
        0
      );
      const deliveryCost = Math.max(region.pricePerKg * totalWeight, region.minPrice);

      setCurrentOffer({
        ...currentOffer,
        deliveryRegion: regionId,
        deliveryCost: regionId === 'odbior' ? 0 : deliveryCost,
      });
    }
  };

  const handleSaveOffer = async () => {
    if (!currentOffer) return;

    setSaving(true);
    try {
      const savedOffer = await saveOffer(currentOffer);
      setCurrentOffer(savedOffer);
      alert('Oferta została zapisana!');
      navigate('/');
    } catch (error) {
      console.error('Error saving offer:', error);
      alert('Błąd podczas zapisywania oferty');
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!currentOffer) return;
    
    try {
      const pdfBlob = await generatePDF(currentOffer, viewMode);
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Błąd podczas generowania PDF');
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Usuń prefix "data:application/pdf;base64,"
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSendOffer = async () => {
    if (!currentOffer || !currentOffer.client.email) {
      alert('Brak adresu e-mail klienta');
      return;
    }

    setSending(true);
    try {
      // Najpierw zapisz ofertę jeśli nie jest zapisana
      let offerToSend = currentOffer;
      if (!currentOffer.id || !currentOffer.shareLink) {
        offerToSend = await saveOffer(currentOffer);
        setCurrentOffer(offerToSend);
      }

      // Generuj PDF
      const pdfBlob = await generatePDF(offerToSend, 'client');
      const pdfBase64 = await blobToBase64(pdfBlob);
      
      // Wyślij email
      const success = await sendOfferEmail(
        offerToSend.client.email,
        offerToSend.number,
        offerToSend.shareLink,
        pdfBase64
      );
      
      if (success) {
        alert(`Oferta została wysłana na adres: ${offerToSend.client.email}`);
        setCurrentOffer({ ...offerToSend, status: 'sent' });
      } else {
        alert('Błąd podczas wysyłania oferty. Sprawdź konfigurację email.');
      }
    } catch (error) {
      console.error('Błąd wysyłania:', error);
      alert('Wystąpił błąd podczas wysyłania oferty');
    } finally {
      setSending(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!currentOffer) return;

    try {
      // Zapisz ofertę jeśli nie jest zapisana
      let offerWithLink = currentOffer;
      if (!currentOffer.id || !currentOffer.shareLink) {
        offerWithLink = await saveOffer(currentOffer);
        setCurrentOffer(offerWithLink);
      }

      if (offerWithLink.shareLink) {
        navigator.clipboard.writeText(offerWithLink.shareLink);
        alert(`Link do oferty skopiowany do schowka!\n\n${offerWithLink.shareLink}`);
      }
    } catch (error) {
      console.error('Error generating link:', error);
      alert('Błąd podczas generowania linku');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!currentOffer) {
    return <div>Nie znaleziono oferty</div>;
  }

  return (
    <div className="space-y-8">
      {/* Nagłówek */}
      <div className="bg-zinc-800 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {id === 'new' ? 'Nowa oferta' : `Edycja oferty ${currentOffer.number}`}
            </h2>
            <p className="text-gray-400">Data: {currentOffer.date}</p>
            {currentOffer.shareLink && (
              <p className="text-sm text-gray-500 mt-1">
                Status: <span className={`font-medium ${
                  currentOffer.status === 'sent' ? 'text-green-500' : 
                  currentOffer.status === 'accepted' ? 'text-blue-500' : 
                  'text-yellow-500'
                }`}>
                  {currentOffer.status === 'draft' ? 'Szkic' :
                   currentOffer.status === 'sent' ? 'Wysłana' :
                   currentOffer.status === 'accepted' ? 'Zaakceptowana' :
                   'Odrzucona'}
                </span>
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-gray-400">Handlowiec</p>
            <p className="font-medium">{currentOffer.salesperson.name}</p>
            <p className="text-sm text-gray-400">{currentOffer.salesperson.phone}</p>
            {currentUser.role === 'admin' && currentOffer.salesperson.id !== currentUser.id && (
              <p className="text-xs text-yellow-400 mt-1">⚠️ Oferta innego handlowca</p>
            )}
          </div>
        </div>

        {/* Nazwa projektu */}
        <div className="mt-4">
          <label htmlFor="project-name" className="block text-sm font-medium mb-2 text-gray-400">
            Nazwa projektu
          </label>
          <input
            id="project-name"
            name="projectName"
            type="text"
            value={currentOffer.projectName || ''}
            onChange={(e) => updateOfferField('projectName', e.target.value)}
            placeholder="np. Ekspozytory targowe 2025"
            className="w-full bg-zinc-700 rounded-lg px-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Dane klienta */}
      <ClientForm
        client={currentOffer.client}
        onChange={updateClient}
      />

      {/* Pozycje oferty */}
      {currentOffer.items.length > 0 && (
        <div className="bg-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Pozycje oferty</h3>
          <div className="space-y-4">
            {currentOffer.items.map((item) => (
              <ItemSummary
                key={item.id}
                item={item}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
          </div>

          {/* Podsumowanie */}
          <OfferSummary
            offer={currentOffer}
            onDiscountChange={updateDiscount}
            onDeliveryChange={updateDelivery}
          />
        </div>
      )}

      {/* Kalkulator */}
      <div className="bg-zinc-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6">Dodaj pozycję do oferty</h3>
        <Calculator onAddToOffer={handleAddItem} viewMode={viewMode} />
      </div>

      {/* Warunki handlowe */}
      <div className="bg-zinc-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Warunki handlowe</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="delivery-time" className="block text-sm font-medium mb-2 text-gray-400">
              Czas realizacji
            </label>
            <input
              id="delivery-time"
              name="deliveryTime"
              type="text"
              value={currentOffer.terms.deliveryTime}
              onChange={(e) => updateOfferTerms('deliveryTime', e.target.value)}
              className="w-full bg-zinc-700 rounded-lg px-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="delivery-method" className="block text-sm font-medium mb-2 text-gray-400">
              Sposób dostawy
            </label>
            <input
              id="delivery-method"
              name="deliveryMethod"
              type="text"
              value={currentOffer.terms.deliveryMethod}
              onChange={(e) => updateOfferTerms('deliveryMethod', e.target.value)}
              className="w-full bg-zinc-700 rounded-lg px-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="payment-terms" className="block text-sm font-medium mb-2 text-gray-400">
              Warunki płatności
            </label>
            <input
              id="payment-terms"
              name="paymentTerms"
              type="text"
              value={currentOffer.terms.paymentTerms}
              onChange={(e) => updateOfferTerms('paymentTerms', e.target.value)}
              className="w-full bg-zinc-700 rounded-lg px-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="validity" className="block text-sm font-medium mb-2 text-gray-400">
              Ważność oferty
            </label>
            <input
              id="validity"
              name="validity"
              type="text"
              value={currentOffer.terms.validity}
              onChange={(e) => updateOfferTerms('validity', e.target.value)}
              className="w-full bg-zinc-700 rounded-lg px-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-2 text-gray-400">
            Uwagi do oferty (widoczne dla klienta)
          </label>
          <textarea
            id="comment"
            name="comment"
            value={currentOffer.comment}
            onChange={(e) => updateOfferField('comment', e.target.value)}
            rows={3}
            className="w-full bg-zinc-700 rounded-lg px-3 py-2 text-white border border-zinc-600 focus:border-orange-500 focus:outline-none"
            placeholder="Dodatkowe informacje dla klienta..."
          />
        </div>

        {viewMode === 'salesperson' && (
          <div className="mt-4">
            <label htmlFor="internal-notes" className="block text-sm font-medium mb-2 text-yellow-400">
              <Lock className="w-4 h-4 inline mr-1" />
              Notatki wewnętrzne (niewidoczne dla klienta)
            </label>
            <textarea
              id="internal-notes"
              name="internalNotes"
              value={currentOffer.internalNotes}
              onChange={(e) => updateOfferField('internalNotes', e.target.value)}
              rows={3}
              className="w-full bg-zinc-700 rounded-lg px-3 py-2 border border-yellow-600/30 text-white"
              placeholder="Notatki dla zespołu sprzedaży..."
            />
          </div>
        )}
      </div>

      {/* Przyciski akcji */}
      <div className="flex justify-between items-center">
        <Button onClick={() => navigate('/')} variant="secondary">
          Anuluj
        </Button>

        <div className="flex gap-4">
          <Button
            onClick={handleSaveOffer}
            variant="secondary"
            disabled={saving || currentOffer.items.length === 0}
          >
            <Check className="w-5 h-5" />
            {saving ? 'Zapisywanie...' : 'Zapisz szkic'}
          </Button>

          <Button
            onClick={handleGeneratePDF}
            variant="primary"
            disabled={currentOffer.items.length === 0}
          >
            <FileText className="w-5 h-5" />
            Generuj PDF
          </Button>

          <Button
            onClick={handleGenerateLink}
            variant="primary"
            disabled={currentOffer.items.length === 0}
          >
            <ExternalLink className="w-5 h-5" />
            Generuj link
          </Button>

          <Button
            onClick={handleSendOffer}
            variant="primary"
            disabled={sending || currentOffer.items.length === 0 || !currentOffer.client.email}
          >
            <Send className="w-5 h-5" />
            {sending ? 'Wysyłanie...' : 'Wyślij ofertę'}
          </Button>
        </div>
      </div>
    </div>
  );
};