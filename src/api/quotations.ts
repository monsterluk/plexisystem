// src/api/quotations.ts
import { supabase, DbClient, DbOffer, DbOfferItem } from '@/lib/supabaseClient';
import { Offer } from '@/types/Offer';

// Zapisz nową ofertę
export const saveOffer = async (offer: Offer): Promise<Offer> => {
  try {
    // 1. Sprawdź/dodaj klienta
    let client: DbClient | null = null;
    
    // Logowanie danych klienta przed zapisem
    console.log('Saving client:', {
      nip: offer.client.nip,
      name: offer.client.name,
      address: offer.client.address,
      email: offer.client.email,
      phone: offer.client.phone,
      regon: offer.client.regon,
      wojewodztwo: offer.client.wojewodztwo,
      powiat: offer.client.powiat,
      gmina: offer.client.gmina
    });
    
    // Sprawdź czy klient istnieje
    const { data: existingClient, error: checkError } = await supabase
      .from('clients')
      .select('*')
      .eq('nip', offer.client.nip)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking client:', checkError);
    }
    
    if (existingClient) {
      console.log('Updating existing client:', existingClient.id);
      // Aktualizuj dane klienta
      const { data: updatedClient, error: updateError } = await supabase
        .from('clients')
        .update({
          name: offer.client.name,
          address: offer.client.address,
          email: offer.client.email,
          phone: offer.client.phone,
          regon: offer.client.regon,
          wojewodztwo: offer.client.wojewodztwo,
          powiat: offer.client.powiat,
          gmina: offer.client.gmina
        })
        .eq('id', existingClient.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating client:', updateError);
        throw updateError;
      }
      
      client = updatedClient;
    } else {
      console.log('Creating new client');
      // Dodaj nowego klienta
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert({
          nip: offer.client.nip,
          name: offer.client.name,
          address: offer.client.address,
          email: offer.client.email,
          phone: offer.client.phone,
          regon: offer.client.regon,
          wojewodztwo: offer.client.wojewodztwo,
          powiat: offer.client.powiat,
          gmina: offer.client.gmina
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error inserting client:', insertError);
        throw insertError;
      }
      
      client = newClient;
    }
    
    if (!client) throw new Error('Nie udało się zapisać klienta');
    
    console.log('Client saved:', client);
    
    // 2. Generuj numer oferty i token
    const year = new Date().getFullYear();
    const offerNumber = `${offer.salesperson.id}-${year}-${String(Date.now()).slice(-4)}`;
    const shareToken = crypto.randomUUID();
    
    console.log('Saving offer with number:', offerNumber);
    
    // 3. Zapisz ofertę
    const offerData = {
      offer_number: offerNumber,
      share_token: shareToken,
      client_id: client.id!,
      salesperson_id: offer.salesperson.id,
      salesperson_name: offer.salesperson.name,
      project_name: offer.projectName,
      status: offer.status || 'draft',
      total_net: offer.totalNet,
      discount: offer.discount,
      discount_value: offer.discountValue,
      total_net_after_discount: offer.totalNetAfterDiscount,
      delivery_region: offer.deliveryRegion,
      delivery_cost: offer.deliveryCost,
      terms_delivery_time: offer.terms.deliveryTime,
      terms_delivery_method: offer.terms.deliveryMethod,
      terms_payment: offer.terms.paymentTerms,
      terms_warranty: offer.terms.warranty,
      terms_validity: offer.terms.validity,
      valid_until: offer.validUntil,
      comment: offer.comment,
      internal_notes: offer.internalNotes,
      version: 1
    };
    
    console.log('Offer data:', offerData);
    
    const { data: savedOffer, error: offerError } = await supabase
      .from('offers')
      .insert(offerData)
      .select()
      .single();
    
    if (offerError) {
      console.error('Error saving offer:', offerError);
      throw offerError;
    }
    if (!savedOffer) throw new Error('Nie udało się zapisać oferty');
    
    console.log('Offer saved:', savedOffer);
    
    // 4. Zapisz pozycje oferty
    const offerItems = offer.items.map(item => ({
      offer_id: savedOffer.id!,
      product: item.product,
      product_name: item.productName,
      expositor_type: item.expositorType,
      material: item.material,
      material_name: item.materialName,
      thickness: item.thickness,
      width: item.dimensions.width,
      height: item.dimensions.height,
      depth: item.dimensions.depth,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      surface: item.calculations?.surface || 0,
      weight: item.calculations?.weight || 0,
      options: item.options || {},
      calculations: item.calculations || {}
    }));
    
    console.log('Saving offer items:', offerItems.length);
    
    const { error: itemsError } = await supabase
      .from('offer_items')
      .insert(offerItems);
    
    if (itemsError) {
      console.error('Error saving offer items:', itemsError);
      throw itemsError;
    }
    
    // 5. Zwróć zaktualizowaną ofertę
    return {
      ...offer,
      id: savedOffer.id!,
      number: offerNumber,
      shareLink: `${window.location.origin}/oferta/${shareToken}`
    };
  } catch (error) {
    console.error('Error saving offer:', error);
    throw error;
  }
};

