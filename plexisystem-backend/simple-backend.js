const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend działa!' });
});

// Główna strona
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PlexiSystem Backend API',
    endpoints: ['/api/health', '/api/send-email']
  });
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 's44.cyber-folks.pl',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'oferty@plexisystem.pl',
        pass: process.env.SMTP_PASS || ''
      }
    });

    const { to, subject, html } = req.body;
    
    await transporter.sendMail({
      from: '"PlexiSystem" <oferty@plexisystem.pl>',
      to,
      subject,
      html
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});