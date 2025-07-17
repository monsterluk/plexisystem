// Proxy endpoint dla GUS API (aby ominąć CORS)
// Ten plik powinien być hostowany na serverze (np. Vercel, Netlify Functions)

export default async function handler(req, res) {
  // Włącz CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, nip, regon } = req.body;

  try {
    if (action === 'search') {
      // Tutaj wywołanie do rzeczywistego GUS API
      // Na razie zwracamy mockowe dane
      const mockData = {
        Regon: '146866569',
        Nip: nip || '5252344078',
        Nazwa: 'PLEXISYSTEM ŁUKASZ SIKORRA',
        Wojewodztwo: 'POMORSKIE',
        Miejscowosc: 'GDAŃSK',
        KodPocztowy: '80-180',
        Ulica: 'KARTUSKA',
      };

      res.status(200).json({ success: true, data: mockData });
    } else {
      res.status(400).json({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