// Pobierz ofertę po ID
export const getOffer = async (id: string): Promise<Offer> => {
  try {
    // Pobierz ofertę z klientem
    const { data: offerData, error: offerError } = await supabase
      .from('offers')
      .select(`
        *,
        clients (*)
      `)
      .eq('id', id)
      .single();
    
    if (offerError) throw offerError;
    if (!offerData) throw new Error('Oferta nie znaleziona');
    
    // Pobierz pozycje oferty
    const { data: items, error: itemsError } = await supabase
      .from('offer_items')
      .select('*')
      .eq('offer_id', id);
    
    if (itemsError) throw itemsError;
    
    // Mapuj do formatu Offer
    return {
      id: offerData.id,
      number: offerData.offer_number,
      date: offerData.created_at,
      shareLink: `${window.location.origin}/oferta/${offerData.share_token}`,
      client: {
        nip: offerData.clients.nip,
        name: offerData.clients.name,
        address: offerData.clients.address,
        email: offerData.clients.email,
        phone: offerData.clients.phone,
        regon: offerData.clients.regon,
        wojewodztwo: offerData.clients.wojewodztwo,
        powiat: offerData.clients.powiat,
        gmina: offerData.clients.gmina
      },
      items: items?.map(item => ({
        id: item.id,
        product: item.product,
        productName: item.product_name,
        expositorType: item.expositor_type,
        material: item.material,
        materialName: item.material_name,
        thickness: item.thickness,
        dimensions: {
          width: item.width,
          height: item.height,
          depth: item.depth
        },
        quantity: item.quantity,
        options: item.options,
        optionQuantities: {},
        productParams: {},
        calculations: item.calculations,
        unitPrice: item.unit_price,
        totalPrice: item.total_price
      })) || [],
      terms: {
        deliveryTime: offerData.terms_delivery_time,
        deliveryMethod: offerData.terms_delivery_method,
        paymentTerms: offerData.terms_payment,
        warranty: offerData.terms_warranty,
        validity: offerData.terms_validity
      },
      status: offerData.status,
      salesperson: {
        id: offerData.salesperson_id,
        name: offerData.salesperson_name,
        phone: '',
        email: ''
      },
      comment: offerData.comment || '',
      internalNotes: offerData.internal_notes || '',
      totalNet: offerData.total_net,
      discount: offerData.discount,
      discountValue: offerData.discount_value,
      totalNetAfterDiscount: offerData.total_net_after_discount,
      deliveryRegion: offerData.delivery_region,
      deliveryCost: offerData.delivery_cost,
      projectName: offerData.project_name || '',
      validUntil: offerData.valid_until,
      version: offerData.version
    };
  } catch (error) {
    console.error('Error fetching offer:', error);
    throw error;
  }
};

