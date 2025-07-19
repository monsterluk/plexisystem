import jsPDF from 'jspdf';
import { QualityCheck } from '../hooks/useQualityChecks';

export const generateQualityPDF = (check: QualityCheck): jsPDF => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
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
  
  // Czcionka
  pdf.setFont('helvetica');
  
  // Logo i nagłówek firmy
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Nagłówek
  pdf.setFontSize(20);
  pdf.setTextColor(255, 102, 0);
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
  pdf.text(safeText('PROTOKOL KONTROLI JAKOSCI'), pageWidth / 2, 55, { align: 'center' });
  
  // Status kontroli
  const statusLabels = {
    passed: 'ZALICZONA',
    failed: 'NIEZALICZONA',
    conditional: 'WARUNKOWA'
  };
  
  const statusColors = {
    passed: { r: 16, g: 185, b: 129 },
    failed: { r: 239, g: 68, b: 68 },
    conditional: { r: 245, g: 158, b: 11 }
  };
  
  const color = statusColors[check.status];
  pdf.setFillColor(color.r, color.g, color.b);
  pdf.rect(pageWidth / 2 - 25, 60, 50, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.text(statusLabels[check.status], pageWidth / 2, 67, { align: 'center' });
  
  // Przywróć domyślny kolor tekstu
  pdf.setTextColor(0, 0, 0);
  
  // Informacje o kontroli
  let yPos = 85;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMACJE O KONTROLI', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  
  yPos += 8;
  pdf.text(safeText(`Nr zamowienia: ${check.order_number || '-'}`), 20, yPos);
  yPos += 6;
  pdf.text(safeText(`Produkt: ${check.product_name}`), 20, yPos);
  yPos += 6;
  if (check.product_code) {
    pdf.text(safeText(`Kod produktu: ${check.product_code}`), 20, yPos);
    yPos += 6;
  }
  if (check.batch_number) {
    pdf.text(safeText(`Nr partii: ${check.batch_number}`), 20, yPos);
    yPos += 6;
  }
  pdf.text(safeText(`Ilosc: ${check.quantity} szt.`), 20, yPos);
  
  // Prawa kolumna
  yPos = 93;
  pdf.text(`Data kontroli: ${new Date(check.check_date).toLocaleDateString('pl-PL')}`, 110, yPos);
  yPos += 6;
  if (check.check_time) {
    pdf.text(`Godzina: ${check.check_time}`, 110, yPos);
    yPos += 6;
  }
  pdf.text(safeText(`Kontroler: ${check.inspector}`), 110, yPos);
  
  // Pomiary
  if (check.measurements && check.measurements.length > 0) {
    yPos += 20;
    pdf.setFont('helvetica', 'bold');
    pdf.text(safeText('WYNIKI POMIAROW'), 20, yPos);
    pdf.setFont('helvetica', 'normal');
    
    yPos += 10;
    
    // Nagłówki tabeli pomiarów
    pdf.setFillColor(255, 102, 0);
    pdf.rect(20, yPos, 170, 7, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    
    pdf.text('Parametr', 22, yPos + 5);
    pdf.text(safeText('Wartosc nominalna'), 60, yPos + 5);
    pdf.text('Tolerancja', 100, yPos + 5);
    pdf.text(safeText('Wartosc zmierzona'), 130, yPos + 5);
    pdf.text('Status', 170, yPos + 5);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    
    yPos += 7;
    
    check.measurements.forEach((m, index) => {
      if (index % 2 === 1) {
        pdf.setFillColor(245, 245, 245);
        pdf.rect(20, yPos, 170, 7, 'F');
      }
      
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(20, yPos, 170, 7);
      
      pdf.text(safeText(m.parameter), 22, yPos + 5);
      pdf.text(`${m.nominal} mm`, 60, yPos + 5);
      pdf.text(`+/- ${m.tolerance} mm`, 100, yPos + 5);
      pdf.text(`${m.measured} mm`, 130, yPos + 5);
      
      if (m.in_tolerance) {
        pdf.setTextColor(16, 185, 129);
        pdf.text('OK', 170, yPos + 5);
      } else {
        pdf.setTextColor(239, 68, 68);
        pdf.text('NOK', 170, yPos + 5);
      }
      pdf.setTextColor(0, 0, 0);
      
      yPos += 7;
    });
  }
  
  // Defekty
  if (check.defects && check.defects.length > 0) {
    if (yPos > 200) {
      pdf.addPage();
      yPos = 20;
    }
    
    yPos += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('WYKRYTE DEFEKTY', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    
    yPos += 10;
    
    check.defects.forEach(d => {
      const severityLabels = {
        minor: 'Drobny',
        major: 'Powazny',
        critical: 'Krytyczny'
      };
      
      const severityColors = {
        minor: { r: 245, g: 158, b: 11 },
        major: { r: 251, g: 146, b: 60 },
        critical: { r: 239, g: 68, b: 68 }
      };
      
      const color = severityColors[d.severity];
      pdf.setFillColor(color.r, color.g, color.b, 0.2);
      pdf.rect(20, yPos, 170, 20, 'F');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`[${severityLabels[d.severity]}] ${safeText(d.defect_type)}`, 22, yPos + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      
      const descLines = pdf.splitTextToSize(safeText(d.description), 160);
      let lineY = yPos + 10;
      descLines.forEach((line: string) => {
        pdf.text(line, 22, lineY);
        lineY += 4;
      });
      
      if (d.action_taken) {
        pdf.text(safeText(`Dzialanie: ${d.action_taken}`), 22, lineY);
      }
      
      yPos += 22;
    });
  }
  
  // Uwagi
  if (check.notes) {
    if (yPos > 220) {
      pdf.addPage();
      yPos = 20;
    }
    
    yPos += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('UWAGI', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    yPos += 6;
    
    const notesLines = pdf.splitTextToSize(safeText(check.notes), 170);
    notesLines.forEach((line: string) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(line, 20, yPos);
      yPos += 5;
    });
  }
  
  // Decyzja końcowa
  if (yPos > 230) {
    pdf.addPage();
    yPos = 20;
  } else {
    yPos += 15;
  }
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text(safeText('DECYZJA KONCOWA'), 20, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  yPos += 8;
  
  const decisions = {
    passed: 'Produkt spelnia wszystkie wymagania jakosciowe i zostaje dopuszczony do wysylki.',
    failed: 'Produkt NIE spelnia wymagan jakosciowych i wymaga dzialan korygujacych.',
    conditional: 'Produkt zostaje warunkowo dopuszczony do wysylki z zastrzezeniami.'
  };
  
  const decisionLines = pdf.splitTextToSize(safeText(decisions[check.status]), 170);
  decisionLines.forEach((line: string) => {
    pdf.text(line, 20, yPos);
    yPos += 5;
  });
  
  // Podpisy
  const bottomY = pdf.internal.pageSize.getHeight() - 40;
  
  pdf.setLineWidth(0.5);
  pdf.line(30, bottomY, 80, bottomY);
  pdf.line(130, bottomY, 180, bottomY);
  
  pdf.setFontSize(9);
  pdf.text(safeText('Kontroler jakosci'), 55, bottomY + 5, { align: 'center' });
  pdf.text('Kierownik produkcji', 155, bottomY + 5, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.text('(data i podpis)', 55, bottomY + 9, { align: 'center' });
  pdf.text('(data i podpis)', 155, bottomY + 9, { align: 'center' });
  
  // Stopka
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    safeText(`Protokol wygenerowany: ${new Date().toLocaleString('pl-PL')}`),
    pageWidth / 2,
    pdf.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
  
  return pdf;
};

// Funkcja do generowania certyfikatu jakości (uproszczona)
export const generateQualityCertificate = (check: QualityCheck): jsPDF => {
  const pdf = new jsPDF('l', 'mm', 'a4');
  
  const safeText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/[łŁąęśćńżźóĄĘŚĆŃŻŹÓ]/g, (match) => {
        const replacements: { [key: string]: string } = {
          'ł': 'l', 'Ł': 'L', 'ą': 'a', 'ę': 'e', 'ś': 's', 'ć': 'c',
          'ń': 'n', 'ż': 'z', 'ź': 'z', 'ó': 'o', 'Ą': 'A', 'Ę': 'E',
          'Ś': 'S', 'Ć': 'C', 'Ń': 'N', 'Ż': 'Z', 'Ź': 'Z', 'Ó': 'O'
        };
        return replacements[match] || match;
      });
  };
  
  // Ramka ozdobna
  pdf.setLineWidth(2);
  pdf.setDrawColor(255, 102, 0);
  pdf.rect(10, 10, 277, 190);
  pdf.setLineWidth(0.5);
  pdf.rect(15, 15, 267, 180);
  
  // Nagłówek
  pdf.setFontSize(32);
  pdf.setTextColor(255, 102, 0);
  pdf.text(safeText('CERTYFIKAT JAKOSCI'), 148.5, 40, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('PlexiSystem S.C.', 148.5, 52, { align: 'center' });
  
  // Treść certyfikatu
  pdf.setFontSize(12);
  pdf.text(safeText('Niniejszym zaswiadczamy, ze produkt:'), 148.5, 75, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(safeText(check.product_name), 148.5, 88, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  if (check.product_code) {
    pdf.text(safeText(`Kod produktu: ${check.product_code}`), 148.5, 98, { align: 'center' });
  }
  if (check.batch_number) {
    pdf.text(safeText(`Nr partii: ${check.batch_number}`), 148.5, 106, { align: 'center' });
  }
  
  pdf.text(safeText(`Nr zamowienia: ${check.order_number}`), 148.5, 114, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.text(safeText('zostal poddany kontroli jakosci w dniu:'), 148.5, 130, { align: 'center' });
  pdf.setFont('helvetica', 'bold');
  pdf.text(new Date(check.check_date).toLocaleDateString('pl-PL'), 148.5, 140, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(safeText('i spelnia wszystkie wymagane normy jakosciowe.'), 148.5, 155, { align: 'center' });
  
  // Podpis i pieczątka
  pdf.setLineWidth(0.5);
  pdf.line(80, 175, 130, 175);
  pdf.line(167, 175, 217, 175);
  
  pdf.setFontSize(10);
  pdf.text(safeText('Kontroler jakosci'), 105, 180, { align: 'center' });
  pdf.text(safeText('Dyrektor ds. jakosci'), 192, 180, { align: 'center' });
  
  return pdf;
};