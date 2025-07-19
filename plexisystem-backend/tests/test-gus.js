// test-gus.js - Test bezpośredniego połączenia z GUS API
const axios = require('axios');
const xml2js = require('xml2js');

const API_KEY = 'cc8f3d1743644ffc9b15';
const API_URL = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';

async function testGusConnection() {
  console.log('=== Test połączenia z GUS API ===\n');
  
  try {
    // 1. Test logowania
    console.log('1. Próba logowania do GUS...');
    
    const loginXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
  <soap:Body>
    <ns:Zaloguj>
      <ns:pKluczUzytkownika>${API_KEY}</ns:pKluczUzytkownika>
    </ns:Zaloguj>
  </soap:Body>
</soap:Envelope>`;

    console.log('Wysyłam żądanie logowania...');
    
    const loginResponse = await axios.post(API_URL, loginXml, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'Accept': 'application/xop+xml',
        'SOAPAction': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj'
      },
      timeout: 30000
    });
    
    console.log('Otrzymano odpowiedź, status:', loginResponse.status);
    
    // Parsuj odpowiedź
    const parser = new xml2js.Parser({ 
      explicitArray: false,
      ignoreAttrs: true,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    });
    
    const result = await parser.parseStringPromise(loginResponse.data);
    
    // Znajdź SID
    let sid = null;
    if (result.Envelope?.Body?.ZalogujResponse?.ZalogujResult) {
      sid = result.Envelope.Body.ZalogujResponse.ZalogujResult;
    } else if (result.Body?.ZalogujResponse?.ZalogujResult) {
      sid = result.Body.ZalogujResponse.ZalogujResult;
    }
    
    if (sid) {
      console.log('✅ Zalogowano pomyślnie! SID:', sid);
      
      // 2. Test wyszukiwania
      console.log('\n2. Test wyszukiwania firmy (NIP: 5252344078)...');
      
      const searchXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07" xmlns:dat="http://CIS/BIR/PUBL/2014/07/DataContract">
  <soap:Body>
    <ns:DaneSzukajPodmioty>
      <ns:pParametryWyszukiwania>
        <dat:Nip>5252344078</dat:Nip>
      </ns:pParametryWyszukiwania>
    </ns:DaneSzukajPodmioty>
  </soap:Body>
</soap:Envelope>`;

      const searchResponse = await axios.post(API_URL, searchXml, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'Accept': 'application/xop+xml',
          'sid': sid,
          'SOAPAction': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty'
        },
        timeout: 30000
      });
      
      console.log('Otrzymano odpowiedź wyszukiwania, status:', searchResponse.status);
      
      const searchResult = await parser.parseStringPromise(searchResponse.data);
      
      // Znajdź wyniki
      let searchData = null;
      if (searchResult.Envelope?.Body?.DaneSzukajPodmiotyResponse?.DaneSzukajPodmiotyResult) {
        searchData = searchResult.Envelope.Body.DaneSzukajPodmiotyResponse.DaneSzukajPodmiotyResult;
      } else if (searchResult.Body?.DaneSzukajPodmiotyResponse?.DaneSzukajPodmiotyResult) {
        searchData = searchResult.Body.DaneSzukajPodmiotyResponse.DaneSzukajPodmiotyResult;
      }
      
      if (searchData) {
        console.log('✅ Otrzymano dane!');
        console.log('Surowe dane:', searchData.substring(0, 200) + '...');
        
        // Parsuj XML z danymi
        const dataParser = new xml2js.Parser({ 
          explicitArray: false,
          ignoreAttrs: true
        });
        
        const firmData = await dataParser.parseStringPromise(searchData);
        const dane = firmData?.root?.dane || firmData?.dane;
        
        if (dane) {
          console.log('\n📋 Dane firmy:');
          console.log('- Nazwa:', dane.Nazwa);
          console.log('- NIP:', dane.Nip);
          console.log('- REGON:', dane.Regon);
          console.log('- Adres:', dane.Ulica, dane.NrNieruchomosci, dane.KodPocztowy, dane.Miejscowosc);
        }
      } else {
        console.log('❌ Brak danych w odpowiedzi');
        console.log('Struktura odpowiedzi:', JSON.stringify(searchResult, null, 2));
      }
      
      // 3. Wylogowanie
      console.log('\n3. Wylogowanie...');
      const logoutXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
  <soap:Body>
    <ns:Wyloguj>
      <ns:pIdentyfikatorSesji>${sid}</ns:pIdentyfikatorSesji>
    </ns:Wyloguj>
  </soap:Body>
</soap:Envelope>`;

      await axios.post(API_URL, logoutXml, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'Accept': 'application/xop+xml',
          'SOAPAction': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Wyloguj'
        },
        timeout: 10000
      });
      
      console.log('✅ Wylogowano pomyślnie');
      
    } else {
      console.log('❌ Nie otrzymano SID');
      console.log('Struktura odpowiedzi:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('\n❌ Błąd:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data?.substring(0, 500));
    }
  }
}

// Uruchom test
testGusConnection();
