// minimal-server-simple.js - Backend z API Ministerstwa Finansów
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS dla wszystkich
app.use(cors());
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
    version: '5.0.0',
    endpoints: ['/api/health', '/api/send-email', '/api/gus/:nip'],
    cors: 'open',
    gusApi: 'Ministerstwo Finansów - Biała Lista VAT'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend działa!',
    timestamp: new Date().toISOString()
  });
});

// Endpoint GUS - używamy API Ministerstwa Finansów
app.get('/api/gus/:nip', async (req, res) => {
  const { nip } = req.params;
  
  try {
    const cleanNip = nip.replace(/[^0-9]/g, '');
    console.log('Wyszukiwanie w API MF dla NIP:', cleanNip);
    
    // API Ministerstwa Finansów - Biała Lista VAT
    const today = new Date().toISOString().split('T')[0];
    const apiUrl = `https://wl-api.mf.gov.pl/api/search/nip/${cleanNip}?date=${today}`;
    
    console.log('Zapytanie do API MF:', apiUrl);
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PlexiSystem/1.0'
      },
      timeout: 10000
    });
    
    console.log('Odpowiedź status:', response.status);
    
    if (response.data && response.data.result && response.data.result.subject) {
      const subject = response.data.result.subject;
      console.log('Znaleziono firmę:', subject.name);
      
      // Formatuj adres
      let address = '';
      if (typeof subject.workingAddress === 'string') {
        address = subject.workingAddress;
      } else if (subject.workingAddress) {
        const addr = subject.workingAddress;
        const parts = [];
        if (addr.street) parts.push(addr.street);
        if (addr.streetNumber) parts.push(addr.streetNumber);
        if (addr.apartmentNumber) parts.push(`lok. ${addr.apartmentNumber}`);
        if (addr.postCode && addr.city) {
          parts.push(`${addr.postCode} ${addr.city}`);
        } else if (addr.city) {
          parts.push(addr.city);
        }
        address = parts.join(' ');
      } else if (subject.residenceAddress) {
        address = subject.residenceAddress;
      }
      
      // Zwróć dane w formacie zgodnym z naszym API
      const companyData = {
        nip: subject.nip || cleanNip,
        name: subject.name || '',
        address: address || 'Brak adresu',
        regon: subject.regon || '',
        wojewodztwo: '', // API MF nie zwraca województwa
        powiat: '', // API MF nie zwraca powiatu
        gmina: '', // API MF nie zwraca gminy
        email: '', // API MF nie zwraca emaila
        phone: '', // API MF nie zwraca telefonu
        statusVat: subject.statusVat || 'Nieznany',
        krs: subject.krs || ''
      };
      
      res.json(companyData);
      return;
    }
    
    // Jeśli API MF nie znalazło, sprawdź czy to może być osoba fizyczna
    if (response.data && response.data.result && response.data.result.entries) {
      console.log('Nie znaleziono jako podmiot, sprawdzam wpisy...');
    }
    
    // Nie znaleziono
    console.log('Nie znaleziono firmy w API MF dla NIP:', cleanNip);
    res.status(404).json({ 
      message: 'Nie znaleziono firmy w rejestrze',
      nip: cleanNip,
      source: 'Ministerstwo Finansów API'
    });
    
  } catch (error) {
    console.error('Błąd API MF:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 404) {
        res.status(404).json({ 
          message: 'Nie znaleziono firmy w rejestrze',
          nip: nip,
          source: 'Ministerstwo Finansów API'
        });
        return;
      }
      
      if (error.response.status === 400) {
        res.status(400).json({ 
          message: 'Nieprawidłowy NIP',
          nip: nip,
          source: 'Ministerstwo Finansów API'
        });
        return;
      }
    }
    
    res.status(500).json({ 
      message: 'Błąd wyszukiwania',
      error: error.message,
      source: 'Ministerstwo Finansów API'
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
  🏢 GUS API: Ministerstwo Finansów - Biała Lista VAT
  📝 API URL: https://wl-api.mf.gov.pl/api/search/nip/{nip}
  ℹ️  Zwraca: NIP, nazwa, adres, REGON, status VAT, KRS
  `);
});