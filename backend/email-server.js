// backend/email-server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.EMAIL_PORT || 3002;

app.use(cors());
app.use(express.json());

// Konfiguracja Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // lub inny serwis
  auth: {
    user: process.env.EMAIL_USER || 'biuro@plexisystem.pl',
    pass: process.env.EMAIL_PASS || 'twoje-haslo-aplikacji'
  }
});

// Endpoint do wysyłania emaili
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;
  
  try {
    const info = await transporter.sendMail({
      from: `"PlexiSystem" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    
    console.log('Email wysłany:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Błąd wysyłania emaila:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`📧 Serwer email działa na porcie ${PORT}`);
});
