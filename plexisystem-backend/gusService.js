// gusService.js - Poprawiona wersja z oficjalnym URL GUS
const soap = require('soap');
const xml2js = require('xml2js');
const axios = require('axios');

class GUSService {
  constructor() {
    this.apiKey = 'cc8f3d1743644ffc9b15';
    // Oficjalny URL z maila GUS
    this.wsdlUrl = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc?wsdl';
    this.apiUrl = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';
    this.client = null;
    this.sid = null;
    this.lastLoginTime = null;
  }

  async init() {
    try {
      if (!this.client) {
        console.log('Inicjalizacja klienta SOAP dla GUS...');
        
        // Użyj axios jako HTTP client dla lepszej kontroli
        const soapOptions = {
          endpoint: this.apiUrl,
          escapeXML: false,
          forceSoap12Headers: true,
          httpClient: axios,
          request: (url, data, callback, headers) => {
            axios({
              method: 'POST',
              url: url,
              data: data,
              headers: {
                'Content-Type': 'application/soap+xml; charset=utf-8',
                'Accept': 'application/xop+xml',
                ...headers
              },
              timeout: 30000,
              maxContentLength: 50 * 1024 * 1024
            })
            .then(response => callback(null, response, response.data))
            .catch(error => callback(error));
          }
        };
        
        this.client = await soap.createClientAsync(this.wsdlUrl, soapOptions);
        console.log('Klient SOAP zainicjalizowany');
      }
      return true;
    } catch (error) {
      console.error('Błąd inicjalizacji SOAP:', error.message);
      throw error;
    }
  }

  async login() {
    try {
      console.log('Logowanie do GUS z kluczem:', this.apiKey);
      
      // Przygotuj XML zgodnie z przykładem
      const loginXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
  <soap:Body>
    <ns:Zaloguj>
      <ns:pKluczUzytkownika>${this.apiKey}</ns:pKluczUzytkownika>
    </ns:Zaloguj>
  </soap:Body>
</soap:Envelope>`;

      const response = await axios.post(this.apiUrl, loginXml, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'Accept': 'application/xop+xml',
          'SOAPAction': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj'
        },
        timeout: 30000
      });

      // Parsuj odpowiedź
      const parser = new xml2js.Parser({ 
        explicitArray: false,
        ignoreAttrs: true,
        tagNameProcessors: [xml2js.processors.stripPrefix]
      });
      
      const result = await parser.parseStringPromise(response.data);
      
      // Znajdź SID w różnych możliwych lokalizacjach
      let sid = null;
      if (result.Envelope?.Body?.ZalogujResponse?.ZalogujResult) {
        sid = result.Envelope.Body.ZalogujResponse.ZalogujResult;
      } else if (result.Body?.ZalogujResponse?.ZalogujResult) {
        sid = result.Body.ZalogujResponse.ZalogujResult;
      }

      if (sid) {
        this.sid = sid;
        this.lastLoginTime = Date.now();
        console.log('Zalogowano do GUS, SID:', this.sid);
        return this.sid;
      } else {
        console.error('Odpowiedź GUS:', JSON.stringify(result, null, 2));
        throw new Error('Nie otrzymano SID z GUS');
      }
      
    } catch (error) {
      console.error('Błąd logowania do GUS:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        console.error('Data:', error.response.data?.substring(0, 1000));
      }
      throw error;
    }
  }

  async ensureSession() {
    const SESSION_TIMEOUT = 55 * 60 * 1000; // 55 minut
    
    if (!this.sid || !this.lastLoginTime || 
        (Date.now() - this.lastLoginTime) > SESSION_TIMEOUT) {
      await this.login();
    }
    
    return this.sid;
  }

  async searchByNIP(nip) {
    try {
      const sid = await this.ensureSession();
      const cleanNip = nip.replace(/[^0-9]/g, '');
      
      console.log('Szukam w GUS po NIP:', cleanNip);

      const searchXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07" xmlns:dat="http://CIS/BIR/PUBL/2014/07/DataContract">
  <soap:Body>
    <ns:DaneSzukajPodmioty>
      <ns:pParametryWyszukiwania>
        <dat:Nip>${cleanNip}</dat:Nip>
      </ns:pParametryWyszukiwania>
    </ns:DaneSzukajPodmioty>
  </soap:Body>
</soap:Envelope>`;

      const response = await axios.post(this.apiUrl, searchXml, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'Accept': 'application/xop+xml',
          'sid': sid,
          'SOAPAction': 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty'
        },
        timeout: 30000
      });

