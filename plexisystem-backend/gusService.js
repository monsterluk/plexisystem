// gusService.js - Serwis do komunikacji z API GUS BIR1.2
const axios = require('axios');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

class GUSService {
  constructor() {
    this.apiKey = 'cc8f3d1743644ffc9b15';
    this.baseUrl = 'https://wl-api.mf.gov.pl';
    this.sessionId = null;
    this.sessionTimestamp = null;
  }

  // Budowanie SOAP envelope
  buildSoapEnvelope(action, body) {
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
  <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
    <wsa:To>${this.baseUrl}</wsa:To>
    <wsa:Action>${action}</wsa:Action>
  </soap:Header>
  <soap:Body>
    ${body}
  </soap:Body>
</soap:Envelope>`;
  }

  // Parsowanie odpowiedzi SOAP
  parseSoapResponse(xmlResponse) {
    const parser = new XMLParser({
      ignoreAttributes: false,
      removeNSPrefix: true
    });
    
    const result = parser.parse(xmlResponse);
    const envelope = result.Envelope || result['soap:Envelope'] || result['s:Envelope'];
    const body = envelope?.Body || envelope?.['soap:Body'] || envelope?.['s:Body'];
    
    return body;
  }

  // Logowanie do API GUS
  async login() {
    try {
      const loginBody = `
        <ns:Zaloguj>
          <ns:pKluczUzytkownika>${this.apiKey}</ns:pKluczUzytkownika>
        </ns:Zaloguj>
      `;

      const envelope = this.buildSoapEnvelope(
        'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj',
        loginBody
      );

      const response = await axios.post(this.baseUrl, envelope, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'Accept': 'application/soap+xml'
        }
      });

      const parsed = this.parseSoapResponse(response.data);
      const sessionId = parsed?.ZalogujResponse?.ZalogujResult;

      if (sessionId) {
        this.sessionId = sessionId;
        this.sessionTimestamp = Date.now();
        console.log('Zalogowano do GUS, sesja:', sessionId);
        return sessionId;
      } else {
        throw new Error('Nie udało się uzyskać sesji GUS');
      }
    } catch (error) {
      console.error('Błąd logowania do GUS:', error.message);
      throw error;
    }
  }

  // Sprawdź i odnów sesję jeśli potrzeba
  async ensureSession() {
    const SESSION_TIMEOUT = 55 * 60 * 1000; // 55 minut

    if (!this.sessionId || !this.sessionTimestamp || 
        (Date.now() - this.sessionTimestamp) > SESSION_TIMEOUT) {
      await this.login();
    }

    return this.sessionId;
  }

  // Wyszukiwanie po NIP
  async searchByNIP(nip) {
    try {
      const sessionId = await this.ensureSession();
      const cleanNip = nip.replace(/[^0-9]/g, '');

      const searchBody = `
        <ns:DaneSzukajPodmioty>
          <ns:pParametryWyszukiwania>
            <ns:Nip>${cleanNip}</ns:Nip>
          </ns:pParametryWyszukiwania>
        </ns:DaneSzukajPodmioty>
      `;

      const envelope = this.buildSoapEnvelope(
        'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty',
        searchBody
      );

      const response = await axios.post(this.baseUrl, envelope, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'Accept': 'application/soap+xml',
          'sid': sessionId
        }
      });

      const parsed = this.parseSoapResponse(response.data);
      const searchResult = parsed?.DaneSzukajPodmiotyResponse?.DaneSzukajPodmiotyResult;

      if (!searchResult) {
        return null;
      }

      // Parsuj wynik (jest w formacie XML string)
      const resultParser = new XMLParser({
        ignoreAttributes: false,
        removeNSPrefix: true
      });
      
      const data = resultParser.parse(searchResult);
      const podmiot = data?.root?.dane || data?.dane;

      if (!podmiot) {
        return null;
      }

      // Pobierz pełne dane podmiotu
      const fullData = await this.getFullData(podmiot.Regon, podmiot.Typ);

      return {
        nip: podmiot.Nip || cleanNip,
        name: podmiot.Nazwa || '',
        regon: podmiot.Regon || '',
        wojewodztwo: podmiot.Wojewodztwo || '',
        powiat: podmiot.Powiat || '',
        gmina: podmiot.Gmina || '',
        miejscowosc: podmiot.Miejscowosc || '',
        kodPocztowy: podmiot.KodPocztowy || '',
        ulica: podmiot.Ulica || '',
        nrNieruchomosci: podmiot.NrNieruchomosci || '',
        nrLokalu: podmiot.NrLokalu || '',
        typ: podmiot.Typ || '',
        ...fullData
      };
    } catch (error) {
      console.error('Błąd wyszukiwania w GUS:', error);
      return null;
    }
  }

  // Pobierz pełne dane podmiotu
  async getFullData(regon, typ) {
    try {
      const sessionId = await this.ensureSession();
      
      // Wybierz odpowiedni raport w zależności od typu
      let raportName = 'BIR11OsPrawna';
      if (typ === 'F') {
        raportName = 'BIR11OsFizycznaDaneOgolne';
      } else if (typ === 'LF') {
        raportName = 'BIR11OsFizycznaDzialalnoscCeidg';
      }

      const reportBody = `
        <ns:DanePobierzPelnyRaport>
          <ns:pRegon>${regon}</ns:pRegon>
          <ns:pNazwaRaportu>${raportName}</ns:pNazwaRaportu>
        </ns:DanePobierzPelnyRaport>
      `;

      const envelope = this.buildSoapEnvelope(
        'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DanePobierzPelnyRaport',
        reportBody
      );

      const response = await axios.post(this.baseUrl, envelope, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'Accept': 'application/soap+xml',
          'sid': sessionId
        }
      });

      const parsed = this.parseSoapResponse(response.data);
      const reportResult = parsed?.DanePobierzPelnyRaportResponse?.DanePobierzPelnyRaportResult;

      if (!reportResult) {
        return {};
      }

      const resultParser = new XMLParser({
        ignoreAttributes: false,
        removeNSPrefix: true
      });
      
      const data = resultParser.parse(reportResult);
      const dane = data?.root?.dane || data?.dane || {};

      // Zwróć dodatkowe dane
      return {
        email: dane.praw_adresEmail || dane.fiz_adresEmail || '',
        telefon: dane.praw_numerTelefonu || dane.fiz_numerTelefonu || '',
        dataRozpoczecia: dane.praw_dataRozpoczeciaDzialalnosci || dane.fiz_dataRozpoczeciaDzialalnosci || '',
        formaWlasnosci: dane.praw_formaWlasnosci_Nazwa || '',
        organRejestrowy: dane.praw_organRejestrowy_Nazwa || '',
        numerWRejestrzeEwidencji: dane.praw_numerWRejestrzeEwidencji || dane.fiz_numerWRejestrzeEwidencji || ''
      };
    } catch (error) {
      console.error('Błąd pobierania pełnych danych:', error);
      return {};
    }
  }

  // Formatowanie adresu
  formatAddress(data) {
    const parts = [];
    
    if (data.ulica) {
      parts.push(data.ulica);
    }
    
    if (data.nrNieruchomosci) {
      parts.push(data.nrNieruchomosci);
    }
    
    if (data.nrLokalu) {
      parts.push(`lok. ${data.nrLokalu}`);
    }
    
    const street = parts.join(' ');
    const city = data.kodPocztowy && data.miejscowosc 
      ? `${data.kodPocztowy} ${data.miejscowosc}` 
      : data.miejscowosc;
    
    return [street, city].filter(Boolean).join(', ');
  }
}

module.exports = new GUSService();
