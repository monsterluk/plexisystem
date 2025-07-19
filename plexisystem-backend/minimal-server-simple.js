// minimal-server-simple.js - Backend z obsługą API GUS
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS dla wszystkich
app.use(cors()); // Otwarty CORS - akceptuje wszystkie originy
app.use(express.json({ limit: '50mb' }));

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PlexiSystem Backend API',
    version: '1.0.0',
    endpoints: ['/api/health', '/api/send-email', '/api/gus/:nip'],
    cors: 'open'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend działa!',
    timestamp: new Date().toISOString()
  });
});

// GUS API Service
class GUSService {
  constructor() {
    this.apiKey = 'cc8f3d1743644ffc9b15';
    this.baseUrl = 'https://wl-api.mf.gov.pl';
    this.sessionId = null;
    this.sessionTimestamp = null;
  }

  async login() {
    try {
      const loginEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
  <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
    <wsa:To>${this.baseUrl}</wsa:To>
    <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj</wsa:Action>
  </soap:Header>
  <soap:Body>
    <ns:Zaloguj>
      <ns:pKluczUzytkownika>${this.apiKey}</ns:pKluczUzytkownika>
    </ns:Zaloguj>
  </soap:Body>
</soap:Envelope>`;

      const response = await axios.post(this.baseUrl, loginEnvelope, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'Accept': 'application/soap+xml'
        }
      });

      // Wyciągnij sesję z odpowiedzi
      const sessionMatch = response.data.match(/<ZalogujResult>(.*?)<\/ZalogujResult>/);
      if (sessionMatch && sessionMatch[1]) {
        this.sessionId = sessionMatch[1];
        this.sessionTimestamp = Date.now();
        console.log('Zalogowano do GUS, sesja:', this.sessionId);
        return this.sessionId;
      }
      
      throw new Error('Nie udało się uzyskać sesji GUS');
    } catch (error) {
      console.error('Błąd logowania do GUS:', error.message);
      throw error;
    }
  }

  async ensureSession() {
    const SESSION_TIMEOUT = 55 * 60 * 1000; // 55 minut

    if (!this.sessionId || !this.sessionTimestamp || 
        (Date.now() - this.sessionTimestamp) > SESSION_TIMEOUT) {
      await this.login();
    }

    return this.sessionId;
  }

  async searchByNIP(nip) {
    try {
      const sessionId = await this.ensureSession();
      const cleanNip = nip.replace(/[^0-9]/g, '');

      const searchEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
  <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
    <wsa:To>${this.baseUrl}</wsa:To>
    <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty</wsa:Action>
  </soap:Header>
  <soap:Body>
    <ns:DaneSzukajPodmioty>
      <ns:pParametryWyszukiwania>
        <ns:Nip>${cleanNip}</ns:Nip>
      </ns:pParametryWyszukiwania>
    </ns:DaneSzukajPodmioty>
  </soap:Body>
</soap:Envelope>`;

      const response = await axios.post(this.baseUrl, searchEnvelope, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'Accept': 'application/soap+xml',
          'sid': sessionId
        }
      });

      // Parsuj odpowiedź - szukamy danych
      const responseData = response.data;
      
      // Sprawdź czy są dane
      if (!responseData.includes('<dane>')) {
        return null;
      }

      // Wyciągnij podstawowe dane z odpowiedzi
      const extractValue = (tag) => {
        const match = responseData.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
        return match ? match[1] : '';
      };

      const companyData = {
        nip: extractValue('Nip') || cleanNip,
        name: extractValue('Nazwa') || '',
        regon: extractValue('Regon') || '',
        wojewodztwo: extractValue('Wojewodztwo') || '',
        powiat: extractValue('Powiat') || '',
        gmina: extractValue('Gmina') || '',
        miejscowosc: extractValue('Miejscowosc') || '',
        kodPocztowy: extractValue('KodPocztowy') || '',
        ulica: extractValue('Ulica') || '',
        nrNieruchomosci: extractValue('NrNieruchomosci') || '',
        nrLokalu: extractValue('NrLokalu') || '',
        typ: extractValue('Typ') || ''
      };

