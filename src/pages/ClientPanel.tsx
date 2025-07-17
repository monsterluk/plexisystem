// Panel klienta - śledzenie statusu zamówienia

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  FileDown,
  MessageSquare,
  ChevronRight,
  User,
  Building2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { formatDate, formatDateOnly, formatRelativeTime } from '@/utils/dateHelpers';
import { generatePDF } from '@/utils/generatePDF';

interface OrderStatus {
  id: string;
  offer_id: string;
  status: 'accepted' | 'contract_generated' | 'payment_pending' | 'payment_received' | 'in_production' | 'ready_for_shipping' | 'shipped' | 'delivered';
  status_history: Array<{
    status: string;
    date: string;
    comment?: string;
    user?: string;
  }>;
  tracking_number?: string;
  estimated_delivery?: string;
  production_notes?: string;
  invoice_number?: string;
  contract_number?: string;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  accepted: {
    label: 'Oferta zaakceptowana',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Twoja oferta została zaakceptowana. Czekamy na podpisanie umowy.'
  },
  contract_generated: {
    label: 'Umowa wygenerowana',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Umowa jest gotowa do podpisania. Pobierz ją i odeślij podpisaną.'
  },
  payment_pending: {
    label: 'Oczekiwanie na płatność',
    icon: CreditCard,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Czekamy na wpłatę. Po zaksięgowaniu rozpoczniemy produkcję.'
  },
  payment_received: {
    label: 'Płatność otrzymana',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Płatność została zaksięgowana. Rozpoczynamy produkcję!'
  },
  in_production: {
    label: 'W produkcji',
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Twoje zamówienie jest w trakcie produkcji.'
  },
  ready_for_shipping: {
    label: 'Gotowe do wysyłki',
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Zamówienie jest spakowane i czeka na kuriera.'
  },
  shipped: {
    label: 'Wysłane',
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Twoje zamówienie jest w drodze.'
  },
  delivered: {
    label: 'Dostarczone',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Zamówienie zostało dostarczone. Dziękujemy!'
  }
};

