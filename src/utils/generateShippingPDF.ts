import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ShippingDocument } from '../hooks/useShippingDocuments';

// Typy są już zadeklarowane w src/types/jspdf-autotable.d.ts

export const generateShippingPDF = (document: ShippingDocument): jsPDF => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Czcionka i kodowanie dla polskich znaków
  pdf.setFont('helvetica');
  
  // Logo i nagłówek firmy
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Nagłówek
  pdf.setFontSize(20);
  pdf.setTextColor(255, 102, 0); // Pomarańczowy
  pdf.text('PlexiSystem S.C.', 20, 20);
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Ks. Dr. Leona Heyke 11', 20, 27);
  pdf.text('84-206 Nowy Dwór Wejherowski', 20, 32);
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
  pdf.text(document.client_name, 20, yPos);
  yPos += 5;
  const clientAddressLines = pdf.splitTextToSize(document.client_address, 80);
  clientAddressLines.forEach((line: string) => {
    pdf.text(line, 20, yPos);
    yPos += 5;
  });
  
  if (document.client_nip) {
    pdf.text(`NIP: ${document.client_nip}`, 20, yPos);
    yPos += 5;
  }
  
  // Adres dostawy (po prawej stronie)
  let yPosRight = 75;
  pdf.setFont('helvetica', 'bold');
  pdf.text('ADRES DOSTAWY:', 110, yPosRight);
  pdf.setFont('helvetica', 'normal');
  
  yPosRight += 6;
  const deliveryAddressLines = pdf.splitTextToSize(document.delivery_address, 80);
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
  
  // Tabela produktów
  yPos += 15;
  
  const tableColumns = [
    { header: 'Lp.', dataKey: 'lp' },
    { header: 'Nazwa produktu', dataKey: 'productName' },
    { header: 'Kod', dataKey: 'productCode' },
    { header: 'Ilość', dataKey: 'quantity' },
    { header: 'Jedn.', dataKey: 'unit' },
    { header: 'Cena netto', dataKey: 'price' },
    { header: 'VAT %', dataKey: 'vat' },
    { header: 'Wartość netto', dataKey: 'total' }
  ];
  
  const tableRows = document.items?.map((item, index) => ({
    lp: index + 1,
    productName: item.product_name,
    productCode: item.product_code || '-',
    quantity: item.quantity.toString(),
    unit: item.unit,
    price: `${item.price.toFixed(2)} zł`,
    vat: `${item.vat}%`,
    total: `${item.total.toFixed(2)} zł`
  })) || [];
  
  pdf.autoTable({
    columns: tableColumns,
    body: tableRows,
    startY: yPos,
    theme: 'striped',
    headStyles: {
      fillColor: [255, 102, 0],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      lp: { cellWidth: 10 },
      productName: { cellWidth: 'auto' },
      productCode: { cellWidth: 25 },
      quantity: { cellWidth: 15, halign: 'right' },
      unit: { cellWidth: 15 },
      price: { cellWidth: 25, halign: 'right' },
      vat: { cellWidth: 15, halign: 'center' },
      total: { cellWidth: 25, halign: 'right' }
    }
  });
  
  // Podsumowanie
  yPos = pdf.lastAutoTable.finalY + 10;
  
  if (document.net_total && document.vat_total && document.gross_total) {
    const summaryX = pageWidth - 70;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Wartość netto:', summaryX, yPos);
    pdf.text(`${document.net_total.toFixed(2)} zł`, summaryX + 50, yPos, { align: 'right' });
    
    yPos += 5;
    pdf.text('Podatek VAT:', summaryX, yPos);
    pdf.text(`${document.vat_total.toFixed(2)} zł`, summaryX + 50, yPos, { align: 'right' });
    
    yPos += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Wartość brutto:', summaryX, yPos);
    pdf.text(`${document.gross_total.toFixed(2)} zł`, summaryX + 50, yPos, { align: 'right' });
  }
  
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