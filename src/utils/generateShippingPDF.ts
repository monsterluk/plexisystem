import jsPDF from 'jspdf';
import { ShippingDocument } from '../hooks/useShippingDocuments';

export const generateShippingPDF = (document: ShippingDocument): jsPDF => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Czcionka i kodowanie dla polskich znaków
  pdf.setFont('helvetica');
  
  // Funkcja do bezpiecznego wyświetlania tekstu z polskimi znakami
  const safeText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/ł/g, 'l')
      .replace(/Ł/g, 'L')
      .replace(/ą/g, 'a')
      .replace(/ę/g, 'e')
      .replace(/ś/g, 's')
      .replace(/ć/g, 'c')
      .replace(/ń/g, 'n')
      .replace(/ż/g, 'z')
      .replace(/ź/g, 'z')
      .replace(/ó/g, 'o')
      .replace(/Ą/g, 'A')
      .replace(/Ę/g, 'E')
      .replace(/Ś/g, 'S')
      .replace(/Ć/g, 'C')
      .replace(/Ń/g, 'N')
      .replace(/Ż/g, 'Z')
      .replace(/Ź/g, 'Z')
      .replace(/Ó/g, 'O');
  };
  
  // Logo i nagłówek firmy
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Nagłówek
  pdf.setFontSize(20);
  pdf.setTextColor(255, 102, 0); // Pomarańczowy
  pdf.text('PlexiSystem S.C.', 20, 20);
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(safeText('Ks. Dr. Leona Heyke 11'), 20, 27);
  pdf.text(safeText('84-206 Nowy Dwor Wejherowski'), 20, 32);
  pdf.text('NIP: 588-239-62-72', 20, 37);
  pdf.text('Tel: 884 042 107', 20, 42);
  
  // Tytuł dokumentu
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('DOKUMENT WYDANIA WZ', pageWidth / 2, 55, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(`Nr: ${document.document_number}`, pageWidth / 2, 62, { align: 'center' });
  
  // Informacje o kliencie i dostawie
  let yPos = 75;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ODBIORCA:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  
  yPos += 6;
  pdf.text(safeText(document.client_name || ''), 20, yPos);
  yPos += 5;
  const clientAddressLines = pdf.splitTextToSize(safeText(document.client_address || ''), 80);
  clientAddressLines.forEach((line: string) => {
    pdf.text(line, 20, yPos);
    yPos += 5;
  });
  
  if (document.client_nip) {
    pdf.text(safeText(`NIP: ${document.client_nip}`), 20, yPos);
    yPos += 5;
  }
  
  // Adres dostawy (po prawej stronie)
  let yPosRight = 75;
  pdf.setFont('helvetica', 'bold');
  pdf.text('ADRES DOSTAWY:', 110, yPosRight);
  pdf.setFont('helvetica', 'normal');
  
  yPosRight += 6;
  const deliveryAddressLines = pdf.splitTextToSize(safeText(document.delivery_address || ''), 80);
  deliveryAddressLines.forEach((line: string) => {
    pdf.text(line, 110, yPosRight);
    yPosRight += 5;
  });
  
  // Data i numer zamówienia
  yPos = Math.max(yPos, yPosRight) + 10;
  pdf.text(`Data wydania: ${new Date(document.delivery_date).toLocaleDateString('pl-PL')}`, 20, yPos);
  if (document.order_number) {
    pdf.text(`Nr zamówienia: ${document.order_number}`, 110, yPos);
  }
  
  // Tabela produktów - rysujemy ręcznie
  yPos += 15;
  
  // Nagłówki tabeli
  pdf.setFont('helvetica', 'bold');
  pdf.setFillColor(255, 102, 0);
  pdf.rect(20, yPos, 170, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  
  const headers = [
    { text: 'Lp.', x: 22, width: 10 },
    { text: 'Nazwa produktu', x: 34, width: 60 },
    { text: 'Ilość', x: 96, width: 20 },
    { text: 'Jedn.', x: 118, width: 15 },
    { text: 'Cena netto', x: 135, width: 25 },
    { text: 'VAT %', x: 162, width: 15 },
    { text: 'Wartość brutto', x: 179, width: 25 }
  ];
  
  headers.forEach(header => {
    pdf.text(header.text, header.x, yPos + 5.5);
  });
  
  // Przywróć kolory
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  
  // Pozycje
  yPos += 8;
  let netTotal = 0;
  let vatTotal = 0;
  let grossTotal = 0;
  
  if (document.items && document.items.length > 0) {
    document.items.forEach((item, index) => {
      // Tło dla nieparzystych wierszy
      if (index % 2 === 1) {
        pdf.setFillColor(245, 245, 245);
        pdf.rect(20, yPos, 170, 7, 'F');
      }
      
      // Ramki
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(20, yPos, 170, 7);
      
      // Treść
      pdf.setFontSize(8);
      pdf.text((index + 1).toString(), 22, yPos + 5);
      
      // Nazwa produktu (może być długa)
      const productName = safeText(item.product_name || item.productName || '');
      const displayName = productName.substring(0, 40) + (productName.length > 40 ? '...' : '');
      pdf.text(displayName, 34, yPos + 5);
      
      pdf.text(item.quantity.toString(), 106, yPos + 5, { align: 'right' });
      pdf.text(item.unit, 118, yPos + 5);
      pdf.text(safeText(`${item.price.toFixed(2)} zl`), 155, yPos + 5, { align: 'right' });
      pdf.text(`${item.vat}%`, 169, yPos + 5, { align: 'center' });
      pdf.text(safeText(`${item.total.toFixed(2)} zl`), 187, yPos + 5, { align: 'right' });
      
      netTotal += item.price * item.quantity;
      vatTotal += item.price * item.quantity * item.vat / 100;
      grossTotal += item.total;
      
      yPos += 7;
    });
  }
  
  // Podsumowanie
  yPos += 5;
  
  const summaryX = pageWidth - 70;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Wartość netto:', summaryX, yPos);
  pdf.text(`${netTotal.toFixed(2)} zł`, summaryX + 50, yPos, { align: 'right' });
  
  yPos += 5;
  pdf.text('Podatek VAT:', summaryX, yPos);
  pdf.text(`${vatTotal.toFixed(2)} zł`, summaryX + 50, yPos, { align: 'right' });
  
  yPos += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Wartość brutto:', summaryX, yPos);
  pdf.text(`${grossTotal.toFixed(2)} zł`, summaryX + 50, yPos, { align: 'right' });
  
  // Uwagi
  if (document.notes) {
    yPos += 15;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Uwagi:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 5;
    const notesLines = pdf.splitTextToSize(document.notes, 170);
    notesLines.forEach((line: string) => {
      pdf.text(line, 20, yPos);
      yPos += 5;
    });
  }
  
  // Podpisy
  const bottomY = pdf.internal.pageSize.getHeight() - 40;
  
  pdf.setLineWidth(0.5);
  pdf.line(30, bottomY, 80, bottomY);
  pdf.line(130, bottomY, 180, bottomY);
  
  pdf.setFontSize(9);
  pdf.text('Wydał', 55, bottomY + 5, { align: 'center' });
  pdf.text('Odebrał', 155, bottomY + 5, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.text('(data i podpis)', 55, bottomY + 9, { align: 'center' });
  pdf.text('(data i podpis)', 155, bottomY + 9, { align: 'center' });
  
  // Stopka
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Dokument wygenerowany: ${new Date().toLocaleString('pl-PL')}`,
    pageWidth / 2,
    pdf.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
  
  return pdf;
};

// Funkcja pomocnicza do wysyłania PDF mailem
export const sendShippingPDFByEmail = async (
  document: ShippingDocument,
  recipientEmail: string
): Promise<void> => {
  try {
    const pdf = generateShippingPDF(document);
    const pdfBlob = pdf.output('blob');
    
    // Konwertuj blob na base64
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.readAsDataURL(pdfBlob);
    });
    
    // Wywołaj API do wysyłki emaila
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipientEmail,
        subject: `Dokument WZ ${document.document_number}`,
        text: `W załączeniu przesyłamy dokument wydania WZ nr ${document.document_number}.`,
        html: `
          <p>Dzień dobry,</p>
          <p>W załączeniu przesyłamy dokument wydania WZ nr <strong>${document.document_number}</strong>.</p>
          <p>Data wydania: ${new Date(document.delivery_date).toLocaleDateString('pl-PL')}</p>
          <br>
          <p>Pozdrawiamy,<br>Zespół PlexiSystem</p>
        `,
        attachments: [{
          filename: `WZ_${document.document_number.replace(/\//g, '_')}.pdf`,
          content: base64,
          encoding: 'base64'
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error('Błąd wysyłania emaila');
    }
  } catch (error) {
    console.error('Błąd wysyłania PDF mailem:', error);
    throw error;
  }
};