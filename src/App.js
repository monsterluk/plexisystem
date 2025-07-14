import React, { useState } from 'react';
import './App.css';
import { handlePrintPDF } from './generate-pdf';

function App() {
  const [currentOffer, setCurrentOffer] = useState({
    client: {
      nip: '',
      name: '',
      address: '',
      regon: '',
      wojewodztwo: '',
      powiat: '',
      gmina: ''
    }
  });

  const handleNipChange = async (e) => {
    const value = e.target.value;
    const onlyDigits = value.replace(/\D/g, '');

    setCurrentOffer((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        nip: onlyDigits
      }
    }));

    if (onlyDigits.length === 10) {
      try {
        const res = await fetch(`https://wl-api.mf.gov.pl/api/search/nip/${onlyDigits}?date=2024-01-01`);
        const data = await res.json();
        const subject = data.result?.subject;

        if (subject) {
          setCurrentOffer((prev) => ({
            ...prev,
            client: {
              ...prev.client,
              name: subject.name || '',
              address: subject.workingAddress || '',
              regon: subject.regon || '',
              wojewodztwo: subject.residenceAddress?.split(',')[2]?.trim() || '',
              powiat: subject.residenceAddress?.split(',')[3]?.trim() || '',
              gmina: subject.residenceAddress?.split(',')[4]?.trim() || ''
            }
          }));
        }
      } catch (error) {
        console.error('Błąd pobierania danych z GUS:', error);
      }
    }
  };

  const handleShareLink = (offer) => {
    const offerId = `DB-2025-0001-x7k9m`;
    const link = `https://plexisystem.pl/oferta/${offerId}`;
    navigator.clipboard.writeText(link);
    alert(`Link skopiowany: ${link}`);
  };

  const handleSendEmail = (offer) => {
    const subject = `Oferta: ${offer.client.name || 'Nowa oferta'}`;
    const body = `Dzień dobry,\n\nPrzesyłamy ofertę przygotowaną dla Państwa. Prosimy o zapoznanie się i akceptację pod linkiem:\nhttps://plexisystem.pl/oferta/DB-2025-0001-x7k9m\n\nPozdrawiamy,\nZespół PlexiSystem`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Formularz klienta</h1>
      <input
        type="text"
        value={currentOffer.client.nip}
        onChange={handleNipChange}
        onFocus={(e) => e.target.select()}
        className="flex-1 bg-zinc-700 text-white rounded-lg px-3 py-2"
        placeholder="Wprowadź NIP"
        maxLength="10"
      />

      {currentOffer.client.name && (
        <div className="mt-4 bg-zinc-800 text-white p-4 rounded-lg space-y-1">
          <p><strong>Nazwa:</strong> {currentOffer.client.name}</p>
          <p><strong>Adres:</strong> {currentOffer.client.address}</p>
          <p><strong>REGON:</strong> {currentOffer.client.regon}</p>
          <p><strong>Województwo:</strong> {currentOffer.client.wojewodztwo}</p>
          <p><strong>Powiat:</strong> {currentOffer.client.powiat}</p>
          <p><strong>Gmina:</strong> {currentOffer.client.gmina}</p>
        </div>
      )}

      <div className="mt-4 space-x-4">
        <button className="bg-blue-600 text-white py-2 px-4 rounded" onClick={() => handlePrintPDF(currentOffer)}>Drukuj PDF</button>
        <button className="bg-orange-500 text-white py-2 px-4 rounded" onClick={() => handleShareLink(currentOffer)}>Udostępnij link</button>
        <button className="bg-green-600 text-white py-2 px-4 rounded" onClick={() => handleSendEmail(currentOffer)}>Wyślij e-mail</button>
      </div>
    </div>
  );
}

export default App;

// Komponent akceptacji (pozostaje jak masz)
export const OfferAcceptancePage = ({ shareLink }) => {
  const offerId = shareLink.split('-').pop();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Akceptacja oferty online</h1>
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
          <p className="text-lg mb-4">
            Akceptując tę ofertę, zgadzasz się na warunki handlowe przedstawione w dokumencie.
          </p>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            ✓ Akceptuję ofertę
          </button>
        </div>
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">
            ✗ Odrzuć ofertę
          </button>
        </div>
      </div>
    </div>
  );
};