import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="max-w-md w-full text-center">
        <Shield className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Brak dostępu</h1>
        <p className="text-gray-400 mb-8">
          Nie masz uprawnień do przeglądania tej strony. Skontaktuj się z administratorem, 
          aby uzyskać odpowiednie uprawnienia.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Wróć
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;