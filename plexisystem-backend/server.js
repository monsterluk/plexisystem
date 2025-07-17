const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.BASE_URL || 'https://plexisystem.vercel.app',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Database path - dla Render używamy /var/data
const dbPath = process.env.DATABASE_PATH || './plexisystem.db';
const db = new sqlite3.Database(dbPath);

// Inicjalizacja bazy danych
db.serialize(() => {
  // Tabela klientów
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nip TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      address TEXT,
      email TEXT,
      phone TEXT,
      regon TEXT,
      wojewodztwo TEXT,
      powiat TEXT,
      gmina TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela ofert
  db.run(`
    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      offer_number TEXT UNIQUE NOT NULL,
      share_token TEXT UNIQUE NOT NULL,
      client_id INTEGER,
      salesperson_id TEXT,
      salesperson_name TEXT,
      project_name TEXT,
      status TEXT DEFAULT 'draft',
      total_net REAL,
      discount REAL DEFAULT 0,
      discount_value REAL DEFAULT 0,
      total_net_after_discount REAL,
      delivery_region TEXT,
      delivery_cost REAL DEFAULT 0,
      terms_delivery_time TEXT,
      terms_delivery_method TEXT,
      terms_payment TEXT,
      terms_warranty TEXT,
      terms_validity TEXT,
      valid_until DATE,
      comment TEXT,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      version INTEGER DEFAULT 1,
      FOREIGN KEY (client_id) REFERENCES clients (id)
    )
  `);

  // Tabela pozycji oferty
  db.run(`
    CREATE TABLE IF NOT EXISTS offer_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      offer_id INTEGER,
      product TEXT,
      product_name TEXT,
      expositor_type TEXT,
      material TEXT,
      material_name TEXT,
      thickness INTEGER,
      width INTEGER,
      height INTEGER,
      depth INTEGER,
      quantity INTEGER,
      unit_price REAL,
      total_price REAL,
      surface REAL,
      weight REAL,
      options TEXT,
      calculations TEXT,
      FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE CASCADE
    )
  `);
});