      // Formatuj adres
      const addressParts = [];
      if (companyData.ulica) {
        addressParts.push(companyData.ulica);
      }
      if (companyData.nrNieruchomosci) {
        addressParts.push(companyData.nrNieruchomosci);
      }
      if (companyData.nrLokalu) {
        addressParts.push(`lok. ${companyData.nrLokalu}`);
      }
      
      const street = addressParts.join(' ');
      const city = companyData.kodPocztowy && companyData.miejscowosc 
        ? `${companyData.kodPocztowy} ${companyData.miejscowosc}` 
        : companyData.miejscowosc;
      
      const address = [street, city].filter(Boolean).join(', ');

      return {
        nip: companyData.nip,
        name: companyData.name,
        address: address,
        regon: companyData.regon,
        wojewodztwo: companyData.wojewodztwo,
        powiat: companyData.powiat,
        gmina: companyData.gmina,
        email: '', // GUS nie zwraca emaila
        phone: ''  // GUS nie zwraca telefonu
      };

    } catch (error) {
      console.error('Błąd wyszukiwania w GUS:', error.message);
      
      // Jeśli to błąd sesji, spróbuj ponownie
      if (error.response && error.response.status === 401) {
        this.sessionId = null;
        return this.searchByNIP(nip);
      }
      
      return null;
    }
  }
}

// Utwórz instancję serwisu GUS
const gusService = new GUSService();

// Endpoint GUS
app.get('/api/gus/:nip', async (req, res) => {
  const { nip } = req.params;
  
  try {
    console.log('Szukam w GUS dla NIP:', nip);
    
    // Spróbuj pobrać dane z API GUS
    const gusData = await gusService.searchByNIP(nip);
    
    if (gusData) {
      console.log('Znaleziono dane w GUS:', gusData.name);
      res.json(gusData);
      return;
    }
    
    // Fallback - dane testowe
    const testData = {
      '5252344078': {
        nip: '5252344078',
        name: 'PLEXISYSTEM ŁUKASZ SIKORRA',
        address: 'ul. Kartuska 145B lok. 1, 80-122 Gdańsk',
        regon: '146866569',
        wojewodztwo: 'POMORSKIE',
        powiat: 'Gdańsk',
        gmina: 'Gdańsk',
        email: '',
        phone: ''
      },
      '5213870274': {
        nip: '5213870274',
        name: 'Google Poland Sp. z o.o.',
        address: 'ul. Emilii Plater 53, 00-113 Warszawa',
        regon: '380871946',
        wojewodztwo: 'mazowieckie',
        powiat: 'warszawski',
        gmina: 'Warszawa',
        email: 'kontakt@google.pl',
        phone: '22 207 19 00'
      }
    };
    
    if (testData[nip]) {
      console.log('Używam danych testowych dla NIP:', nip);
      res.json(testData[nip]);
    } else {
      res.status(404).json({ message: 'Nie znaleziono firmy' });
    }
  } catch (error) {
    console.error('Błąd endpoint GUS:', error.message);
    res.status(500).json({ 
      message: 'Błąd serwera', 
      error: error.message 
    });
  }
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, attachments } = req.body;
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 's44.cyber-folks.pl',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'oferty@plexisystem.pl',
        pass: process.env.SMTP_PASS || '36ZVvm^D-E-Zi_-D'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: '"PlexiSystem" <oferty@plexisystem.pl>',
      to,
      subject,
      html,
      attachments: attachments || []
    };

    const info = await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true,
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found', 
    path: req.path 
  });
});

// Start serwera
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀 PlexiSystem Backend is running!
  📍 Port: ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  ✉️  Email service: Ready
  🔓 CORS: Open for all origins
  🏢 GUS API: Ready with key ${gusService.apiKey ? '✓' : '✗'}
  `);
});
