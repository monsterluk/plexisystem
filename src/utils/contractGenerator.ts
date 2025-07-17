// Generator umów sprzedaży dla zaakceptowanych ofert

import jsPDF from 'jspdf';
import { Offer } from '@/types/Offer';
import { formatDate, formatDateOnly } from '@/utils/dateHelpers';

interface ContractData {
  offer: Offer;
  contractNumber: string;
  signDate: Date;
  deliveryAddress?: string;
  paymentMethod: 'transfer' | 'cash' | 'card';
  additionalTerms?: string[];
}

export class ContractGenerator {
  private doc: jsPDF;
  private pageHeight: number;
  private currentY: number;
  private marginLeft: number = 20;
  private marginRight: number = 20;
  private lineHeight: number = 7;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.currentY = 20;
  }

  generateContract(data: ContractData): Blob {
    this.addHeader(data);
    this.addParties(data);
    this.addSubject(data);
    this.addItems(data);
    this.addTerms(data);
    this.addPaymentTerms(data);
    this.addDeliveryTerms(data);
    this.addGeneralTerms(data);
    this.addSignatures();

    return this.doc.output('blob');
  }

  private addHeader(data: ContractData) {
    // Tytuł
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('UMOWA SPRZEDAŻY', this.doc.internal.pageSize.width / 2, this.currentY, { align: 'center' });
    
    this.currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Nr ${data.contractNumber}`, this.doc.internal.pageSize.width / 2, this.currentY, { align: 'center' });
    
    this.currentY += 15;
    this.doc.setFontSize(10);
    this.doc.text(`zawarta w dniu ${formatDateOnly(data.signDate)} w Nowym Dworze Wejherowskim`, this.marginLeft, this.currentY);
    this.currentY += 10;
  }

  private addParties(data: ContractData) {
    this.doc.text('pomiędzy:', this.marginLeft, this.currentY);
    this.currentY += 10;

    // Sprzedawca
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PlexiSystem S.C.', this.marginLeft, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += this.lineHeight;
    
    const sellerInfo = [
      'Ks. Dr. Leona Heyke 11',
      '84-206 Nowy Dwór Wejherowski',
      'NIP: 588-239-62-72',
      'REGON: 385951530',
      'reprezentowaną przez: Łukasz Sikorra'
    ];

    sellerInfo.forEach(line => {
      this.doc.text(line, this.marginLeft, this.currentY);
      this.currentY += this.lineHeight;
    });

    this.currentY += 5;
    this.doc.text('zwaną dalej "Sprzedawcą"', this.marginLeft, this.currentY);
    this.currentY += 10;

    this.doc.text('a', this.marginLeft, this.currentY);
    this.currentY += 10;

    // Kupujący
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(data.offer.client.name, this.marginLeft, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += this.lineHeight;

    if (data.offer.client.address) {
      this.doc.text(data.offer.client.address, this.marginLeft, this.currentY);
      this.currentY += this.lineHeight;
    }

    if (data.offer.client.nip) {
      this.doc.text(`NIP: ${data.offer.client.nip}`, this.marginLeft, this.currentY);
      this.currentY += this.lineHeight;
    }

    if (data.offer.client.contactPerson) {
      this.doc.text(`reprezentowaną przez: ${data.offer.client.contactPerson}`, this.marginLeft, this.currentY);
      this.currentY += this.lineHeight;
    }

    this.currentY += 5;
    this.doc.text('zwaną dalej "Kupującym"', this.marginLeft, this.currentY);
    this.currentY += 15;
  }

  private addSubject(data: ContractData) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('§ 1. Przedmiot umowy', this.marginLeft, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 10;

    const subject = [
      '1. Przedmiotem umowy jest sprzedaż i dostawa towarów zgodnie ze specyfikacją',
      `   zawartą w ofercie nr ${data.offer.number} z dnia ${formatDateOnly(data.offer.date)},`,
      '   która stanowi integralną część niniejszej umowy.',
      '2. Kupujący oświadcza, że zapoznał się z ofertą i akceptuje jej warunki.'
    ];

    subject.forEach(line => {
      this.doc.text(line, this.marginLeft, this.currentY);
      this.currentY += this.lineHeight;
    });
    this.currentY += 10;
  }

  private addItems(data: ContractData) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('§ 2. Specyfikacja towarów', this.marginLeft, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 10;

    // Tabela produktów
    const tableTop = this.currentY;
    const colWidths = [15, 70, 30, 20, 25, 30];
    const headers = ['Lp.', 'Nazwa produktu', 'Wymiary', 'Ilość', 'Cena jedn.', 'Wartość'];
    
    // Nagłówki tabeli
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(this.marginLeft, tableTop, 170, 8, 'F');
    
    let xPos = this.marginLeft;
    headers.forEach((header, i) => {
      this.doc.text(header, xPos + 2, tableTop + 5);
      xPos += colWidths[i];
    });

    this.doc.setFont('helvetica', 'normal');
    this.currentY = tableTop + 10;

    // Wiersze tabeli
    data.offer.items.forEach((item, index) => {
      if (this.currentY > this.pageHeight - 40) {
        this.addNewPage();
      }

      xPos = this.marginLeft;
      const rowData = [
        `${index + 1}.`,
        item.productName,
        `${item.dimensions.width}x${item.dimensions.height}`,
        `${item.quantity} szt.`,
        `${item.unitPrice.toFixed(2)} zł`,
        `${item.totalPrice.toFixed(2)} zł`
      ];

      rowData.forEach((cell, i) => {
        const text = this.doc.splitTextToSize(cell, colWidths[i] - 4);
        this.doc.text(text, xPos + 2, this.currentY);
        xPos += colWidths[i];
      });

      this.currentY += 8;
    });

    // Podsumowanie
    this.currentY += 5;
    this.doc.line(this.marginLeft, this.currentY, 190, this.currentY);
    this.currentY += 8;

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Wartość netto:', 140, this.currentY);
    this.doc.text(`${data.offer.totalNet.toFixed(2)} zł`, 190, this.currentY, { align: 'right' });
    this.currentY += this.lineHeight;

    if (data.offer.discount > 0) {
      this.doc.text(`Rabat (${data.offer.discount}%):`, 140, this.currentY);
      this.doc.text(`-${data.offer.discountValue.toFixed(2)} zł`, 190, this.currentY, { align: 'right' });
      this.currentY += this.lineHeight;
    }

    this.doc.text('Dostawa:', 140, this.currentY);
    this.doc.text(`${data.offer.deliveryCost.toFixed(2)} zł`, 190, this.currentY, { align: 'right' });
    this.currentY += this.lineHeight;

    const finalTotal = data.offer.totalNetAfterDiscount + data.offer.deliveryCost;
    this.doc.text('RAZEM NETTO:', 140, this.currentY);
    this.doc.text(`${finalTotal.toFixed(2)} zł`, 190, this.currentY, { align: 'right' });
    this.currentY += 15;
  }

  private addTerms(data: ContractData) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('§ 3. Warunki realizacji', this.marginLeft, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 10;

    const terms = [
      `1. Termin realizacji: ${data.offer.terms.deliveryTime}`,
      `2. Sposób dostawy: ${data.offer.terms.deliveryMethod}`,
      '3. Sprzedawca zobowiązuje się do wykonania zamówienia zgodnie ze specyfikacją',
      '   i w uzgodnionym terminie.',
      '4. Kupujący zobowiązuje się do odbioru towaru w uzgodnionym terminie.'
    ];

    terms.forEach(line => {
      this.doc.text(line, this.marginLeft, this.currentY);
      this.currentY += this.lineHeight;
    });
    this.currentY += 10;
  }

  private addPaymentTerms(data: ContractData) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('§ 4. Warunki płatności', this.marginLeft, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 10;

    const paymentTerms = [
      `1. Forma płatności: ${data.paymentMethod === 'transfer' ? 'przelew bankowy' : data.paymentMethod === 'cash' ? 'gotówka' : 'karta płatnicza'}`,
      `2. Termin płatności: ${data.offer.terms.paymentTerms}`,
      '3. Za dzień zapłaty uznaje się dzień uznania rachunku bankowego Sprzedawcy.',
      '4. W przypadku opóźnienia w płatności Sprzedawca ma prawo naliczyć odsetki',
      '   ustawowe za opóźnienie.'
    ];

    paymentTerms.forEach(line => {
      this.doc.text(line, this.marginLeft, this.currentY);
      this.currentY += this.lineHeight;
    });
    this.currentY += 10;
  }

  private addDeliveryTerms(data: ContractData) {
    if (this.currentY > this.pageHeight - 80) {
      this.addNewPage();
    }

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('§ 5. Dostawa i odbiór', this.marginLeft, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 10;

    const deliveryTerms = [
      '1. Dostawa towaru nastąpi na adres wskazany przez Kupującego.',
      '2. Kupujący zobowiązany jest do sprawdzenia towaru przy odbiorze.',
      '3. Wszelkie widoczne uszkodzenia należy zgłosić przewoźnikowi i zaznaczyć',
      '   w protokole odbioru.',
      '4. Reklamacje z tytułu uszkodzeń transportowych należy zgłosić w ciągu',
      '   48 godzin od odbioru.'
    ];

    deliveryTerms.forEach(line => {
      this.doc.text(line, this.marginLeft, this.currentY);
      this.currentY += this.lineHeight;
    });
    this.currentY += 10;
  }

  private addGeneralTerms(data: ContractData) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('§ 6. Postanowienia końcowe', this.marginLeft, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 10;

    const generalTerms = [
      '1. W sprawach nieuregulowanych niniejszą umową mają zastosowanie',
      '   przepisy Kodeksu Cywilnego.',
      '2. Wszelkie zmiany umowy wymagają formy pisemnej pod rygorem nieważności.',
      '3. Ewentualne spory strony będą starały się rozwiązać polubownie,',
      '   a w przypadku braku porozumienia właściwy będzie sąd właściwy',
      '   dla siedziby Sprzedawcy.',
      '4. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach,',
      '   po jednym dla każdej ze stron.'
    ];

    generalTerms.forEach(line => {
      this.doc.text(line, this.marginLeft, this.currentY);
      this.currentY += this.lineHeight;
    });
    this.currentY += 15;

    // Gwarancja
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`§ 7. Gwarancja`, this.marginLeft, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 10;
    this.doc.text(`Sprzedawca udziela gwarancji na okres: ${data.offer.terms.warranty}`, this.marginLeft, this.currentY);
    this.currentY += 20;
  }

  private addSignatures() {
    if (this.currentY > this.pageHeight - 60) {
      this.addNewPage();
    }

    const signatureY = this.pageHeight - 40;
    
    // Linie na podpisy
    this.doc.line(30, signatureY, 80, signatureY);
    this.doc.line(130, signatureY, 180, signatureY);

    // Opisy
    this.doc.setFontSize(9);
    this.doc.text('SPRZEDAWCA', 55, signatureY + 8, { align: 'center' });
    this.doc.text('KUPUJĄCY', 155, signatureY + 8, { align: 'center' });
  }

  private addNewPage() {
    this.doc.addPage();
    this.currentY = 20;
  }

  // Metoda do generowania numeru umowy
  static async generateContractNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // Pobierz ostatni numer umowy z tego miesiąca
    const { data, error } = await supabase
      .from('contracts')
      .select('contract_number')
      .like('contract_number', `UM/${year}/${month}/%`)
      .order('created_at', { ascending: false })
      .limit(1);

    let nextNumber = 1;
    if (data && data.length > 0) {
      const lastNumber = data[0].contract_number.split('/').pop();
      nextNumber = parseInt(lastNumber) + 1;
    }

    return `UM/${year}/${month}/${String(nextNumber).padStart(3, '0')}`;
  }

  // Zapisz umowę w bazie danych
  static async saveContract(offerId: string, contractNumber: string, contractBlob: Blob): Promise<void> {
    // Konwertuj blob na base64
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(contractBlob);
    });

    const { error } = await supabase
      .from('contracts')
      .insert({
        offer_id: offerId,
        contract_number: contractNumber,
        contract_data: base64,
        status: 'draft',
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    // Zaktualizuj status oferty
    await supabase
      .from('quotations')
      .update({ 
        status: 'contract_generated',
        contract_number: contractNumber 
      })
      .eq('id', offerId);
  }
}

// Przykład użycia:
export async function generateContractForOffer(offer: Offer, paymentMethod: 'transfer' | 'cash' | 'card' = 'transfer') {
  const contractNumber = await ContractGenerator.generateContractNumber();
  const generator = new ContractGenerator();
  
  const contractData: ContractData = {
    offer,
    contractNumber,
    signDate: new Date(),
    paymentMethod,
    additionalTerms: []
  };

  const contractBlob = generator.generateContract(contractData);
  await ContractGenerator.saveContract(offer.id, contractNumber, contractBlob);
  
  return { contractNumber, contractBlob };
}