export const ClientPanel: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [token]);

  const loadOrderData = async () => {
    try {
      // Pobierz ofertę po tokenie
      const { data: offerData } = await supabase
        .from('quotations')
        .select(`
          *,
          clients (*),
          quotation_items (
            *,
            products (*)
          )
        `)
        .eq('share_token', token)
        .single();

      if (offerData) {
        setOffer(offerData);

        // Pobierz status zamówienia
        const { data: statusData } = await supabase
          .from('order_status')
          .select('*')
          .eq('offer_id', offerData.id)
          .single();

        setOrderStatus(statusData);
      }
    } catch (error) {
      console.error('Error loading order data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (type: 'offer' | 'contract' | 'invoice') => {
    if (!offer) return;

    try {
      let blob;
      let filename;

      switch (type) {
        case 'offer':
          blob = await generatePDF(offer, 'client');
          filename = `Oferta_${offer.number}.pdf`;
          break;
        case 'contract':
          // Pobierz umowę z bazy
          const { data: contractData } = await supabase
            .from('contracts')
            .select('contract_data')
            .eq('offer_id', offer.id)
            .single();
          
          if (contractData?.contract_data) {
            // Konwertuj base64 na blob
            const base64Response = await fetch(contractData.contract_data);
            blob = await base64Response.blob();
            filename = `Umowa_${orderStatus?.contract_number}.pdf`;
          }
          break;
        case 'invoice':
          // TODO: Implementacja pobierania faktury
          alert('Funkcja w przygotowaniu');
          return;
      }

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !offer) return;

    setSendingMessage(true);
    try {
      // Zapisz wiadomość w bazie
      const { error } = await supabase
        .from('client_messages')
        .insert({
          offer_id: offer.id,
          client_id: offer.client_id,
          message: message,
          type: 'client_to_sales',
          created_at: new Date().toISOString()
        });

      if (!error) {
        setMessage('');
        setShowMessageForm(false);
        alert('Wiadomość została wysłana. Skontaktujemy się wkrótce.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!orderStatus) return 0;
    const steps = Object.keys(statusConfig);
    return steps.indexOf(orderStatus.status);
  };

  const renderProgressBar = () => {
    const steps = Object.entries(statusConfig);
    const currentIndex = getCurrentStepIndex();

    return (
      <div className="relative">
        {/* Linia postępu */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Kroki */}
        <div className="relative flex justify-between">
          {steps.map(([key, config], index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = config.icon;

            return (
              <div key={key} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${isCompleted ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}
                  ${isCurrent ? 'ring-4 ring-orange-200' : ''}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {config.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeTime(orderStatus?.updated_at || new Date())}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!offer || !orderStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nie znaleziono zamówienia</h1>
          <p className="text-gray-600">Sprawdź czy link jest prawidłowy</p>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[orderStatus.status];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nagłówek */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel klienta</h1>
              <p className="text-gray-600 mt-1">Śledź status swojego zamówienia</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Numer oferty</p>
              <p className="text-lg font-semibold text-gray-900">{offer.number}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Status główny */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-lg ${currentStatus.bgColor}`}>
              <currentStatus.icon className={`w-8 h-8 ${currentStatus.color}`} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{currentStatus.label}</h2>
              <p className="text-gray-600 mt-1">{currentStatus.description}</p>
              {orderStatus.tracking_number && orderStatus.status === 'shipped' && (
                <div className="mt-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Numer przesyłki: <span className="font-medium">{orderStatus.tracking_number}</span>
                  </span>
                </div>
              )}
              {orderStatus.estimated_delivery && (
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Przewidywana dostawa: <span className="font-medium">{formatDateOnly(orderStatus.estimated_delivery)}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Pasek postępu */}
          <div className="mt-8">
            {renderProgressBar()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lewa kolumna - Historia i szczegóły */}
          <div className="lg:col-span-2 space-y-6">
            {/* Historia statusów */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Historia zmian
              </h3>
              <div className="space-y-3">
                {orderStatus.status_history?.map((history, index) => {
                  const config = statusConfig[history.status as keyof typeof statusConfig];
                  const Icon = config?.icon || AlertCircle;
                  
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config?.bgColor || 'bg-gray-100'}`}>
                          <Icon className={`w-4 h-4 ${config?.color || 'text-gray-400'}`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{config?.label || history.status}</p>
                        <p className="text-sm text-gray-500">{formatDate(history.date)}</p>
                        {history.comment && (
                          <p className="text-sm text-gray-600 mt-1">{history.comment}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Szczegóły zamówienia */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                Szczegóły zamówienia
              </h3>
              
              <div className="space-y-4">
                {offer.quotation_items?.map((item: any, index: number) => (
                  <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {index + 1}. {item.products?.name || item.product_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.dimensions?.width} × {item.dimensions?.height} mm, {item.thickness} mm
                        </p>
                        <p className="text-sm text-gray-500">
                          Ilość: {item.quantity} szt.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{item.total_price.toFixed(2)} zł</p>
                        <p className="text-sm text-gray-500">{item.unit_price.toFixed(2)} zł/szt</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wartość netto</span>
                    <span className="font-medium">{offer.total_net.toFixed(2)} zł</span>
                  </div>
                  {offer.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rabat ({offer.discount}%)</span>
                      <span className="font-medium text-green-600">-{offer.discount_value.toFixed(2)} zł</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dostawa</span>
                    <span className="font-medium">
                      {offer.delivery_cost > 0 ? `${offer.delivery_cost.toFixed(2)} zł` : 'Gratis'}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Do zapłaty</span>
                    <span className="text-orange-600">
                      {((offer.total_net_after_discount || offer.total_net) + offer.delivery_cost).toFixed(2)} zł
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informacje o produkcji */}
            {orderStatus.production_notes && orderStatus.status === 'in_production' && (
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Informacje o produkcji</h3>
                <p className="text-blue-700">{orderStatus.production_notes}</p>
              </div>
            )}
          </div>

          {/* Prawa kolumna - Akcje i kontakt */}
          <div className="space-y-6">
            {/* Dokumenty do pobrania */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileDown className="w-5 h-5 text-gray-400" />
                Dokumenty
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleDownloadDocument('offer')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Oferta</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>

                {orderStatus.contract_number && (
                  <button
                    onClick={() => handleDownloadDocument('contract')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Umowa</span>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                )}

                {orderStatus.invoice_number && (
                  <button
                    onClick={() => handleDownloadDocument('invoice')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Faktura</span>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Dane firmy */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                Dane sprzedawcy
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Firma</p>
                  <p className="font-medium text-gray-900">PlexiSystem S.C.</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adres</p>
                  <p className="text-gray-700">Ks. Dr. Leona Heyke 11</p>
                  <p className="text-gray-700">84-206 Nowy Dwór Wejherowski</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIP</p>
                  <p className="font-medium text-gray-900">588-239-62-72</p>
                </div>
              </div>
            </div>

            {/* Kontakt */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontakt</h3>
              <div className="space-y-3">
                <a href="tel:884042107" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>884 042 107</span>
                </a>
                <a href="mailto:biuro@plexisystem.pl" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>biuro@plexisystem.pl</span>
                </a>
              </div>

              <button
                onClick={() => setShowMessageForm(!showMessageForm)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Wyślij wiadomość
              </button>

              {showMessageForm && (
                <div className="mt-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Wpisz swoją wiadomość..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={4}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !message.trim()}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {sendingMessage ? 'Wysyłanie...' : 'Wyślij'}
                    </button>
                    <button
                      onClick={() => {
                        setShowMessageForm(false);
                        setMessage('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Akcje związane ze statusem */}
            {orderStatus.status === 'contract_generated' && (
              <div className="bg-orange-50 rounded-xl p-6">
                <h4 className="font-semibold text-orange-900 mb-2">Następny krok</h4>
                <p className="text-sm text-orange-700 mb-3">
                  Pobierz umowę, podpisz ją i odeślij na adres email lub pocztą.
                </p>
                <button
                  onClick={() => handleDownloadDocument('contract')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Pobierz umowę
                </button>
              </div>
            )}

            {orderStatus.status === 'payment_pending' && (
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-2">Dane do przelewu</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-blue-600">Numer konta:</p>
                    <p className="font-mono font-medium text-blue-900">12 3456 7890 1234 5678 9012 3456</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Tytuł przelewu:</p>
                    <p className="font-medium text-blue-900">Zamówienie {offer.number}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Kwota:</p>
                    <p className="font-medium text-blue-900">
                      {((offer.total_net_after_discount || offer.total_net) + offer.delivery_cost).toFixed(2)} zł
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};