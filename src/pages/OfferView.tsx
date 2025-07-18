import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Check, FileText, Send, ExternalLink, Trash2, Lock, 
  ArrowLeft, Package, Calculator as CalculatorIcon, 
  FileSignature, Truck, Settings, Save, Mail, Link2,
  AlertCircle, User, Calendar, Tag
} from 'lucide-react';
import { Offer, CalculatorItem, CustomProduct, OfferItemExtended } from '@/types/Offer';
import { saveOffer, getOffer } from '@/api/quotations';
import { generatePDF } from '@/utils/generatePDF';
import { sendOfferEmail } from '@/utils/sendEmail';
import { deliveryRegions, salespeople } from '@/constants/materials';
import { useOffer } from '@/context/OfferContext';
import { useUser } from '@/context/UserContext';
import { ClientForm } from '@/components/client/ClientForm';
import { Calculator } from '@/components/quotation/Calculator';
import { ItemSummary } from '@/components/quotation/ItemSummary';
import { CustomProductForm } from '@/components/quotation/CustomProductForm';
import { OfferSummary } from '@/components/offer/OfferSummary';
import { Button } from '@/components/ui/Button';
import { PageWrapper, Card, SectionTitle, LoadingState, EmptyState } from '@/components/ui/PageWrapper';

export const OfferView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOffer, setCurrentOffer, updateClient } = useOffer();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [viewMode, setViewMode] = useState<'salesperson' | 'client'>('salesperson');
  const [activeTab, setActiveTab] = useState<'calculator' | 'custom'>('calculator');

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

  const handleAddItem = (item: CalculatorItem | CustomProduct) => {
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

  const handleAddCustomProduct = (product: CustomProduct) => {
    handleAddItem(product);
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
        (sum, item) => {
          // Dla produktów nietypowych zakładamy szacowaną wagę
          if ('isCustom' in item && item.isCustom) {
            return sum + (item.quantity * 5); // Szacunkowa waga 5kg na sztukę
          }
          return sum + (item.calculations?.totalWeight || 0);
        },
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Szkic' },
      sent: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Wysłana' },
      accepted: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Zaakceptowana' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Odrzucona' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} border ${config.border}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <PageWrapper>
        <LoadingState />
      </PageWrapper>
    );
  }

  if (!currentOffer) {
    return (
      <PageWrapper>
        <EmptyState
          icon={<AlertCircle className="w-12 h-12" />}
          title="Nie znaleziono oferty"
          description="Oferta, którą próbujesz otworzyć, nie istnieje"
          action={
            <Button onClick={() => navigate('/')} variant="primary">
              <ArrowLeft className="w-5 h-5" />
              Wróć do listy ofert
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <Card className="p-6" gradient>
          <div className="flex justify-between items-start">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {id === 'new' ? 'Nowa oferta' : `Oferta ${currentOffer.number}`}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {currentOffer.date}
                    </span>
                    {currentOffer.shareLink && getStatusBadge(currentOffer.status)}
                  </div>
                </div>
              </div>
              
              {/* Project Name */}
              <div className="max-w-md">
                <label htmlFor="project-name" className="block text-sm font-medium mb-2 text-gray-400">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Nazwa projektu
                </label>
                <input
                  id="project-name"
                  name="projectName"
                  type="text"
                  value={currentOffer.projectName || ''}
                  onChange={(e) => updateOfferField('projectName', e.target.value)}
                  placeholder="np. Ekspozytory targowe 2025"
                  className="w-full bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-white border border-white/20 focus:border-purple-500 focus:outline-none transition-all placeholder-gray-500"
                />
              </div>
            </div>
            
            {/* Salesperson Info */}
            <div className="text-right bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Handlowiec</p>
              <p className="font-semibold text-white">{currentOffer.salesperson.name}</p>
              <p className="text-sm text-gray-400">{currentOffer.salesperson.phone}</p>
              {currentUser.role === 'admin' && currentOffer.salesperson.id !== currentUser.id && (
                <p className="text-xs text-yellow-400 mt-2 flex items-center justify-end gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Oferta innego handlowca
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Client Form */}
        <Card className="p-6">
          <SectionTitle icon={<User className="w-6 h-6" />}>
            Dane klienta
          </SectionTitle>
          <ClientForm
            client={currentOffer.client}
            onChange={updateClient}
          />
        </Card>

        {/* Offer Items */}
        {currentOffer.items.length > 0 && (
          <Card className="p-6">
            <SectionTitle icon={<Package className="w-6 h-6" />}>
              Pozycje oferty ({currentOffer.items.length})
            </SectionTitle>
            <div className="space-y-4">
              {currentOffer.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ItemSummary
                    item={item}
                    onRemove={() => handleRemoveItem(item.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6">
              <OfferSummary
                offer={currentOffer}
                onDiscountChange={updateDiscount}
                onDeliveryChange={updateDelivery}
              />
            </div>
          </Card>
        )}

        {/* Add Product Section */}
        <Card className="p-6">
          <SectionTitle icon={<CalculatorIcon className="w-6 h-6" />}>
            Dodaj produkt
          </SectionTitle>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-zinc-700/50 rounded-xl">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'calculator'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CalculatorIcon className="w-4 h-4 inline mr-2" />
              Kalkulator
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'custom'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Produkt nietypowy
            </button>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'calculator' ? (
              <Calculator onAddToOffer={handleAddItem} viewMode={viewMode} />
            ) : (
              <CustomProductForm onAdd={handleAddCustomProduct} />
            )}
          </motion.div>
        </Card>

        {/* Terms & Settings */}
        <Card className="p-6">
          <SectionTitle icon={<Settings className="w-6 h-6" />}>
            Warunki handlowe
          </SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="delivery-time" className="block text-sm font-medium mb-2 text-gray-400">
                <Truck className="w-4 h-4 inline mr-1" />
                Czas realizacji
              </label>
              <input
                id="delivery-time"
                name="deliveryTime"
                type="text"
                value={currentOffer.terms.deliveryTime}
                onChange={(e) => updateOfferTerms('deliveryTime', e.target.value)}
                className="w-full bg-zinc-700/50 rounded-xl px-4 py-2.5 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
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
                className="w-full bg-zinc-700/50 rounded-xl px-4 py-2.5 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
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
                className="w-full bg-zinc-700/50 rounded-xl px-4 py-2.5 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
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
                className="w-full bg-zinc-700/50 rounded-xl px-4 py-2.5 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="comment" className="block text-sm font-medium mb-2 text-gray-400">
              <FileSignature className="w-4 h-4 inline mr-1" />
              Uwagi do oferty (widoczne dla klienta)
            </label>
            <textarea
              id="comment"
              name="comment"
              value={currentOffer.comment}
              onChange={(e) => updateOfferField('comment', e.target.value)}
              rows={3}
              className="w-full bg-zinc-700/50 rounded-xl px-4 py-2.5 text-white border border-zinc-600 focus:border-purple-500 focus:outline-none transition-all"
              placeholder="Dodatkowe informacje dla klienta..."
            />
          </div>

          {viewMode === 'salesperson' && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
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
                className="w-full bg-yellow-900/10 rounded-xl px-4 py-2.5 border border-yellow-600/20 text-white focus:border-yellow-500 focus:outline-none transition-all"
                placeholder="Notatki dla zespołu sprzedaży..."
              />
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center sticky bottom-6 bg-gradient-to-t from-zinc-900 via-zinc-900/95 to-transparent pt-12 pb-6 -mb-6">
          <Button onClick={() => navigate('/')} variant="secondary">
            <ArrowLeft className="w-5 h-5" />
            Anuluj
          </Button>

          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSaveOffer}
                variant="secondary"
                disabled={saving || currentOffer.items.length === 0}
              >
                <Save className="w-5 h-5" />
                {saving ? 'Zapisywanie...' : 'Zapisz szkic'}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleGeneratePDF}
                variant="primary"
                disabled={currentOffer.items.length === 0}
              >
                <FileText className="w-5 h-5" />
                Generuj PDF
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleGenerateLink}
                variant="primary"
                disabled={currentOffer.items.length === 0}
              >
                <Link2 className="w-5 h-5" />
                Generuj link
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSendOffer}
                variant="primary"
                disabled={sending || currentOffer.items.length === 0 || !currentOffer.client.email}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Mail className="w-5 h-5" />
                {sending ? 'Wysyłanie...' : 'Wyślij ofertę'}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
};