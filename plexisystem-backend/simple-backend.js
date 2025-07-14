// simple-backend.js - Serwer do wysyłania maili, generowania PDF i pobierania danych GUS
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// === KONFIGURACJA EMAIL (CyberFolks SMTP) ===
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 's44.cyber-folks.pl',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// === ENDPOINT: Wyślij Email ===
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, attachments } = req.body;

    const mailOptions = {
      from: '"PlexiSystem - Oferty" <oferty@plexisystem.pl>',
      to,
      subject,
      html,
      attachments: attachments || []
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email wysłany' });
  } catch (error) {
    console.error('Błąd wysyłania emaila:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ENDPOINT: Generuj PDF ===
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { html } = req.body;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.addStyleTag({
      content: `
        @page { size: A4; margin: 20mm; }
        body { font-family: Arial, sans-serif; }
      `
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=oferta.pdf'
    });
    res.send(pdf);
  } catch (error) {
    console.error('Błąd generowania PDF:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === ENDPOINT: Proxy do Google Apps Script (jeśli masz zrobione) ===
app.get('/api/gus/script/:nip', async (req, res) => {
  const nip = req.params.nip;

  try {
    const scriptURL = `https://script.google.com/macros/s/AKfycbwl25HRBXrLPrgs58QmozBU9dZYouu-J5qXrIx4nZvlRJaFk1Org5OjXw1NE0OO5i7X/exec?nip=${nip}`;
    const response = await fetch(scriptURL);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Błąd proxy do GUS Apps Script:', error);
    res.status(500).json({ error: 'Nie udało się pobrać danych GUS z Apps Script' });
  }
});

// === ENDPOINT: Pobierz dane z oficjalnego API MF (zamiast Google Script, opcjonalnie) ===
app.get('/api/gus/:nip', async (req, res) => {
  const nip = req.params.nip.replace(/\D/g, '');
  if (nip.length !== 10) return res.status(400).json({ error: 'Nieprawidłowy NIP' });

  const today = new Date().toISOString().split('T')[0];
  const url = `https://wl-api.mf.gov.pl/api/search/nip/${nip}?date=${today}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    const s = json.result?.subject;
    if (!s) return res.status(404).json({ error: 'Nie znaleziono firmy' });

    res.json({
      name: s.name,
      address: s.workingAddress || s.residenceAddress,
      regon: s.regon,
      wojewodztwo: s.teryt?.województwo,
      powiat: s.teryt?.powiat,
      gmina: s.teryt?.gmina
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd backendu MF' });
  }
});

// === ENDPOINT: Testowy ===
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serwer działa!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Backend działa na porcie ${PORT}`);
  console.log(`📧 Email: ${process.env.SMTP_USER || 'oferty@plexisystem.pl'}`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/health`);
});