// === ENDPOINTY API ===

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PlexiSystem Backend API',
    version: '2.0.0',
    endpoints: [
      '/api/health',
      '/api/send-email',
      '/api/gus/:nip',
      '/api/offers'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend działa!',
    timestamp: new Date().toISOString(),
    database: dbPath
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
        pass: process.env.SMTP_PASS || ''
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

// Pobierz dane z GUS po NIP
app.get('/api/gus/:nip', async (req, res) => {
  const { nip } = req.params;
  
  try {
    // Mock data dla testów
    const mockData = {
      '1234567890': {
        nip: '1234567890',
        name: 'Firma Testowa Sp. z o.o.',
        address: 'ul. Testowa 123, 00-001 Warszawa',
        regon: '123456789',
        wojewodztwo: 'mazowieckie',
        powiat: 'warszawski',
        gmina: 'Warszawa',
        email: 'biuro@firma-testowa.pl',
        phone: '22 123 45 67'
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
    
    if (mockData[nip]) {
      res.json(mockData[nip]);
    } else {
      res.status(404).json({ message: 'Nie znaleziono firmy' });
    }
  } catch (error) {
    console.error('Błąd GUS:', error.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Pobierz wszystkie oferty
app.get('/api/offers', (req, res) => {
  const sql = `
    SELECT o.*, c.name as client_name, c.nip as client_nip 
    FROM offers o
    LEFT JOIN clients c ON o.client_id = c.id
    ORDER BY o.created_at DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Pobierz pojedynczą ofertę
app.get('/api/offers/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    `SELECT o.*, c.* FROM offers o 
     LEFT JOIN clients c ON o.client_id = c.id 
     WHERE o.id = ?`,
    [id],
    (err, offer) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!offer) {
        res.status(404).json({ error: 'Oferta nie znaleziona' });
        return;
      }
      
      db.all(
        'SELECT * FROM offer_items WHERE offer_id = ?',
        [id],
        (err, items) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          items = items.map(item => ({
            ...item,
            options: JSON.parse(item.options || '{}'),
            calculations: JSON.parse(item.calculations || '{}')
          }));
          
          const response = {
            id: offer.id,
            number: offer.offer_number,
            shareLink: `${process.env.BASE_URL || 'http://localhost:3000'}/oferta/${offer.share_token}`,
            date: offer.created_at,
            client: {
              nip: offer.nip,
              name: offer.name,
              address: offer.address,
              email: offer.email,
              phone: offer.phone,
              regon: offer.regon,
              wojewodztwo: offer.wojewodztwo,
              powiat: offer.powiat,
              gmina: offer.gmina
            },
            items: items,
            terms: {
              deliveryTime: offer.terms_delivery_time,
              deliveryMethod: offer.terms_delivery_method,
              paymentTerms: offer.terms_payment,
              warranty: offer.terms_warranty,
              validity: offer.terms_validity
            },
            status: offer.status,
            salesperson: {
              id: offer.salesperson_id,
              name: offer.salesperson_name
            },
            comment: offer.comment,
            internalNotes: offer.internal_notes,
            totalNet: offer.total_net,
            discount: offer.discount,
            discountValue: offer.discount_value,
            totalNetAfterDiscount: offer.total_net_after_discount,
            deliveryRegion: offer.delivery_region,
            deliveryCost: offer.delivery_cost,
            projectName: offer.project_name,
            validUntil: offer.valid_until,
            version: offer.version
          };
          
          res.json(response);
        }
      );
    }
  );
});

// Pobierz ofertę po tokenie (dla klienta)
app.get('/api/offers/share/:token', (req, res) => {
  const { token } = req.params;
  
  db.get(
    `SELECT o.*, c.* FROM offers o 
     LEFT JOIN clients c ON o.client_id = c.id 
     WHERE o.share_token = ?`,
    [token],
    (err, offer) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!offer) {
        res.status(404).json({ error: 'Oferta nie znaleziona' });
        return;
      }
      
      db.all(
        'SELECT * FROM offer_items WHERE offer_id = ?',
        [offer.id],
        (err, items) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          items = items.map(item => ({
            ...item,
            options: JSON.parse(item.options || '{}'),
            calculations: {
              surface: JSON.parse(item.calculations || '{}').surface,
              weight: JSON.parse(item.calculations || '{}').weight
            }
          }));
          
          const response = {
            number: offer.offer_number,
            date: offer.created_at,
            client: {
              name: offer.name,
              address: offer.address
            },
            items: items,
            terms: {
              deliveryTime: offer.terms_delivery_time,
              deliveryMethod: offer.terms_delivery_method,
              paymentTerms: offer.terms_payment,
              warranty: offer.terms_warranty,
              validity: offer.terms_validity
            },
            status: offer.status,
            totalNet: offer.total_net,
            discount: offer.discount,
            discountValue: offer.discount_value,
            totalNetAfterDiscount: offer.total_net_after_discount,
            deliveryRegion: offer.delivery_region,
            deliveryCost: offer.delivery_cost,
            projectName: offer.project_name,
            validUntil: offer.valid_until
          };
          
          res.json(response);
        }
      );
    }
  );
});

// Zapisz nową ofertę
app.post('/api/offers', (req, res) => {
  const offer = req.body;
  
  const year = new Date().getFullYear();
  const offerNumber = `${offer.salesperson.id}-${year}-${String(Date.now()).slice(-4)}`;
  const shareToken = uuidv4();
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    db.get(
      'SELECT id FROM clients WHERE nip = ?',
      [offer.client.nip],
      (err, existingClient) => {
        if (err) {
          db.run('ROLLBACK');
          res.status(500).json({ error: err.message });
          return;
        }
        
        const saveOffer = (clientId) => {
          db.run(
            `INSERT INTO offers (
              offer_number, share_token, client_id, salesperson_id, salesperson_name,
              project_name, status, total_net, discount, discount_value,
              total_net_after_discount, delivery_region, delivery_cost,
              terms_delivery_time, terms_delivery_method, terms_payment,
              terms_warranty, terms_validity, valid_until, comment, internal_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              offerNumber, shareToken, clientId, offer.salesperson.id, offer.salesperson.name,
              offer.projectName, offer.status || 'draft', offer.totalNet, offer.discount,
              offer.discountValue, offer.totalNetAfterDiscount, offer.deliveryRegion,
              offer.deliveryCost, offer.terms.deliveryTime, offer.terms.deliveryMethod,
              offer.terms.paymentTerms, offer.terms.warranty, offer.terms.validity,
              offer.validUntil, offer.comment, offer.internalNotes
            ],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                res.status(500).json({ error: err.message });
                return;
              }
              
              const offerId = this.lastID;
              
              const stmt = db.prepare(
                `INSERT INTO offer_items (
                  offer_id, product, product_name, expositor_type, material,
                  material_name, thickness, width, height, depth, quantity,
                  unit_price, total_price, surface, weight, options, calculations
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
              );
              
              offer.items.forEach(item => {
                stmt.run(
                  offerId, item.product, item.productName, item.expositorType,
                  item.material, item.materialName, item.thickness,
                  item.dimensions.width, item.dimensions.height, item.dimensions.depth,
                  item.quantity, item.unitPrice, item.totalPrice,
                  item.calculations?.surface, item.calculations?.weight,
                  JSON.stringify(item.options || {}),
                  JSON.stringify(item.calculations || {})
                );
              });
              
              stmt.finalize(() => {
                db.run('COMMIT');
                res.json({
                  id: offerId,
                  number: offerNumber,
                  shareLink: `${process.env.BASE_URL || 'http://localhost:3000'}/oferta/${shareToken}`
                });
              });
            }
          );
        };
        
        if (existingClient) {
          db.run(
            `UPDATE clients SET name = ?, address = ?, email = ?, phone = ?,
             regon = ?, wojewodztwo = ?, powiat = ?, gmina = ?
             WHERE id = ?`,
            [
              offer.client.name, offer.client.address, offer.client.email,
              offer.client.phone, offer.client.regon, offer.client.wojewodztwo,
              offer.client.powiat, offer.client.gmina, existingClient.id
            ],
            (err) => {
              if (err) {
                db.run('ROLLBACK');
                res.status(500).json({ error: err.message });
                return;
              }
              saveOffer(existingClient.id);
            }
          );
        } else {
          db.run(
            `INSERT INTO clients (
              nip, name, address, email, phone, regon,
              wojewodztwo, powiat, gmina
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              offer.client.nip, offer.client.name, offer.client.address,
              offer.client.email, offer.client.phone, offer.client.regon,
              offer.client.wojewodztwo, offer.client.powiat, offer.client.gmina
            ],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                res.status(500).json({ error: err.message });
                return;
              }
              saveOffer(this.lastID);
            }
          );
        }
      }
    );
  });
});

// Aktualizuj status oferty
app.patch('/api/offers/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.run(
    'UPDATE offers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, status });
    }
  );
});

// Start serwera
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  🚀 PlexiSystem Backend is running!
  📍 Port: ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  📂 Database: ${dbPath}
  `);
});