import { useParams } from 'react-router-dom';

export const OfferAcceptancePage = () => {
  const { offerId } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Akceptacja oferty online</h1>
        <p className="text-center mb-4 text-gray-600">Oferta ID: {offerId}</p>

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