// minimal-server.js - Minimalny backend dla Render
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS - dozwolone originy
const allowedOrigins = [
  'https://plexisystem.vercel.app',
  'https://plexisystem.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'file://' // dla testów lokalnych
];

app.use(cors({
  origin: function(origin, callback) {
    // Dozwól requests bez origin (np. Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PlexiSystem Backend API',
    version: '1.0.0',
    endpoints: ['/api/health', '/api/send-email']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend działa!',
    timestamp: new Date().toISOString()
  });
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

// Start serwera
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀 PlexiSystem Backend is running!
  📍 Port: ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  ✉️  Email service: Ready
  `);
});