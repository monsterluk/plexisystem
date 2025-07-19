import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { QualityCheck } from '../hooks/useQualityChecks';

// Typy są już zadeklarowane w src/types/jspdf-autotable.d.ts

export const generateQualityPDF = (check: QualityCheck): jsPDF => {
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
  pdf.text('PROTOKÓŁ KONTROLI JAKOŚCI', pageWidth / 2, 55, { align: 'center' });
  
  // Status kontroli - kolorowy badge
  const statusColors = {
    passed: { r: 16, g: 185, b: 129 }, // Zielony
    failed: { r: 239, g: 68, b: 68 }, // Czerwony
    conditional: { r: 245, g: 158, b: 11 } // Żółty
  };
  
  const statusLabels = {
    passed: 'ZALICZONA',
    failed: 'NIEZALICZONA',
    conditional: 'WARUNKOWA'
  };
  
  const color = statusColors[check.status];
  pdf.setFillColor(color.r, color.g, color.b);
  pdf.roundedRect(pageWidth / 2 - 25, 60, 50, 10, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.text(statusLabels[check.status], pageWidth / 2, 67, { align: 'center' });
  
  // Przywróć domyślny kolor tekstu
  pdf.setTextColor(0, 0, 0);
  
  // Informacje o kontroli
  let yPos = 85;
  
  // Lewa kolumna
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMACJE O KONTROLI', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  
  yPos += 8;
  pdf.text(`Nr zamówienia: ${check.order_number}`, 20, yPos);
  yPos += 6;
  pdf.text(`Produkt: ${check.product_name}`, 20, yPos);
  yPos += 6;
  if (check.product_code) {
    pdf.text(`Kod produktu: ${check.product_code}`, 20, yPos);
    yPos += 6;
  }
  if (check.batch_number) {
    pdf.text(`Nr partii: ${check.batch_number}`, 20, yPos);
    yPos += 6;
  }
  pdf.text(`Ilość: ${check.quantity} szt.`, 20, yPos);
  
  // Prawa kolumna
  yPos = 93;
  pdf.text(`Data kontroli: ${new Date(check.check_date).toLocaleDateString('pl-PL')}`, 110, yPos);
  yPos += 6;
  if (check.check_time) {
    pdf.text(`Godzina: ${check.check_time}`, 110, yPos);
    yPos += 6;
  }
  pdf.text(`Kontroler: ${check.inspector}`, 110, yPos);
  
  // Pomiary
  if (check.measurements && check.measurements.length > 0) {
    yPos += 20;
    pdf.setFont('helvetica', 'bold');
    pdf.text('WYNIKI POMIARÓW', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    
    yPos += 10;
    
    const measurementColumns = [
      { header: 'Parametr', dataKey: 'parameter' },
      { header: 'Wartość nominalna', dataKey: 'nominal' },
      { header: 'Tolerancja (±)', dataKey: 'tolerance' },
      { header: 'Wartość zmierzona', dataKey: 'measured' },
      { header: 'Status', dataKey: 'status' }
    ];
    
    const measurementRows = check.measurements.map(m => ({
      parameter: m.parameter,
      nominal: `${m.nominal} mm`,
      tolerance: `${m.tolerance} mm`,
      measured: `${m.measured} mm`,
      status: m.in_tolerance ? 'OK' : 'NOK'
    }));
    
    pdf.autoTable({
      columns: measurementColumns,
      body: measurementRows,
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
        status: {
          cellWidth: 20,
          halign: 'center',
          fontStyle: 'bold'
        }
      },
      didParseCell: function(data: any) {
        if (data.column.dataKey === 'status' && data.cell.section === 'body') {
          if (data.cell.raw === 'OK') {
            data.cell.styles.textColor = [16, 185, 129]; // Zielony
          } else {
            data.cell.styles.textColor = [239, 68, 68]; // Czerwony
          }
        }
      }
    });
    
    yPos = pdf.lastAutoTable.finalY + 10;
  }
  
  // Defekty
  if (check.defects && check.defects.length > 0) {
    if (yPos > 200) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('WYKRYTE DEFEKTY', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    
    yPos += 10;
    
    const defectColumns = [
      { header: 'Typ defektu', dataKey: 'defect_type' },
      { header: 'Poziom', dataKey: 'severity' },
      { header: 'Opis', dataKey: 'description' },
      { header: 'Podjęte działania', dataKey: 'action_taken' }
    ];
    
    const severityLabels = {
      minor: 'Drobny',
      major: 'Poważny',
      critical: 'Krytyczny'
    };
    
    const defectRows = check.defects.map(d => ({
      defect_type: d.defect_type,
      severity: severityLabels[d.severity],
      description: d.description,
      action_taken: d.action_taken || '-'
    }));
    
    pdf.autoTable({
      columns: defectColumns,
      body: defectRows,
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
        defect_type: { cellWidth: 35 },
        severity: { cellWidth: 25, halign: 'center' },
        description: { cellWidth: 'auto' },
        action_taken: { cellWidth: 'auto' }
      },
      didParseCell: function(data: any) {
        if (data.column.dataKey === 'severity' && data.cell.section === 'body') {
          const severityColors: any = {
            'Drobny': [245, 158, 11], // Żółty
            'Poważny': [251, 146, 60], // Pomarańczowy
            'Krytyczny': [239, 68, 68] // Czerwony
          };
          data.cell.styles.textColor = severityColors[data.cell.raw] || [0, 0, 0];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
    
    yPos = pdf.lastAutoTable.finalY + 10;
  }
  
  // Uwagi
  if (check.notes) {
    if (yPos > 220) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('UWAGI', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 6;
    
    const notesLines = pdf.splitTextToSize(check.notes, 170);
    notesLines.forEach((line: string) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(line, 20, yPos);
      yPos += 5;
    });
  }
  
  // Podsumowanie
  if (yPos > 230) {
    pdf.addPage();
    yPos = 20;
  } else {
    yPos += 15;
  }
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('DECYZJA KOŃCOWA', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  yPos += 8;
  
  const decisions = {
    passed: 'Produkt spełnia wszystkie wymagania jakościowe i zostaje dopuszczony do wysyłki.',
    failed: 'Produkt NIE spełnia wymagań jakościowych i wymaga działań korygujących.',
    conditional: 'Produkt zostaje warunkowo dopuszczony do wysyłki z zastrzeżeniami.'
  };
  
  const decisionLines = pdf.splitTextToSize(decisions[check.status], 170);
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
  pdf.text('Kontroler jakości', 55, bottomY + 5, { align: 'center' });
  pdf.text('Kierownik produkcji', 155, bottomY + 5, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.text('(data i podpis)', 55, bottomY + 9, { align: 'center' });
  pdf.text('(data i podpis)', 155, bottomY + 9, { align: 'center' });
  
  // Stopka
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Protokół wygenerowany: ${new Date().toLocaleString('pl-PL')}`,
    pageWidth / 2,
    pdf.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
  
  return pdf;
};

// Funkcja do generowania certyfikatu jakości
export const generateQualityCertificate = (check: QualityCheck): jsPDF => {
  const pdf = new jsPDF('l', 'mm', 'a4'); // Orientacja pozioma
  
  // Ramka ozdobna
  pdf.setLineWidth(2);
  pdf.setDrawColor(255, 102, 0);
  pdf.rect(10, 10, 277, 190);
  pdf.setLineWidth(0.5);
  pdf.rect(15, 15, 267, 180);
  
  // Nagłówek
  pdf.setFontSize(32);
  pdf.setTextColor(255, 102, 0);
  pdf.text('CERTYFIKAT JAKOŚCI', 148.5, 40, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('PlexiSystem S.C.', 148.5, 52, { align: 'center' });
  
  // Treść certyfikatu
  pdf.setFontSize(12);
  pdf.text('Niniejszym zaświadczamy, że produkt:', 148.5, 75, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(check.product_name, 148.5, 88, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  if (check.product_code) {
    pdf.text(`Kod produktu: ${check.product_code}`, 148.5, 98, { align: 'center' });
  }
  if (check.batch_number) {
    pdf.text(`Nr partii: ${check.batch_number}`, 148.5, 106, { align: 'center' });
  }
  
  pdf.text(`Nr zamówienia: ${check.order_number}`, 148.5, 114, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.text('został poddany kontroli jakości w dniu:', 148.5, 130, { align: 'center' });
  pdf.setFont('helvetica', 'bold');
  pdf.text(new Date(check.check_date).toLocaleDateString('pl-PL'), 148.5, 140, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('i spełnia wszystkie wymagane normy jakościowe.', 148.5, 155, { align: 'center' });
  
  // Podpis i pieczątka
  pdf.setLineWidth(0.5);
  pdf.line(80, 175, 130, 175);
  pdf.line(167, 175, 217, 175);
  
  pdf.setFontSize(10);
  pdf.text('Kontroler jakości', 105, 180, { align: 'center' });
  pdf.text('Dyrektor ds. jakości', 192, 180, { align: 'center' });
  
  return pdf;
};