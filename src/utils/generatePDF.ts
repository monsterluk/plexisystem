// src/utils/generatePDF.ts
import { Offer } from '../types/Offer';
import { deliveryRegions, expositorTypes } from '../constants/materials';
import { additionalOptions } from '../constants/options';

export function generatePDFHTML(offer: Offer, showInternalData: boolean = false): string {
  const itemsHTML = offer.items.map((item, index) => {
    const options = Object.entries(item.options || {})
      .filter(([key, value]) => value && key !== 'wieko')
      .map(([key]) => {
        const option = additionalOptions.find(o => o.id === key);
        const qty = item.optionQuantities?.[key];
        return option ? `${option.name}${qty > 1 ? ` (${qty}x)` : ''}` : null;
      })
      .filter(Boolean)
      .join(', ');
    
    return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${item.productName}
          ${item.expositorType ? `<br><small>${expositorTypes.find(t => t.id === item.expositorType)?.name}</small>` : ''}
          ${item.options?.wieko ? '<br><small>+ Wieko</small>' : ''}
        </td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${['formatka', 'kaseton', 'ledon'].includes(item.product || '') 
            ? `${item.dimensions.width} × ${item.dimensions.height} mm`
            : `${item.dimensions.width} × ${item.dimensions.height}${item.dimensions.depth > 0 ? ` × ${item.dimensions.depth}` : ''} mm`
          }
        </td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${item.materialName}<br>${item.thickness} mm
        </td>
        <td style="padding: 8px; border: 1px solid #ddd;">${options || '-'}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.unitPrice.toFixed(2)} zł</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${item.totalPrice.toFixed(2)} zł</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Oferta ${offer.number}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f97316;
        }
        .logo {
          font-size: 28px;
          font-weight: 700;
          color: #f97316;
        }
        .company-info {
          text-align: right;
          font-size: 12px;
          color: #666;
        }
        .offer-info {
          background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .offer-number {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #f97316;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-box {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
        }
        .info-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        .info-value {
          font-weight: 600;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background: #f97316;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
        }
        .total-row {
          background: #fef3c7;
          font-weight: 700;
          font-size: 18px;
        }
        .terms {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .internal-note {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .internal-note-header {
          font-weight: 600;
          color: #92400e;
          margin-bottom: 5px;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .header { margin-bottom: 20px; }
          .offer-info { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          ${!showInternalData ? '.internal-note { display: none; }' : ''}
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">PlexiSystem</div>
          <div style="font-size: 12px; color: #666; margin-top: 10px;">
            Ks. Dr. Leona Heyke 11<br>
            84-206 Nowy Dwór Wejherowski<br>
            NIP: 588-239-62-72<br>
            Tel: 884 042 107<br>
            www.plexisystem.pl
          </div>
        </div>
        <div class="company-info">
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">Oferta dla:</div>
          <div><strong>${offer.client.name || 'Nazwa klienta'}</strong></div>
          <div>${offer.client.address || 'Adres'}</div>
          <div>NIP: ${offer.client.nip || 'Brak'}</div>
          ${offer.client.email ? `<div>Email: ${offer.client.email}</div>` : ''}
          ${offer.client.phone ? `<div>Tel: ${offer.client.phone}</div>` : ''}
        </div>
      </div>

      <div class="offer-info">
        <div class="offer-number">Oferta nr ${offer.number}</div>
        <div>Data wystawienia: ${offer.date}</div>
        <div>Ważna do: ${offer.validUntil}</div>
        ${offer.projectName ? `<div style="margin-top: 10px; font-weight: 600;">Projekt: ${offer.projectName}</div>` : ''}
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Handlowiec</div>
          <div class="info-value">${offer.salesperson.name}</div>
          <div style="font-size: 14px; margin-top: 5px;">
            Tel: ${offer.salesperson.phone}<br>
            Email: ${offer.salesperson.email}
          </div>
        </div>
        <div class="info-box">
          <div class="info-label">Warunki handlowe</div>
          <div style="font-size: 14px;">
            <strong>Termin realizacji:</strong> ${offer.terms.deliveryTime}<br>
            <strong>Płatność:</strong> ${offer.terms.paymentTerms}<br>
            <strong>Dostawa:</strong> ${deliveryRegions.find(r => r.id === offer.deliveryRegion)?.name || 'Do ustalenia'}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Specyfikacja produktów</div>
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">Lp.</th>
              <th style="width: 20%;">Produkt</th>
              <th style="width: 15%;">Wymiary</th>
              <th style="width: 15%;">Materiał</th>
              <th style="width: 20%;">Opcje dodatkowe</th>
              <th style="width: 8%;">Ilość</th>
              <th style="width: 10%;">Cena jedn.</th>
              <th style="width: 12%;">Wartość</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
            <tr>
              <td colspan="7" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: 600;">
                Wartość netto:
              </td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: 700;">
                ${offer.totalNet.toFixed(2)} zł
              </td>
            </tr>
            ${offer.discount > 0 ? `
            <tr>
              <td colspan="7" style="padding: 8px; border: 1px solid #ddd; text-align: right;">
                Rabat ${offer.discount}%:
              </td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: #f97316;">
                -${offer.discountValue.toFixed(2)} zł
              </td>
            </tr>
            ` : ''}
            ${offer.deliveryCost > 0 ? `
            <tr>
              <td colspan="7" style="padding: 8px; border: 1px solid #ddd; text-align: right;">
                Koszt dostawy:
              </td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">
                ${offer.deliveryCost.toFixed(2)} zł
              </td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td colspan="7" style="padding: 12px; border: 2px solid #f97316; text-align: right;">
                RAZEM NETTO:
              </td>
              <td style="padding: 12px; border: 2px solid #f97316; text-align: right;">
                ${(offer.totalNetAfterDiscount + offer.deliveryCost).toFixed(2)} zł
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="terms">
        <div class="section-title">Warunki realizacji</div>
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong>Czas realizacji:</strong> ${offer.terms.deliveryTime}</li>
          <li><strong>Dostawa:</strong> ${offer.terms.deliveryMethod}</li>
          <li><strong>Płatność:</strong> ${offer.terms.paymentTerms}</li>
          <li><strong>Gwarancja:</strong> ${offer.terms.warranty}</li>
          <li><strong>Ważność oferty:</strong> ${offer.terms.validity}</li>
        </ul>
        ${offer.comment ? `<div style="margin-top: 15px;"><strong>Uwagi:</strong> ${offer.comment}</div>` : ''}
      </div>

      ${showInternalData && offer.internalNotes ? `
      <div class="internal-note">
        <div class="internal-note-header">⚠️ NOTATKI WEWNĘTRZNE (nie drukować dla klienta):</div>
        <div>${offer.internalNotes}</div>
      </div>
      ` : ''}

      <div class="footer">
        <p>Dziękujemy za zainteresowanie naszą ofertą!</p>
        <p>PlexiSystem - Twój partner w produkcji z plexi i tworzyw sztucznych</p>
        ${offer.shareLink ? `
        <div style="margin-top: 15px; padding: 10px; background: #d1fae5; border-radius: 8px;">
          <p style="font-weight: 600; color: #065f46; margin-bottom: 5px;">Akceptacja online:</p>
          <p style="font-size: 11px; color: #047857;">
            <a href="${offer.shareLink}" style="color: #047857;">${offer.shareLink}</a>
          </p>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

export function printPDF(offer: Offer, showInternalData: boolean = false): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Włącz wyskakujące okna w przeglądarce aby drukować PDF');
    return;
  }
  
  printWindow.document.write(generatePDFHTML(offer, showInternalData));
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

// Główna funkcja eksportowana - BRAKUJĄCA FUNKCJA
export async function generatePDF(offer: Offer, viewMode: 'salesperson' | 'client' = 'client'): Promise<Blob> {
  const showInternalData = viewMode === 'salesperson';
  const html = generatePDFHTML(offer, showInternalData);
  
  // Otwieramy okno drukowania
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Włącz wyskakujące okna w przeglądarce aby generować PDF');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Czekamy na załadowanie
  await new Promise<void>((resolve) => {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        resolve();
      }, 500);
    };
  });
  
  // Zwracamy HTML jako Blob
  return new Blob([html], { type: 'text/html' });
}

// Alias dla kompatybilności wstecznej
export { generatePDF as default };