      // Parsuj główną odpowiedź
      const parser = new xml2js.Parser({ 
        explicitArray: false,
        ignoreAttrs: true,
        tagNameProcessors: [xml2js.processors.stripPrefix]
      });
      
      const result = await parser.parseStringPromise(response.data);
      
      // Znajdź wyniki
      let searchResult = null;
      if (result.Envelope?.Body?.DaneSzukajPodmiotyResponse?.DaneSzukajPodmiotyResult) {
        searchResult = result.Envelope.Body.DaneSzukajPodmiotyResponse.DaneSzukajPodmiotyResult;
      } else if (result.Body?.DaneSzukajPodmiotyResponse?.DaneSzukajPodmiotyResult) {
        searchResult = result.Body.DaneSzukajPodmiotyResponse.DaneSzukajPodmiotyResult;
      }

      if (!searchResult) {
        console.log('Brak wyników dla NIP:', cleanNip);
        return null;
      }

      // Parsuj wyniki (są w formacie XML string)
      const dataParser = new xml2js.Parser({ 
        explicitArray: false,
        ignoreAttrs: true
      });
      
      const searchData = await dataParser.parseStringPromise(searchResult);
      const dane = searchData?.root?.dane || searchData?.dane;

      if (!dane) {
        console.log('Brak danych w odpowiedzi');
        return null;
      }

      console.log('Znaleziono firmę:', dane.Nazwa);

      // Formatuj adres zgodnie z przykładem
      const addressParts = [];
      if (dane.Ulica) {
        addressParts.push(dane.Ulica);
      }
      if (dane.NrNieruchomosci) {
        addressParts.push(dane.NrNieruchomosci);
      }
      if (dane.NrLokalu) {
        addressParts.push(`lok. ${dane.NrLokalu}`);
      }
      
      const street = addressParts.join(' ');
      const city = [dane.KodPocztowy, dane.Miejscowosc].filter(Boolean).join(' ');
      const address = [street, city].filter(Boolean).join(', ');

      return {
        nip: dane.Nip || cleanNip,
        name: dane.Nazwa || '',
        address: address,
        regon: dane.Regon || '',
        wojewodztwo: dane.Wojewodztwo || '',
        powiat: dane.Powiat || '',
        gmina: dane.Gmina || '',
        email: '',
        phone: '',
        statusNip: dane.StatusNip || '',
        typ: dane.Typ || ''
      };

    } catch (error) {
      console.error('Błąd wyszukiwania w GUS:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data?.substring(0, 1000));
      }
      
      // Jeśli sesja wygasła, spróbuj ponownie
      if (error.response && error.response.data && 
          (error.response.data.includes('nieaktywny') || error.response.data.includes('nieważny'))) {
        console.log('Sesja wygasła, ponawiam...');
        this.sid = null;
        return this.searchByNIP(nip);
      }
      
      throw error;
    }
  }

  async logout() {
    try {
      if (this.sid) {
        console.log('Wylogowanie z GUS...');
        const logoutXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
  <soap:Body>
    <ns:Wyloguj>
      <ns:pIdentyfikatorSesji>${this.sid}</ns:pIdentyfikatorSesji>
    </ns:Wyloguj>
  </soap:Body>
</soap:Envelope>`;

        await axios.post(this.apiUrl, logoutXml, {
          headers: {
            'Content-Type': 'application/soap+xml; charset=utf-8',
            'Accept': 'application/xop+xml'
          },
          timeout: 10000
        });
        
        console.log('Wylogowano z GUS');
      }
    } catch (error) {
      console.error('Błąd wylogowania:', error.message);
    } finally {
      this.sid = null;
      this.lastLoginTime = null;
    }
  }
}

module.exports = new GUSService();
