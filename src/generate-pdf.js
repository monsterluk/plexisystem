// generate-pdf.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const handlePrintPDF = (offer) => {
  const doc = new jsPDF();

  doc.setFont('helvetica');
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Oferta handlowa', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Data oferty: ${new Date().toLocaleDateString()}`, 14, 30);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Dane klienta:', 14, 40);

  const client = offer.client || {};

  const clientData = [
    ['NIP:', client.nip || ''],
    ['Nazwa:', client.name || ''],
    ['Adres:', client.address || ''],
    ['REGON:', client.regon || ''],
    ['Województwo:', client.wojewodztwo || ''],
    ['Powiat:', client.powiat || ''],
    ['Gmina:', client.gmina || '']
  ];

  doc.autoTable({
    startY: 45,
    body: clientData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 2
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'right' },
      1: { halign: 'left' }
    }
  });

  // Możesz tutaj dodać więcej tabeli, np. pozycje oferty, podsumowanie itd.

  doc.save(`oferta_${client.nip || 'klient'}.pdf`);
};