// Pobierz wszystkie oferty
export const getOffers = async (): Promise<Offer[]> => {
  try {
    // Najpierw pobierz oferty
    const { data: offersData, error: offersError } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (offersError) throw offersError;
    if (!offersData) return [];
    
    // Pobierz unikalne client_id
    const clientIds = [...new Set(offersData.map(o => o.client_id))];
    
    // Pobierz klientów
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, nip')
      .in('id', clientIds);
    
    if (clientsError) throw clientsError;
    
    // Mapuj klientów po ID
    const clientsMap = new Map(clientsData?.map(c => [c.id, c]) || []);
    
    return offersData.map(offer => {
      const client = clientsMap.get(offer.client_id);
      
      return {
        id: offer.id,
        number: offer.offer_number,
        date: offer.created_at,
        client: {
          name: client?.name || 'Nieznany klient',
          nip: client?.nip || '',
          address: '',
          email: '',
          phone: '',
          regon: ''
        },
        items: [],
        terms: {
          deliveryTime: offer.terms_delivery_time,
          deliveryMethod: offer.terms_delivery_method,
          paymentTerms: offer.terms_payment,
          warranty: offer.terms_warranty,
          validity: offer.terms_validity
        },
        status: offer.status,
        salesperson: {
          id: offer.salesperson_id,
          name: offer.salesperson_name,
          phone: '',
          email: ''
        },
        comment: '',
        internalNotes: '',
        totalNet: offer.total_net,
        discount: offer.discount,
        discountValue: offer.discount_value,
        totalNetAfterDiscount: offer.total_net_after_discount,
        deliveryRegion: offer.delivery_region,
        deliveryCost: offer.delivery_cost,
        projectName: offer.project_name || '',
        validUntil: offer.valid_until,
        shareLink: '',
        version: offer.version
      };
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

// Pobierz ofertę po tokenie (dla klienta)
export const getOfferByToken = async (token: string): Promise<Offer> => {
  try {
    const { data: offerData, error } = await supabase
      .from('offers')
      .select(`
        *,
        clients (*),
        offer_items (*)
      `)
      .eq('share_token', token)
      .single();
    
    if (error) throw error;
    if (!offerData) throw new Error('Oferta nie znaleziona');
    
    // Zwróć ofertę bez danych wewnętrznych
    return {
      id: offerData.id,
      number: offerData.offer_number,
      date: offerData.created_at,
      shareLink: '',
      client: {
        name: offerData.clients.name,
        address: offerData.clients.address,
        nip: '',
        email: '',
        phone: '',
        regon: ''
      },
      items: offerData.offer_items?.map((item: DbOfferItem) => ({
        id: item.id,
        product: item.product,
        productName: item.product_name,
        material: item.material,
        materialName: item.material_name,
        thickness: item.thickness,
        dimensions: {
          width: item.width,
          height: item.height,
          depth: item.depth
        },
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price,
        options: item.options,
        optionQuantities: {},
        productParams: {},
        calculations: {
          surface: item.surface,
          weight: item.weight
        },
        expositorType: item.expositor_type
      })) || [],
      terms: {
        deliveryTime: offerData.terms_delivery_time,
        deliveryMethod: offerData.terms_delivery_method,
        paymentTerms: offerData.terms_payment,
        warranty: offerData.terms_warranty,
        validity: offerData.terms_validity
      },
      status: offerData.status,
      salesperson: {
        id: '',
        name: offerData.salesperson_name,
        phone: '',
        email: ''
      },
      comment: offerData.comment || '',
      internalNotes: '', // Nie pokazuj klientowi
      totalNet: offerData.total_net,
      discount: offerData.discount,
      discountValue: offerData.discount_value,
      totalNetAfterDiscount: offerData.total_net_after_discount,
      deliveryRegion: offerData.delivery_region,
      deliveryCost: offerData.delivery_cost,
      projectName: offerData.project_name || '',
      validUntil: offerData.valid_until,
      version: offerData.version
    };
  } catch (error) {
    console.error('Error fetching offer by token:', error);
    throw error;
  }
};

// Zaakceptuj ofertę
export const acceptOffer = async (offerId: string): Promise<boolean> => {
  try {
    // Najpierw pobierz dane oferty żeby mieć email handlowca
    const { data: offerData } = await supabase
      .from('offers')
      .select(`
        *,
        clients (*)
      `)
      .eq('id', offerId)
      .single();
    
    if (!offerData) throw new Error('Offer not found');
    
    // Aktualizuj status
    const { error } = await supabase
      .from('offers')
      .update({ 
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', offerId);
    
    if (error) throw error;
    
    // Wyślij email do handlowca
    try {
      const emailData = {
        to: offerData.salesperson_email || 'biuro@plexisystem.pl', // Domyślny email
        subject: `✅ Oferta ${offerData.offer_number} została zaakceptowana!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; }
              .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 8px; }
              .client-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .highlight { color: #10b981; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Oferta zaakceptowana!</h1>
              </div>
              <div class="content">
                <h2>Gratulacje!</h2>
                
                <p>Oferta <span class="highlight">${offerData.offer_number}</span> została właśnie zaakceptowana przez klienta.</p>
                
                <div class="client-info">
                  <h3>Dane klienta:</h3>
                  <p><strong>${offerData.clients.name}</strong><br>
                  ${offerData.clients.address || ''}<br>
                  NIP: ${offerData.clients.nip}<br>
                  ${offerData.clients.email ? `Email: ${offerData.clients.email}<br>` : ''}
                  ${offerData.clients.phone ? `Tel: ${offerData.clients.phone}` : ''}</p>
                  
                  ${offerData.project_name ? `<p><strong>Projekt:</strong> ${offerData.project_name}</p>` : ''}
                  
                  <p><strong>Wartość zamówienia:</strong> ${offerData.total_net_after_discount.toFixed(2)} zł netto</p>
                </div>
                
                <p><strong>Data akceptacji:</strong> ${new Date().toLocaleString('pl-PL')}</p>
                
                <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
                
                <p style="text-align: center; color: #666;">
                  Skontaktuj się z klientem w celu ustalenia szczegółów realizacji zamówienia.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      await fetch(import.meta.env.VITE_EMAIL_SERVICE_URL || 'http://localhost:3002/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Nie blokuj akceptacji jeśli email nie działa
    }
    
    return true;
  } catch (error) {
    console.error('Error accepting offer:', error);
    return false;
  }
};

// Odrzuć ofertę
export const rejectOffer = async (offerId: number, reason?: string): Promise<boolean> => {
  try {
    const updateData: any = {
      status: 'rejected',
      rejected_at: new Date().toISOString()
    };
    
    if (reason) {
      updateData.rejection_reason = reason;
    }
    
    const { error } = await supabase
      .from('offers')
      .update(updateData)
      .eq('id', offerId);
    
    if (error) throw error;
    
    // TODO: Opcjonalnie wyślij powiadomienie email do handlowca
    
    return true;
  } catch (error) {
    console.error('Error rejecting offer:', error);
    return false;
  }
};

// Alias dla kompatybilności - OfferAcceptance używa tej nazwy
export const getOfferByShareLink = getOfferByToken;