// src/utils/sendEmail.ts
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64
  }>;
}

export const sendOfferEmail = async (
  clientEmail: string,
  offerNumber: string,
  offerLink: string,
  pdfBase64?: string
): Promise<boolean> => {
  try {
    const emailData: EmailData = {
      to: clientEmail,
      subject: `Oferta ${offerNumber} - PlexiSystem`,
      html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f97316; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { 
                display: inline-block; 
                background: #f97316; 
                color: white; 
                padding: 12px 30px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0;
              }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">PlexiSystem</h1>
                <p style="margin: 5px 0;">Producent wyrobów z plexi i tworzyw sztucznych</p>
              </div>
              <div class="content">
                <h2>Szanowni Państwo,</h2>
                
                <p>W załączeniu przesyłamy ofertę nr <strong>${offerNumber}</strong>.</p>
                
                <p>Ofertę można również przeglądać i zaakceptować online klikając w poniższy link:</p>
                
                <a href="${offerLink}" class="button">Zobacz ofertę online</a>
                
                <p>Link do oferty: <br>
                <a href="${offerLink}" style="color: #f97316; word-break: break-all;">${offerLink}</a></p>
                
                <p>W razie pytań pozostajemy do Państwa dyspozycji.</p>
                
                <div class="footer">
                  <p><strong>PlexiSystem S.C.</strong><br>
                  Ks. Dr. Leona Heyke 11<br>
                  84-206 Nowy Dwór Wejherowski<br>
                  Tel: 884 042 107<br>
                  Email: biuro@plexisystem.pl<br>
                  www.plexisystem.pl</p>
                </div>
              </div>
            </div>
          </body>
          </html>
      `,
      attachments: pdfBase64 ? [{
        filename: `Oferta_${offerNumber}.pdf`,
        content: pdfBase64
      }] : undefined
    };

    const response = await axios.post(
      API_ENDPOINTS.sendEmail,
      emailData
    );

    return response.data.success;
  } catch (error) {
    console.error('Błąd wysyłania emaila:', error);
    return false;
  }
};